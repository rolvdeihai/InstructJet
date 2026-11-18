// src/lib/program/scrape.ts
//
// Weekly catalog refresh: searches the web (Tavily, LangSearch as fallback)
// for networking events, investor/pitching events, free certified courses and
// free-to-join communities, cleans the results (DeepSeek when configured,
// heuristics otherwise) and upserts them into program_catalog.
import { jsonrepair } from 'jsonrepair';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { BUSINESS_CATEGORIES, CATEGORY_VALUES, type CatalogType, type ProgramProfile } from './config';
import { getProgramSettings, mapLimit } from './server';

interface RawResult {
  title: string;
  url: string;
  content: string;
}

interface SearchTask {
  type: CatalogType;
  query: string;
}

interface CleanItem {
  type: CatalogType;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  location: string | null;
  is_online: boolean;
  event_date: string | null;
  platform: string | null;
  provider: string | null;
  is_free: boolean;
  certification: string | null;
}

const FETCH_TIMEOUT_MS = 20_000;

async function fetchJson(url: string, init: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(data).slice(0, 200)}`);
    return data;
  } finally {
    clearTimeout(t);
  }
}

// ─── Search providers ──────────────────────────────────────────────────────
async function tavily(query: string, max = 8): Promise<RawResult[]> {
  const key = process.env.TAVILY_PROGRAM_API_KEY;
  if (!key) throw new Error('TAVILY_PROGRAM_API_KEY not set');
  const data = await fetchJson('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query, max_results: max, search_depth: 'basic', topic: 'general', time_range: 'month' }),
  });
  return (data.results || []).map((r: any) => ({ title: r.title || '', url: r.url || '', content: r.content || '' }));
}

async function langSearch(query: string, count = 8): Promise<RawResult[]> {
  const key = process.env.LANGSEARCH_API_KEY;
  if (!key) throw new Error('LANGSEARCH_API_KEY not set');
  const data = await fetchJson('https://api.langsearch.com/v1/web-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query, freshness: 'oneMonth', summary: true, count }),
  });
  return (data.data?.webPages?.value || []).map((r: any) => ({
    title: r.name || '',
    url: r.url || '',
    content: r.summary || r.snippet || '',
  }));
}

/** PROGRAM_SEARCH_PROVIDER=langsearch flips the order. */
async function search(query: string): Promise<{ results: RawResult[]; provider: string }> {
  const order = process.env.PROGRAM_SEARCH_PROVIDER === 'langsearch' ? [langSearch, tavily] : [tavily, langSearch];
  const errors: string[] = [];
  for (const fn of order) {
    try {
      return { results: await fn(query), provider: fn === tavily ? 'tavily' : 'langsearch' };
    } catch (e) {
      errors.push(`${fn === tavily ? 'tavily' : 'langsearch'}: ${(e as Error).message}`);
    }
  }
  throw new Error(errors.join(' | '));
}

// ─── Queries, tailored to who is in the program ────────────────────────────
function topValues(values: (string | undefined)[], n: number) {
  const counts = new Map<string, number>();
  values.forEach((v) => {
    const k = v?.trim();
    if (k) counts.set(k, (counts.get(k) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
}

export function buildQueries(profiles: ProgramProfile[], extra: string[] = []): SearchTask[] {
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const year = now.getFullYear();

  const categories = topValues(profiles.map((p) => p.business_category), 3)
    .filter((c) => c !== 'other')
    .map((c) => BUSINESS_CATEGORIES.find((b) => b.value === c)?.label || c);
  const locations = topValues(profiles.map((p) => p.city || p.country), 2);

  const tasks: SearchTask[] = [
    { type: 'networking_event', query: `business networking events for entrepreneurs and SME owners ${monthYear}` },
    { type: 'networking_event', query: `online networking event for small business owners ${monthYear}` },
    { type: 'investor_event', query: `startup pitch competition applications open ${monthYear}` },
    { type: 'investor_event', query: `investors looking for SMEs to invest demo day ${year}` },
    { type: 'course', query: 'free leadership and management course with certificate Coursera edX' },
    { type: 'course', query: 'free Scrum agile certification course online' },
    { type: 'course', query: 'free Google HubSpot certificate course for business owners' },
    { type: 'community', query: 'entrepreneur community Telegram group invite link' },
    { type: 'community', query: 'small business owners Discord server invite' },
    { type: 'community', query: 'WhatsApp community for entrepreneurs join link' },
  ];
  for (const loc of locations) {
    tasks.push({ type: 'networking_event', query: `business networking event ${loc} ${monthYear}` });
    tasks.push({ type: 'investor_event', query: `pitch event investors ${loc} ${year}` });
  }
  for (const cat of categories) {
    tasks.push({ type: 'course', query: `free online course with certificate for ${cat} business` });
    tasks.push({ type: 'community', query: `${cat} business owners community Telegram Discord WhatsApp` });
  }
  for (const q of extra) {
    const [maybeType, ...rest] = q.split(':');
    const type = (['networking_event', 'investor_event', 'course', 'community', 'other'] as string[]).includes(maybeType.trim())
      ? (maybeType.trim() as CatalogType)
      : 'other';
    tasks.push({ type, query: type === 'other' ? q : rest.join(':').trim() });
  }
  return tasks.slice(0, 24);
}

// ─── Cleaning ─────────────────────────────────────────────────────────────
const INVITE_RE = /https?:\/\/(?:t\.me\/(?:joinchat\/)?[\w+-]+|discord\.gg\/[\w-]+|discord\.com\/invite\/[\w-]+|chat\.whatsapp\.com\/[\w-]+)/gi;
const SKIP_HOST_RE = /(facebook\.com\/login|pinterest\.|tiktok\.com|instagram\.com\/accounts)/i;

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function platformFor(url: string): string | null {
  const h = host(url);
  if (h === 't.me' || h.endsWith('telegram.org')) return 'telegram';
  if (h.includes('discord')) return 'discord';
  if (h.includes('whatsapp')) return 'whatsapp';
  if (h.includes('coursera')) return 'coursera';
  if (h.includes('edx.org')) return 'edx';
  if (h.includes('eventbrite')) return 'eventbrite';
  if (h.includes('meetup.com')) return 'meetup';
  if (h.includes('lu.ma') || h === 'luma.com') return 'luma';
  if (h.includes('linkedin')) return 'linkedin';
  return h || null;
}

function detectCategory(text: string) {
  const t = text.toLowerCase();
  let best = 'general';
  let bestHits = 0;
  for (const c of BUSINESS_CATEGORIES) {
    const hits = c.keywords.filter((k) => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&')}\\b`).test(t)).length;
    if (hits > bestHits) {
      best = c.value;
      bestHits = hits;
    }
  }
  return bestHits >= 2 ? best : 'general';
}

