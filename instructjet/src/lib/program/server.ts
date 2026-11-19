// src/lib/program/server.ts
//
// Server-only helpers for the Business Support Program.
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { mergeDecisionMessages, type DecisionMessages } from './requests';

export interface ProgramSettings {
  id: number;
  paused: boolean;
  discord_url: string | null;
  discord_intro_emails: number;
  lesson_every_days: number;
  digest_every_days: number;
  top_k: number;
  scraped_ttl_days: number;
  extra_queries: string[];
  last_daily_run_at: string | null;
  last_scrape_at: string | null;
  last_scrape_result: unknown;
  request_messages?: unknown;
}

export async function getProgramSettings(): Promise<ProgramSettings> {
  const { data } = await supabaseAdmin.from('program_settings').select('*').eq('id', 1).maybeSingle();
  if (data) {
    return { ...data, discord_url: data.discord_url || process.env.PROGRAM_DISCORD_URL || null };
  }
  // Row missing (migration seeds it, but be defensive)
  const { data: created } = await supabaseAdmin.from('program_settings').upsert({ id: 1 }).select('*').single();
  return { ...created, discord_url: created?.discord_url || process.env.PROGRAM_DISCORD_URL || null };
}

/** Default approve / disapprove messages for help requests (admin overrides + built-ins). */
export async function getDecisionMessages(): Promise<DecisionMessages> {
  const { data } = await supabaseAdmin.from('program_settings').select('request_messages').eq('id', 1).maybeSingle();
  return mergeDecisionMessages(data?.request_messages);
}

export async function getParticipantByUserId(userId: string) {
  const { data } = await supabaseAdmin
    .from('program_participants')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

/**
 * Put a user in the program (Paddle webhook or manual enrollment by admin).
 * Re-enrolling a canceled participant keeps their profile & capstone and
 * reactivates them; `subscribed_at` is kept so their 3 months still count.
 */
export async function enrollParticipant(
  userId: string,
  opts: { source: 'paddle' | 'manual'; subscriptionId?: string | null; subscribedAt?: string }
) {
  const existing = await getParticipantByUserId(userId);
  const now = new Date().toISOString();
  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('program_participants')
      .update({
        status: 'active',
        source: opts.source,
        subscription_id: opts.subscriptionId ?? existing.subscription_id,
        ...(opts.subscribedAt ? { subscribed_at: opts.subscribedAt } : {}),
        updated_at: now,
      })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabaseAdmin
    .from('program_participants')
    .insert({
      user_id: userId,
      source: opts.source,
      subscription_id: opts.subscriptionId ?? null,
      subscribed_at: opts.subscribedAt || now,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/** Shared secret for the Google Apps Script triggers. */
export function isAuthorizedCron(req: NextRequest) {
  const secret = process.env.PROGRAM_CRON_SECRET || process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get('authorization');
  return header === `Bearer ${secret}`;
}

export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://instructjet.com').replace(/\/$/, '');
}

/** Run async work over items with a fixed concurrency. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

/**
 * Ends Premium that was granted by hand (admin, or manual program enrollment)
 * once `current_period_end` has passed. Paddle/PayPal subscribers are skipped:
 * they have a subscription_id and the provider cancels them after failed
 * payments, which the webhook handles. Program membership itself is left alone.
 */
export async function expireManualPremium(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ plan_tier: 'free', subscription_plan: null, subscription_status: 'expired', current_period_end: null })
    .eq('plan_tier', 'premium')
    .is('subscription_id', null)
    .lt('current_period_end', new Date().toISOString())
    .select('id');
  if (error) {
    console.error('[program] expireManualPremium failed:', error.message);
    return 0;
  }
  const ids = (data || []).map((u) => u.id);
  if (ids.length) {
    await supabaseAdmin.from('token_balances').update({ subscription_tokens: 0 }).in('user_id', ids);
    console.log(`[program] Premium expired for ${ids.length} manually granted user(s)`);
  }
  return ids.length;
}
