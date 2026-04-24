import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const targetUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(targetUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    });

    if (!response.ok) {
      throw new Error(`Proxy returned ${response.status}`);
    }

    const html = await response.text();

    // Parse HTML results
    const results: { title: string; snippet: string; url: string }[] = [];
    const resultRegex = /<a rel="nofollow" class="result__a" href="(.*?)">(.*?)<\/a>[\s\S]*?<a class="result__snippet" href=".*?">(.*?)<\/a>/g;
    let match;
    while ((match = resultRegex.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/l/?uddg=')) {
        url = decodeURIComponent(url.replace('/l/?uddg=', ''));
      }
      results.push({
        title: match[2].replace(/<[^>]*>/g, ''),
        snippet: match[3].replace(/<[^>]*>/g, ''),
        url,
      });
      if (results.length >= 5) break;
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('DuckDuckGo scrape via proxy failed:', error);
    return NextResponse.json({ error: 'Scraping failed' }, { status: 500 });
  }
}