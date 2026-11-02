// app/api/guides/[id]/reminders/route.ts
//
// Owner-only management of daily worker reminders for a guide.
//   GET    → settings + reminder list
//   PUT    { enabled, message }                 → update settings
//   POST   { reminders: [{ email, name, deadline }] } → add / update workers (first email goes out immediately)
//   DELETE { ids }                              → remove workers
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getOwnedGuide } from '@/lib/guide-owner';
import {
  MAX_REMINDERS_PER_GUIDE,
  isValidEmail,
  isValidDateOnly,
  todayUtc,
  sendReminder,
} from '@/lib/reminders';

export const maxDuration = 60;

const GUIDE_COLUMNS = 'id, user_id, title, slug, is_public, reminders_enabled, reminder_message';
const REMINDER_COLUMNS = 'id, worker_email, worker_name, deadline, status, last_sent_on, send_count, completed_at, created_at';

async function listReminders(guideId: string) {
  const { data } = await supabaseAdmin
    .from('guide_reminders')
    .select(REMINDER_COLUMNS)
    .eq('guide_id', guideId)
    .order('deadline', { ascending: true });
  return data || [];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id, GUIDE_COLUMNS);
  if (owned.error) return owned.error;

  return NextResponse.json({
    enabled: !!owned.guide.reminders_enabled,
    message: owned.guide.reminder_message || '',
    reminders: await listReminders(id),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id, GUIDE_COLUMNS);
  if (owned.error) return owned.error;

  const { enabled, message } = await req.json();
  const update: Record<string, unknown> = {};
  if (typeof enabled === 'boolean') update.reminders_enabled = enabled;
  if (typeof message === 'string') update.reminder_message = message.trim().slice(0, 1000) || null;

  const { error } = await supabaseAdmin.from('guides').update(update).eq('id', id);
  if (error) {
    console.error('Failed to update reminder settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id, GUIDE_COLUMNS);
  if (owned.error) return owned.error;
  const { user, guide } = owned;

  const { reminders } = await req.json();
  if (!Array.isArray(reminders) || !reminders.length) {
    return NextResponse.json({ error: 'Add at least one worker' }, { status: 400 });
  }

  const today = todayUtc();
  const rows: { guide_id: string; worker_email: string; worker_name: string | null; deadline: string; status: string; completed_at: null }[] = [];
  for (const r of reminders) {
    const email = typeof r?.email === 'string' ? r.email.trim().toLowerCase() : '';
    const deadline = typeof r?.deadline === 'string' ? r.deadline : '';
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: `Invalid email: ${email || '(empty)'}` }, { status: 400 });
    }
    if (!isValidDateOnly(deadline) || deadline < today) {
      return NextResponse.json({ error: `Deadline for ${email} must be today or later` }, { status: 400 });
    }
    rows.push({
      guide_id: id,
      worker_email: email,
      worker_name: typeof r?.name === 'string' && r.name.trim() ? r.name.trim().slice(0, 120) : null,
      deadline,
      status: 'active',
      completed_at: null,
    });
  }

  const { count } = await supabaseAdmin
    .from('guide_reminders')
    .select('id', { count: 'exact', head: true })
    .eq('guide_id', id);
  if ((count || 0) + rows.length > MAX_REMINDERS_PER_GUIDE) {
    return NextResponse.json({ error: `A guide can have at most ${MAX_REMINDERS_PER_GUIDE} workers with reminders` }, { status: 400 });
  }

  // Re-adding an existing worker updates their deadline and re-activates them.
  const { data: saved, error } = await supabaseAdmin
    .from('guide_reminders')
    .upsert(rows, { onConflict: 'guide_id,worker_email' })
    .select('id, worker_email, worker_name, deadline, unsubscribe_token, send_count, last_sent_on');
  if (error) {
    console.error('Failed to save reminders:', error);
    return NextResponse.json({ error: 'Failed to save reminders' }, { status: 500 });
  }

  // Send the assignment email right away instead of waiting for tomorrow's run.
  let sent = 0;
  if (guide.reminders_enabled) {
    const authorName = user.full_name || user.email;
    for (const r of saved || []) {
      if (r.last_sent_on !== today && await sendReminder(r, guide, authorName)) sent++;
    }
  }

  return NextResponse.json({ success: true, sent, reminders: await listReminders(id) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id, GUIDE_COLUMNS);
  if (owned.error) return owned.error;

  const { ids } = await req.json();
  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from('guide_reminders').delete().eq('guide_id', id).in('id', ids);
  if (error) {
    console.error('Failed to delete reminders:', error);
    return NextResponse.json({ error: 'Failed to remove workers' }, { status: 500 });
  }
  return NextResponse.json({ success: true, reminders: await listReminders(id) });
}