function heuristicClean(type: CatalogType, results: RawResult[]): CleanItem[] {
  const out: CleanItem[] = [];
  for (const r of results) {
    if (!r.url || SKIP_HOST_RE.test(r.url) || r.url.endsWith('.pdf')) continue;
    const text = `${r.title} ${r.content}`;
    // For communities prefer a direct invite link found in the page text
    const invite = type === 'community' ? (r.content.match(INVITE_RE) || [])[0] : undefined;
    const url = invite || r.url;
    const category = detectCategory(text);
    const cat = BUSINESS_CATEGORIES.find((c) => c.value === category);
    out.push({
      type,
      title: r.title.slice(0, 200) || host(url),
      description: r.content.replace(/\s+/g, ' ').slice(0, 400),
      url,
      category,
      tags: cat ? cat.keywords.filter((k) => text.toLowerCase().includes(k)).slice(0, 6) : [],
      location: null,
      is_online: /\b(online|virtual|webinar|zoom|remote)\b/i.test(text) || type === 'course' || type === 'community',
      event_date: null,
      platform: platformFor(url),
      provider: host(r.url),
      is_free: !/\b(paid|\$\d+|usd \d+)\b/i.test(text),
      certification: type === 'course' && /certif/i.test(text) ? 'Certificate' : null,
    });
  }
  return out;
}

