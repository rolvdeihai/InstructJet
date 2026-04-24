// app/api/web-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

const EXA_API_KEY = process.env.EXA_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Helper to simulate error based on test parameter
function shouldSimulateError(simulateError: string | undefined, source: string): boolean {
  return simulateError === source;
}

export async function POST(req: NextRequest) {
  const { query, maxResults = 5, simulateError } = await req.json();
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const sourcesUsed: string[] = [];
  let results: SearchResult[] = [];

  // ========== PRIMARY: Exa ==========
  if (EXA_API_KEY && !shouldSimulateError(simulateError, 'exa')) {
    try {
      console.log(`[WebSearch] Trying Exa for: ${query}`);
      const exaRes = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_API_KEY },
        body: JSON.stringify({ query, numResults: maxResults, contents: { text: true } }),
      });
      if (exaRes.ok) {
        const exaData = await exaRes.json();
        results = exaData.results.map((r: any) => ({
          title: r.title || 'Untitled',
          snippet: r.text?.substring(0, 300) || r.description || 'No description',
          url: r.url,
        }));
        sourcesUsed.push('Exa');
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

  // ========== SECONDARY: Tavily ==========
  if (results.length === 0 && TAVILY_API_KEY && !shouldSimulateError(simulateError, 'tavily')) {
    try {
      console.log(`[WebSearch] Trying Tavily for: ${query}`);
      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: TAVILY_API_KEY, query, max_results: maxResults, include_answer: false }),
      });
      if (tavilyRes.ok) {
        const tavilyData = await tavilyRes.json();
        results = tavilyData.results.map((r: any) => ({
          title: r.title,
          snippet: r.content.substring(0, 300),
          url: r.url,
        }));
        sourcesUsed.push('Tavily');
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

  // ========== AGGREGATED FALLBACK: DuckDuckGo + Google News RSS + Wikipedia ==========
  // Only run if primary/secondary gave no results

// ========== AGGREGATED FALLBACK: Medium + Wikipedia + The Conversation ==========
	if (results.length === 0) {
		console.log(`[WebSearch] Primary sources failed – starting aggregated fallback (Medium + Wikipedia + The Conversation)`);

		const fallbackPromises: Promise<SearchResult[]>[] = [];

		// ---------- 1. Medium RSS (tag feed) ----------
		fallbackPromises.push(
			(async () => {
				try {
					let tag = query.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
					tag = tag.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
					if (!tag) tag = 'general'; // fallback to a generic tag
					tag = tag.substring(0, 50);
					const mediumRssUrl = `https://medium.com/feed/tag/${encodeURIComponent(tag)}`;
					console.log(`[WebSearch] Medium RSS URL: ${mediumRssUrl}`);
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

		// ---------- 2. Wikipedia ----------
		fallbackPromises.push(
			(async () => {
				try {
					const wikiRes = await fetch(
						`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
					);
					if (!wikiRes.ok) return [];
					const wikiData = await wikiRes.json();
					const pages = wikiData.query?.search || [];
					return pages.slice(0, maxResults).map((page: any) => ({
						title: page.title,
						snippet: page.snippet.replace(/<\/?span[^>]*>/g, '').substring(0, 300),
						url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`
					}));
				} catch (err) {
					console.error('[WebSearch] Wikipedia error:', err);
					return [];
				}
			})()
		);

		// ---------- 3. Stack Exchange API (Q&A expertise) ----------
		fallbackPromises.push(
			(async () => {
				try {
					// Specify the sites you want to search. 'stackoverflow' is the most common.
					const sites = ['stackoverflow', 'superuser', 'serverfault', 'askubuntu'];
					let allResults: SearchResult[] = [];

					for (const site of sites) {
						// Construct the API URL. The 'intitle' parameter searches the question title.
						const apiUrl = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=${site}&filter=withbody`;
						console.log(`[WebSearch] StackExchange API URL for ${site}: ${apiUrl}`);
						const response = await fetch(apiUrl);

						if (!response.ok) {
							console.warn(`[WebSearch] StackExchange API returned ${response.status} for site ${site}`);
							continue; // Skip to the next site if this one fails
						}

						const data = await response.json();
						if (!data.items || data.items.length === 0) continue;

						// Map the API response to our SearchResult format
						const siteResults = data.items.map((item: any) => ({
							title: item.title,
							snippet: (item.body || '').replace(/<[^>]*>/g, '').substring(0, 300), // Strip HTML tags
							url: item.link
						}));
						allResults.push(...siteResults);
						console.log(`[WebSearch] StackExchange API (${site}) returned ${data.items.length} results`);
					}

					return allResults.slice(0, maxResults);
				} catch (err) {
					console.error('[WebSearch] StackExchange API error:', err);
					return [];
				}
			})()
		);

		// Wait and deduplicate by URL
		const allResults = await Promise.all(fallbackPromises);
		const merged = new Map<string, SearchResult>();
		for (const resArray of allResults) {
			for (const res of resArray) {
				if (!merged.has(res.url)) {
					merged.set(res.url, res);
				}
			}
		}
		results = Array.from(merged.values()).slice(0, 15);

		if (results.length > 0) {
			sourcesUsed.push('AggregatedFallback(Medium+Wikipedia+TheConversation)');
			console.log(`[WebSearch] Aggregated fallback returned ${results.length} unique results`);
		} else {
			console.log('[WebSearch] All fallback sources returned nothing');
		}
	}

	// Keep the extractMediumItems helper function at the bottom (outside POST)
	function extractMediumItems(xml: string) {
		const items: { title: string; description: string; link: string }[] = [];
		const itemRegex = /<item>([\s\S]*?)<\/item>/g;
		let match;
		while ((match = itemRegex.exec(xml)) !== null) {
			const itemXml = match[1];
			// Extract title (always in CDATA)
			const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
			if (!titleMatch) continue;
			const title = titleMatch[1];
			
			// Extract link
			const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
			if (!linkMatch) continue;
			const link = linkMatch[1];
			
			// Extract description (strips HTML tags)
			let description = '';
			const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s);
			if (descMatch) {
				description = descMatch[1];
			} else {
				const descNoCDATA = itemXml.match(/<description>(.*?)<\/description>/s);
				if (descNoCDATA) description = descNoCDATA[1];
			}
			// Remove all HTML tags, collapse whitespace
			description = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
			// Decode common HTML entities
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

  if (results.length === 0) {
    console.log('[WebSearch] No results from any source');
    return NextResponse.json({ error: 'No results found from any source' }, { status: 404 });
  }

  console.log(`[WebSearch] Final source(s): ${sourcesUsed.join(' → ')}`);
  return NextResponse.json({
    results,
    source: sourcesUsed[sourcesUsed.length - 1],
    allSources: sourcesUsed,
  });
}