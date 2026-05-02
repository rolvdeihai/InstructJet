// app/api/web-search/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

const EXA_API_KEY = process.env.EXA_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// ---------- Helper: Keyword extraction (up to 2 words / bigrams) ----------
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
  
  // Generate bigrams from original words (preserving order)
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i+1]}`);
  }
  
  // Prefer longest meaningful bigram, else first word
  let primary = '';
  if (bigrams.length > 0) {
    primary = bigrams[0]; // first bigram
  } else {
    primary = words[0];
  }
  
  // Also keep individual keywords up to 3
  const allKeywords = [...new Set([primary, ...words.slice(0, 3)])];
  return { primaryKeyword: primary, allKeywords };
}

// ---------- Helper: Decide which query to send to search APIs ----------
function isQuestionQuery(query: string): boolean {
  const normalized = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const pattern = [
    // English
    'what','why','how','when','where','who','which',

    // Indonesian
    'apa','mengapa','kenapa','bagaimana','kapan','dimana','siapa',

    // Spanish
    'que','por que','como','cuando','donde','quien','cual',

    // Portuguese
    'o que','por que','como','quando','onde','quem','qual',

    // Filipino
    'ano','bakit','paano','kailan','saan','sino','alin',

    // Hindi (latinized for simplicity)
    'kya','kyon','kaise','kab','kahan','kaun',

    // Tamil (latinized)
    'enna','yen','eppadi','eppodhu','engu','yar'
  ];

  const questionRegex = new RegExp(`\\b(${pattern.join('|')})\\b`, 'i');

  // Chinese
  const chineseQuestion = /(什么|为什么|怎么|如何|什么时候|哪里|哪儿|谁|哪个|几|是否)/;
  const chineseParticles = /(吗|呢)$/;

  return (
    normalized.endsWith('?') ||
    questionRegex.test(normalized) ||
    chineseQuestion.test(query) ||
    chineseParticles.test(query)
  );
}

function determineSearchQuery(originalQuery: string, primaryKeyword: string): string {
  const wordCount = originalQuery.trim().split(/\s+/).length;
  // If it's a short question (≤15 words and has question structure), use original query.
  if (wordCount <= 15 && isQuestionQuery(originalQuery)) {
    return originalQuery;
  }
  // Otherwise, ask for general information about the main keyword.
  return `give me more information about ${primaryKeyword}`;
}

// ---------- Helper: Simple summarization (frequency-based) ----------
function simpleSummarize(results: SearchResult[], maxSentences: number = 4): string {
  if (!results.length) return "No content to summarize.";
  
  // Combine all snippets and titles into one text
  const fullText = results.map(r => `${r.title}. ${r.snippet}`).join(' ');
  
  // Split into sentences (simple regex)
  const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) return results[0].snippet.substring(0, 300);
  
  // Tokenize and compute word frequencies (excluding stopwords)
  const words = fullText.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
  const wordFreq: Record<string, number> = {};
  for (const w of words) {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  
  // Score each sentence based on important word frequency
  const sentenceScores = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    let score = 0;
    for (const w of sentenceWords) {
      score += wordFreq[w] || 0;
    }
    // Normalize by sentence length to avoid bias towards long sentences
    return { sentence: sentence.trim(), score: score / (sentenceWords.length || 1) };
  });
  
  // Pick top scoring sentences, remove near-duplicates (by first 50 chars)
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
  // Trim and limit length
  if (summary.length > 800) summary = summary.substring(0, 800) + '...';
  return summary || results[0].snippet.substring(0, 300);
}

// ---------- Helper: Simulate error based on test parameter ----------
function shouldSimulateError(simulateError: string | undefined, source: string): boolean {
  return simulateError === source;
}

// ---------- Main POST handler ----------
export async function POST(req: NextRequest) {
  const { query, maxResults = 5, simulateError } = await req.json();
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }
  
  // Extract keywords and determine the single search query to use
  const { primaryKeyword, allKeywords } = extractKeywords(query);
  const searchQuery = determineSearchQuery(query, primaryKeyword);
  console.log(`[WebSearch] Original query: "${query}"`);
  console.log(`[WebSearch] Extracted primary keyword: "${primaryKeyword}"`);
  console.log(`[WebSearch] Search query sent to APIs: "${searchQuery}"`);
  
  const sourcesUsed: string[] = [];
  let results: SearchResult[] = [];
  
  // ========== PRIMARY: Exa (single query attempt) ==========
  if (EXA_API_KEY && !shouldSimulateError(simulateError, 'exa')) {
    try {
      console.log(`[WebSearch] Trying Exa with query: "${searchQuery}"`);
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
        console.log(`[WebSearch] Exa returned ${results.length} results`);
      } else {
        console.warn(`[WebSearch] Exa failed: ${exaRes.status}`);
      }
    } catch (err) {
      console.error('[WebSearch] Exa error:', err);
    }
  } else if (simulateError === 'exa') {
    console.log('[TEST] Simulating Exa error – skipping');
  }
  
  // ========== SECONDARY: Tavily (single query attempt) ==========
  if (results.length === 0 && TAVILY_API_KEY && !shouldSimulateError(simulateError, 'tavily')) {
    try {
      console.log(`[WebSearch] Trying Tavily with query: "${searchQuery}"`);
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
        console.log(`[WebSearch] Tavily returned ${results.length} results`);
      } else {
        console.warn(`[WebSearch] Tavily failed: ${tavilyRes.status}`);
      }
    } catch (err) {
      console.error('[WebSearch] Tavily error:', err);
    }
  } else if (simulateError === 'tavily') {
    console.log('[TEST] Simulating Tavily error – skipping');
  }
  
  // ========== AGGREGATED FALLBACK: Medium + Wikipedia + StackExchange ==========
  // Only run if primary/secondary gave no results
  if (results.length === 0) {
    console.log(`[WebSearch] Primary sources failed – starting aggregated fallback (Medium + Wikipedia + StackExchange)`);
    
    const fallbackPromises: Promise<SearchResult[]>[] = [];
    
    // ---------- 1. Medium RSS (tag-based using primaryKeyword) ----------
    fallbackPromises.push(
      (async () => {
        try {
          let tag = primaryKeyword.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          tag = tag.replace(/^-+|-+$/g, '').substring(0, 50);
          if (!tag) tag = 'general';
          const mediumRssUrl = `https://medium.com/feed/tag/${encodeURIComponent(tag)}`;
          console.log(`[WebSearch] Medium RSS URL (tag: ${tag}): ${mediumRssUrl}`);
          const response = await fetch(mediumRssUrl);
          if (!response.ok) {
            console.warn(`[WebSearch] Medium returned ${response.status} for tag: ${tag}`);
            return [];
          }
          const text = await response.text();
          const items = extractMediumItems(text);
          console.log(`[WebSearch] Medium RSS found ${items.length} items`);
          return items.slice(0, maxResults).map((item: any) => ({
            title: item.title,
            snippet: (item.description || '').substring(0, 300),
            url: item.link
          }));
        } catch (err) {
          console.error('[WebSearch] Medium RSS error:', err);
          return [];
        }
      })()
    );
    
    // ---------- 2. Wikipedia (try original query first, then primaryKeyword) ----------
    fallbackPromises.push(
      (async () => {
        try {
          // Try original query first
          for (const wikiQuery of [query, primaryKeyword]) {
            const wikiRes = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiQuery)}&format=json&origin=*`
            );
            if (wikiRes.ok) {
              const wikiData = await wikiRes.json();
              const pages = wikiData.query?.search || [];
              if (pages.length) {
                console.log(`[WebSearch] Wikipedia returned ${pages.length} results for query "${wikiQuery}"`);
                return pages.slice(0, maxResults).map((page: any) => ({
                  title: page.title,
                  snippet: page.snippet.replace(/<\/?span[^>]*>/g, '').substring(0, 300),
                  url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`
                }));
              }
            }
          }
          return [];
        } catch (err) {
          console.error('[WebSearch] Wikipedia error:', err);
          return [];
        }
      })()
    );
    
    // ---------- 3. StackExchange API (original query then primaryKeyword) ----------
    fallbackPromises.push(
      (async () => {
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
                  console.log(`[WebSearch] StackExchange (${site}) returned ${data.items.length} results for query "${stackQuery}"`);
                  break; // stop trying other queries for this site
                }
              }
            }
          }
          return allResults.slice(0, maxResults);
        } catch (err) {
          console.error('[WebSearch] StackExchange error:', err);
          return [];
        }
      })()
    );
    
    // Wait and deduplicate by URL
    const allResultsArrays = await Promise.all(fallbackPromises);
    const merged = new Map<string, SearchResult>();
    for (const resArray of allResultsArrays) {
      for (const res of resArray) {
        if (!merged.has(res.url)) {
          merged.set(res.url, res);
        }
      }
    }
    results = Array.from(merged.values()).slice(0, 15);
    
    if (results.length > 0) {
      sourcesUsed.push('AggregatedFallback(Medium+Wikipedia+StackExchange)');
      console.log(`[WebSearch] Aggregated fallback returned ${results.length} unique results`);
    } else {
      console.log('[WebSearch] All fallback sources returned nothing');
    }
  }
  
  // Generate summary from results
  let summary = '';
  if (results.length > 0) {
    summary = simpleSummarize(results, 4);
  }
  
  if (results.length === 0) {
    console.log('[WebSearch] No results from any source');
    return NextResponse.json({ error: 'No results found from any source' }, { status: 404 });
  }
  
  console.log(`[WebSearch] Final source(s): ${sourcesUsed.join(' → ')}`);
  return NextResponse.json({
    results,
    summary,
    source: sourcesUsed[sourcesUsed.length - 1],
    allSources: sourcesUsed,
    usedKeywords: { primary: primaryKeyword, all: allKeywords }
  });
}

// ---------- Helper: Extract items from Medium RSS (unchanged) ----------
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
    if (descMatch) {
      description = descMatch[1];
    } else {
      const descNoCDATA = itemXml.match(/<description>(.*?)<\/description>/s);
      if (descNoCDATA) description = descNoCDATA[1];
    }
    description = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    description = description
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x2F;/g, '/');
    items.push({ title, description, link });
  }
  return items;
}