async function deepseekClean(type: CatalogType, results: RawResult[]): Promise<CleanItem[] | null> {
  const key = process.env.DEEPSEEK_KEY;
  if (!key || results.length === 0) return null;

  const today = new Date().toISOString().slice(0, 10);
  const allowedUrls = new Set<string>();
  const input = results.map((r, i) => {
    allowedUrls.add(r.url);
    (r.content.match(INVITE_RE) || []).forEach((u) => allowedUrls.add(u));
    return `#${i + 1}\nTITLE: ${r.title}\nURL: ${r.url}\nTEXT: ${r.content.slice(0, 700)}`;
  });

  const typeHint: Record<CatalogType, string> = {
    networking_event: 'networking events for entrepreneurs / business owners (upcoming only)',
    investor_event: 'events where investors look for startups/SMEs to invest in: pitch competitions, demo days, investor matchmaking (upcoming or applications open)',
    course: 'FREE online courses that give a legitimate, shareable certificate (Coursera, edX, Google, HubSpot, Scrum.org, LinkedIn Learning free, government programs, etc.)',
    community: 'FREE-to-join entrepreneur/business communities on Telegram, Discord or WhatsApp (prefer direct invite links found in the text)',
    other: 'useful free opportunities for small business owners',
  };

  const system = `You curate a catalog of ${typeHint[type]}.
Today is ${today}. From the search results, output ONLY items that are genuinely this kind of opportunity, legitimate, and not expired. Skip listicles with no concrete item, spam, paid-only offers, news articles, and past events. One item per distinct opportunity.
Respond with JSON only: {"items":[{"title":string,"description":string (1-2 sentences, what it is and who it is for),"url":string (must be a URL that appears in the input),"category":one of ${JSON.stringify([...CATEGORY_VALUES.filter((c) => c !== 'other'), 'general'])},"tags":string[] (3-6 lowercase keywords),"location":string|null (city, country — null if online),"is_online":boolean,"event_date":"YYYY-MM-DD"|null,"platform":string|null,"provider":string|null (organizer/issuer),"is_free":boolean,"certification":string|null (name of the certificate, courses only)}]}`;

  try {
    const data = await fetchJson('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.1,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: input.join('\n\n') },
        ],
      }),
    });
    let text: string = data.choices?.[0]?.message?.content || '';
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) text = fenced[1];
    const parsed = JSON.parse(jsonrepair(text));
    const items: any[] = Array.isArray(parsed.items) ? parsed.items : [];
    return items
      .filter((i) => typeof i.url === 'string' && allowedUrls.has(i.url) && typeof i.title === 'string')
      .filter((i) => !i.event_date || i.event_date >= today)
      .map((i) => ({
        type,
        title: String(i.title).slice(0, 200),
        description: String(i.description || '').slice(0, 500),
        url: i.url,
        category: CATEGORY_VALUES.includes(i.category) ? i.category : 'general',
        tags: Array.isArray(i.tags) ? i.tags.map((t: unknown) => String(t).toLowerCase().slice(0, 40)).slice(0, 8) : [],
        location: i.location ? String(i.location).slice(0, 120) : null,
        is_online: !!i.is_online,
        event_date: /^\d{4}-\d{2}-\d{2}$/.test(i.event_date || '') ? i.event_date : null,
        platform: i.platform ? String(i.platform).toLowerCase().slice(0, 40) : platformFor(i.url),
        provider: i.provider ? String(i.provider).slice(0, 120) : host(i.url),
        is_free: i.is_free !== false,
        certification: i.certification ? String(i.certification).slice(0, 160) : null,
      }));
  } catch (e) {
    console.error('[program/scrape] DeepSeek cleaning failed, using heuristics:', (e as Error).message);
    return null;
  }
}

// ─── Main entry ────────────────────────────────────────────────────────────
/**
 * `onlyType` scrapes a single catalog type. The Apps Script calls once per
 * type because UrlFetchApp gives up after ~60 seconds.
 */
