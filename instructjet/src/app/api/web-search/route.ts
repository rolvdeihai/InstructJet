import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { checkSufficientTokens, deductTokens } from '@/lib/token-manager';

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

const EXA_API_KEY = process.env.EXA_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// ---------- Helper: Keyword extraction ----------
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'what', 'which', 'why', 'how', 'give', 'me', 'more', 'info',
  'about', 'please', 'can', 'could', 'would', 'should', 'do', 'does', 'did'
]);

function extractKeywords(query: string): { primaryKeyword: string; allKeywords: string[] } {
  const cleaned = query.toLowerCase().replace(/[^\w\s]/g, '');
  const words = cleaned.split(/\s+/).filter(w => w.length > 1 && !STOPWORDS.has(w));
  if (words.length === 0) return { primaryKeyword: query, allKeywords: [query] };
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i+1]}`);
  }
  let primary = bigrams.length > 0 ? bigrams[0] : words[0];
  const allKeywords = [...new Set([primary, ...words.slice(0, 3)])];
  return { primaryKeyword: primary, allKeywords };
}

function isQuestionQuery(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  const pattern = [
    'what','why','how','when','where','who','which',
    'apa','mengapa','kenapa','bagaimana','kapan','dimana','siapa',
    'que','por que','como','cuando','donde','quien','cual',
    'o que','por que','como','quando','onde','quem','qual',
    'ano','bakit','paano','kailan','saan','sino','alin',
    'kya','kyon','kaise','kab','kahan','kaun',
    'enna','yen','eppadi','eppodhu','engu','yar'
  ];
  const questionRegex = new RegExp(`\\b(${pattern.join('|')})\\b`, 'i');
  const chineseQuestion = /(什么|为什么|怎么|如何|什么时候|哪里|哪儿|谁|哪个|几|是否)/;
  const chineseParticles = /(吗|呢)$/;
  return normalized.endsWith('?') || questionRegex.test(normalized) || chineseQuestion.test(query) || chineseParticles.test(query);
}

function determineSearchQuery(originalQuery: string, primaryKeyword: string): string {
  const wordCount = originalQuery.trim().split(/\s+/).length;
  if (wordCount <= 15 && isQuestionQuery(originalQuery)) return originalQuery;
  return `give me more information about ${primaryKeyword}`;
}

function simpleSummarize(results: SearchResult[], maxSentences: number = 4): string {
  if (!results.length) return "No content to summarize.";
  const fullText = results.map(r => `${r.title}. ${r.snippet}`).join(' ');
  const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) return results[0].snippet.substring(0, 300);
  const words = fullText.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
  const wordFreq: Record<string, number> = {};
  for (const w of words) wordFreq[w] = (wordFreq[w] || 0) + 1;
  const sentenceScores = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    let score = 0;
    for (const w of sentenceWords) score += wordFreq[w] || 0;
    return { sentence: sentence.trim(), score: score / (sentenceWords.length || 1) };
  });
  const sorted = sentenceScores.sort((a, b) => b.score - a.score);
  const uniqueSentences: string[] = [];
  for (const item of sorted) {
    const prefix = item.sentence.substring(0, 50);
    if (!uniqueSentences.some(s => s.substring(0, 50) === prefix)) {
      uniqueSentences.push(item.sentence);
      if (uniqueSentences.length >= maxSentences) break;
    }
  }
  let summary = uniqueSentences.join(' ');
  if (summary.length > 800) summary = summary.substring(0, 800) + '...';
  return summary || results[0].snippet.substring(0, 300);
}

function extractMediumItems(xml: string) {
  const items: { title: string; description: string; link: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    if (!titleMatch) continue;
    const title = titleMatch[1];
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    if (!linkMatch) continue;
    const link = linkMatch[1];
    let description = '';
    const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s);
    if (descMatch) description = descMatch[1];
    else {
      const descNoCDATA = itemXml.match(/<description>(.*?)<\/description>/s);
      if (descNoCDATA) description = descNoCDATA[1];
    }
    description = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    items.push({ title, description, link });
  }
  return items;
}

export async function POST(req: NextRequest) {
  // 1. Authenticate using custom session cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Check tokens for web search (3000)
  const hasTokens = await checkSufficientTokens(user.id, 3000);
  if (!hasTokens) {
    return NextResponse.json(
      { error: 'Insufficient tokens for web search. Please purchase more tokens.' },
      { status: 402 }
    );
  }

  const { query, maxResults = 5, simulateError } = await req.json();
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  // Extract keywords and determine search query
  const { primaryKeyword, allKeywords } = extractKeywords(query);
  const searchQuery = determineSearchQuery(query, primaryKeyword);
  console.log(`[WebSearch] Original: "${query}" -> Search: "${searchQuery}"`);

  const sourcesUsed: string[] = [];
  let results: SearchResult[] = [];

  // Primary: Exa
  if (EXA_API_KEY && !shouldSimulateError(simulateError, 'exa')) {
    try {
      const exaRes = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_API_KEY },
        body: JSON.stringify({ query: searchQuery, numResults: maxResults, contents: { text: true } }),
      });
      if (exaRes.ok) {
        const exaData = await exaRes.json();
        results = exaData.results.map((r: any) => ({
          title: r.title || 'Untitled',
          snippet: r.text?.substring(0, 300) || r.description || 'No description',
          url: r.url,
        }));
        sourcesUsed.push(`Exa (query: "${searchQuery}")`);
      }
    } catch (err) { console.error('Exa error:', err); }
  }

  // Secondary: Tavily
  if (results.length === 0 && TAVILY_API_KEY && !shouldSimulateError(simulateError, 'tavily')) {
    try {
      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: TAVILY_API_KEY, query: searchQuery, max_results: maxResults, include_answer: false }),
      });
      if (tavilyRes.ok) {
        const tavilyData = await tavilyRes.json();
        results = tavilyData.results.map((r: any) => ({
          title: r.title,
          snippet: r.content.substring(0, 300),
          url: r.url,
        }));
        sourcesUsed.push(`Tavily (query: "${searchQuery}")`);
      }
    } catch (err) { console.error('Tavily error:', err); }
  }

  // Aggregated fallback: Medium + Wikipedia + StackExchange
  if (results.length === 0) {
    console.log(`[WebSearch] Primary sources failed – starting aggregated fallback`);
    const fallbackPromises: Promise<SearchResult[]>[] = [];

    // Medium
    fallbackPromises.push((async () => {
      try {
        let tag = primaryKeyword.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        tag = tag.replace(/^-+|-+$/g, '').substring(0, 50);
        if (!tag) tag = 'general';
        const mediumRssUrl = `https://medium.com/feed/tag/${encodeURIComponent(tag)}`;
        const response = await fetch(mediumRssUrl);
        if (!response.ok) return [];
        const text = await response.text();
        const items = extractMediumItems(text);
        return items.slice(0, maxResults).map((item: any) => ({
          title: item.title,
          snippet: (item.description || '').substring(0, 300),
          url: item.link
        }));
      } catch (err) { return []; }
    })());

    // Wikipedia
    fallbackPromises.push((async () => {
      try {
        for (const wikiQuery of [query, primaryKeyword]) {
          const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiQuery)}&format=json&origin=*`);
          if (wikiRes.ok) {
            const wikiData = await wikiRes.json();
            const pages = wikiData.query?.search || [];
            if (pages.length) {
              return pages.slice(0, maxResults).map((page: any) => ({
                title: page.title,
                snippet: page.snippet.replace(/<\/?span[^>]*>/g, '').substring(0, 300),
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`
              }));
            }
          }
        }
        return [];
      } catch (err) { return []; }
    })());

    // StackExchange
    fallbackPromises.push((async () => {
      try {
        const sites = ['stackoverflow', 'superuser', 'serverfault', 'askubuntu'];
        let allResults: SearchResult[] = [];
        for (const site of sites) {
          for (const stackQuery of [query, primaryKeyword]) {
            const apiUrl = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(stackQuery)}&site=${site}&filter=withbody`;
            const response = await fetch(apiUrl);
            if (response.ok) {
              const data = await response.json();
              if (data.items && data.items.length) {
                const siteResults = data.items.map((item: any) => ({
                  title: item.title,
                  snippet: (item.body || '').replace(/<[^>]*>/g, '').substring(0, 300),
                  url: item.link
                }));
                allResults.push(...siteResults);
                break;
              }
            }
          }
        }
        return allResults.slice(0, maxResults);
      } catch (err) { return []; }
    })());

    const allResultsArrays = await Promise.all(fallbackPromises);
    const merged = new Map<string, SearchResult>();
    for (const resArray of allResultsArrays) {
      for (const res of resArray) {
        if (!merged.has(res.url)) merged.set(res.url, res);
      }
    }
    results = Array.from(merged.values()).slice(0, 15);
    if (results.length > 0) sourcesUsed.push('AggregatedFallback(Medium+Wikipedia+StackExchange)');
  }

  // Generate summary
  let summary = '';
  if (results.length > 0) summary = simpleSummarize(results, 4);

  if (results.length === 0) {
    return NextResponse.json({ error: 'No results found from any source' }, { status: 404 });
  }

  // 3. Deduct tokens after successful search
  await deductTokens(user.id, 3000, 'web_search', {
    query,
    result_count: results.length,
    sources: sourcesUsed
  });

  return NextResponse.json({
    results,
    summary,
    source: sourcesUsed[sourcesUsed.length - 1],
    allSources: sourcesUsed,
    usedKeywords: { primary: primaryKeyword, all: allKeywords }
  });
}

function shouldSimulateError(simulateError: string | undefined, source: string): boolean {
  return simulateError === source;
}