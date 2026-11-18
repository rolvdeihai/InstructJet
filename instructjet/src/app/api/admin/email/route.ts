// app/api/admin/email/route.ts
//
// GET   program email settings, recent sends and headline stats
// PUT   update settings
// POST  { action: 'send_daily' | 'scrape' }   run a job now
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';
import { getProgramSettings } from '@/lib/program/server';
import { runDailyProgramEmails } from '@/lib/program/emails';
import { runWeeklyScrape } from '@/lib/program/scrape';

export const maxDuration = 300;

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const count = (table: string, filter?: (q: any) => any) => {
    let q = supabaseAdmin.from(table).select('id', { count: 'exact', head: true });
    if (filter) q = filter(q);
    return q.then((r: { count: number | null }) => r.count || 0);
  };

  const [settings, logRes, users, admins, premium, activeParticipants, allParticipants, catalogActive, lessons, claims] =
    await Promise.all([
      getProgramSettings(),
      supabaseAdmin
        .from('program_email_log')
        .select('id, email, kind, subject, status, error, sent_at')
        .order('sent_at', { ascending: false })
        .limit(50),
      count('users'),
      count('users', (q) => q.eq('role', 'admin')),
      count('users', (q) => q.eq('plan_tier', 'premium')),
      count('program_participants', (q) => q.eq('status', 'active')),
      count('program_participants'),
      count('program_catalog', (q) => q.eq('is_active', true)),
      count('program_lessons', (q) => q.eq('is_active', true)),
      count('program_capstones', (q) => q.eq('status', 'claimed')),
    ]);

  return NextResponse.json({
    settings,
    log: logRes.data || [],
    stats: { users, admins, premium, activeParticipants, allParticipants, catalogActive, lessons, claims },
  });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const int = (k: string, min: number, max: number) => {
    if (body[k] === undefined) return;
    const n = Math.floor(Number(body[k]));
    if (Number.isFinite(n)) update[k] = Math.min(Math.max(n, min), max);
  };
  if (typeof body.paused === 'boolean') update.paused = body.paused;
  if (body.discord_url !== undefined) {
    const url = String(body.discord_url || '').trim();
    if (url) {
      try {
        if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error();
      } catch {
        return NextResponse.json({ error: 'Invalid Discord URL' }, { status: 400 });
      }
    }
    update.discord_url = url || null;
  }
  int('discord_intro_emails', 0, 30);
  int('lesson_every_days', 1, 30);
  int('digest_every_days', 1, 30);
  int('top_k', 1, 15);
  int('scraped_ttl_days', 7, 120);
  if (body.extra_queries !== undefined) {
    const list = Array.isArray(body.extra_queries) ? body.extra_queries : String(body.extra_queries).split('\n');
    update.extra_queries = list.map((s: unknown) => String(s).trim()).filter(Boolean).slice(0, 10);
  }

  const { error } = await supabaseAdmin.from('program_settings').update(update).eq('id', 1);
  if (error) return dbError(error);
  return NextResponse.json({ settings: await getProgramSettings() });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const { action } = await req.json().catch(() => ({}));
  try {
    if (action === 'scrape') return NextResponse.json({ result: await runWeeklyScrape() });
    if (action === 'send_daily') {
      // Loop batches until done or close to the time limit
      const started = Date.now();
      const total = { processed: 0, sent: 0, failed: 0, skipped: 0, remaining: 0, paused: false };
      for (;;) {
        const r = await runDailyProgramEmails(20);
        total.paused = r.paused;
        total.processed += r.processed;
        total.sent += r.sent;
        total.failed += r.failed;
        total.skipped += r.skipped;
        total.remaining = r.remaining;
        if (r.paused || !r.remaining || Date.now() - started > 240_000) break;
      }
      return NextResponse.json({ result: total });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