export async function runWeeklyScrape(onlyType?: CatalogType) {
  const startedAt = new Date();
  const settings = await getProgramSettings();

  const { data: participants } = await supabaseAdmin
    .from('program_participants')
    .select('profile')
    .eq('status', 'active');
  const profiles = (participants || []).map((p) => (p.profile || {}) as ProgramProfile);

  const tasks = buildQueries(profiles, settings.extra_queries || []).filter((t) => !onlyType || t.type === onlyType);
  if (tasks.length === 0) return { type: onlyType || 'all', skipped: true, reason: 'no queries for this type' };

  const errors: string[] = [];
  let provider = '';

  // 1. Search
  const searched = await mapLimit(tasks, 4, async (task) => {
    try {
      const r = await search(task.query);
      provider ||= r.provider;
      return { task, results: r.results };
    } catch (e) {
      errors.push(`"${task.query}": ${(e as Error).message}`);
      return { task, results: [] as RawResult[] };
    }
  });

  // 2. Group by type, dedupe URLs, clean
  const byType = new Map<CatalogType, RawResult[]>();
  const seen = new Set<string>();
  for (const { task, results } of searched) {
    for (const r of results) {
      if (!r.url || seen.has(r.url)) continue;
      seen.add(r.url);
      byType.set(task.type, [...(byType.get(task.type) || []), r]);
    }
  }

  const cleaned: CleanItem[] = [];
  await mapLimit([...byType.entries()], 3, async ([type, results]) => {
    // DeepSeek gets batches of 20 so the prompt stays small
    for (let i = 0; i < results.length; i += 20) {
      const batch = results.slice(i, i + 20);
      cleaned.push(...((await deepseekClean(type, batch)) ?? heuristicClean(type, batch)));
    }
  });

  // 3. Upsert: new URLs are inserted, known ones get last_seen_at bumped.
  //    Items the admin deactivated stay deactivated.
  const unique = [...new Map(cleaned.filter((c) => /^https?:\/\//i.test(c.url)).map((c) => [c.url, c])).values()];
  const urls = unique.map((u) => u.url);
  const { data: existing } = urls.length
    ? await supabaseAdmin.from('program_catalog').select('id, url').in('url', urls)
    : { data: [] as { id: string; url: string }[] };
  const existingUrls = new Set((existing || []).map((e) => e.url));
  const nowIso = new Date().toISOString();

  const toInsert = unique.filter((u) => !existingUrls.has(u.url)).map((u) => ({ ...u, source: 'scraped', last_seen_at: nowIso }));
  if (toInsert.length) {
    const { error } = await supabaseAdmin.from('program_catalog').insert(toInsert);
    if (error) errors.push(`insert: ${error.message}`);
  }
  if (existingUrls.size) {
    await supabaseAdmin.from('program_catalog').update({ last_seen_at: nowIso }).in('url', [...existingUrls]);
  }

  // 4. Expire: past events, and scraped items not seen for a while
  const today = nowIso.slice(0, 10);
  await supabaseAdmin.from('program_catalog').update({ is_active: false, updated_at: nowIso }).lt('event_date', today).eq('is_active', true);
  const ttl = new Date(Date.now() - (settings.scraped_ttl_days || 21) * 86_400_000).toISOString();
  await supabaseAdmin
    .from('program_catalog')
    .update({ is_active: false, updated_at: nowIso })
    .eq('source', 'scraped')
    .eq('is_active', true)
    .lt('last_seen_at', ttl);

  const result = {
    type: onlyType || 'all',
    provider: provider || 'none',
    queries: tasks.length,
    rawResults: seen.size,
    kept: unique.length,
    inserted: toInsert.length,
    refreshed: existingUrls.size,
    errors: errors.slice(0, 10),
    durationMs: Date.now() - startedAt.getTime(),
  };
  await supabaseAdmin
    .from('program_settings')
    .update({ last_scrape_at: nowIso, last_scrape_result: result })
    .eq('id', 1);
  return result;
}
