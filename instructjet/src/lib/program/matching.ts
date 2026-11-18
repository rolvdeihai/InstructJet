// src/lib/program/matching.ts
//
// Ranks catalog items for one participant using their program profile.
// Deterministic and explainable: category match, interests, location/format,
// keyword overlap with what they wrote, freshness.
import { BUSINESS_CATEGORIES, type ProgramProfile } from './config';

export interface CatalogItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
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
  source: string;
  is_active: boolean;
  created_at: string;
}

const STOP = new Set(
  'a an and are as at be by for from has have in is it its of on or that the to was were will with we our my i you your they their this these those can not no so do does into about more most very also just than then there here what which who how when where why business company'.split(' ')
);

export function tokenize(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9&\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function profileKeywords(p: ProgramProfile): Set<string> {
  const words = new Set<string>();
  const cat = BUSINESS_CATEGORIES.find((c) => c.value === p.business_category);
  cat?.keywords.forEach((k) => tokenize(k).forEach((w) => words.add(w)));
  [p.sub_industry, p.description, p.growth_goals, p.challenges, p.skills_to_learn, p.target_customers].forEach((t) =>
    tokenize(t).forEach((w) => words.add(w))
  );
  return words;
}

function lower(s: string | null | undefined) {
  return (s || '').toLowerCase();
}

export function scoreItem(item: CatalogItem, p: ProgramProfile, keywords: Set<string>, today = new Date()): number {
  // Past events are never relevant
  if (item.event_date && new Date(`${item.event_date}T23:59:59Z`) < today) return -Infinity;

  let score = 0;

  // 1. Business category
  if (p.business_category && item.category === p.business_category) score += 4;
  else if (item.category === 'general') score += 1;
  else score -= 1;

  // 2. What kind of opportunities they asked for
  const wanted = p.opportunities?.length ? p.opportunities : null;
  if (wanted) score += wanted.includes(item.type) ? 3 : -3;
  if (item.type === 'investor_event') {
    if (p.funding === 'yes') score += 2;
    if (p.funding === 'no') score -= 3;
  }

  // 3. Location / format
  const fmt = p.event_format || 'both';
  const isEvent = item.type === 'networking_event' || item.type === 'investor_event';
  if (isEvent) {
    const loc = lower(item.location);
    const matchesLocation =
      !!loc && ((p.city && loc.includes(lower(p.city))) || (p.country && loc.includes(lower(p.country))));
    if (item.is_online) score += fmt === 'offline' ? -2 : 1;
    else if (matchesLocation) score += fmt === 'online' ? 0 : 3;
    else if (loc) score -= 4; // in person somewhere else: usually impossible to attend
  } else if (item.type === 'community' && p.country && lower(item.location).includes(lower(p.country))) {
    score += 1;
  }

  // 4. Keyword overlap with their profile text
  const itemWords = new Set([...tokenize(item.title), ...tokenize(item.description), ...item.tags.flatMap(tokenize)]);
  let overlap = 0;
  for (const w of itemWords) if (keywords.has(w)) overlap++;
  score += Math.min(overlap, 5) * 0.6;

  // 5. Freshness & curation
  if (item.event_date) {
    const days = (new Date(item.event_date).getTime() - today.getTime()) / 86_400_000;
    if (days <= 21) score += 1;
  }
  if (item.source === 'manual') score += 0.5;

  return score;
}

/**
 * Top-k items for a participant, skipping ones already sent to them.
 * Keeps the mix varied: no single type takes more than ceil(k/2) slots.
 */
export function topMatches(items: CatalogItem[], profile: ProgramProfile, k: number, excludeIds: Set<string>) {
  const keywords = profileKeywords(profile);
  const ranked = items
    .filter((i) => i.is_active && !excludeIds.has(i.id))
    .map((item) => ({ item, score: scoreItem(item, profile, keywords) }))
    .filter((r) => Number.isFinite(r.score) && r.score > 0) // never pad with irrelevant items
    .sort((a, b) => b.score - a.score);

  const perTypeCap = Math.max(1, Math.ceil(k / 2));
  const counts: Record<string, number> = {};
  const picked: CatalogItem[] = [];
  for (const r of ranked) {
    if (picked.length >= k) break;
    if ((counts[r.item.type] || 0) >= perTypeCap) continue;
    counts[r.item.type] = (counts[r.item.type] || 0) + 1;
    picked.push(r.item);
  }
  // Fill remaining slots if the cap left gaps
  for (const r of ranked) {
    if (picked.length >= k) break;
    if (!picked.includes(r.item)) picked.push(r.item);
  }
  return picked;
}
