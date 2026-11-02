// src/lib/reminders.ts
//
// Daily email reminders for workers assigned to a guide. Emails are sent
// through the Google Apps Script (`send_email` action); the daily run is
// triggered by the cron route (app/api/cron/reminders).

import { supabaseAdmin } from '@/lib/supabase-admin';

export const MAX_REMINDERS_PER_GUIDE = 200;
/** Days after the deadline we keep sending "overdue" reminders before giving up. */
export const OVERDUE_REMINDER_DAYS = 3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_RE.test(email);
}

export function isValidDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** Today's date (YYYY-MM-DD) in UTC; deadlines are plain dates. */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export async function sendEmail(to: string, subject: string, htmlBody: string, textBody: string): Promise<boolean> {
  const gasUrl = process.env.GAS_OTP_URL;
  if (!gasUrl) {
    console.error('GAS_OTP_URL not configured');
    return false;
  }
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_email', to, subject, htmlBody, textBody }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      console.error('Reminder email failed:', to, data.error || response.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Reminder email error:', to, err);
    return false;
  }
}

interface ReminderEmailInput {
  workerEmail: string;
  workerName: string | null;
  deadline: string;
  unsubscribeToken: string;
  guide: { title: string; slug: string; is_public: boolean; reminder_message: string | null };
  authorName: string;
  firstEmail: boolean;
}

export function buildReminderEmail(r: ReminderEmailInput) {
  const daysLeft = daysBetween(todayUtc(), r.deadline);
  const deadlineLabel = new Date(`${r.deadline}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
  const when =
    daysLeft > 1 ? `${daysLeft} days left` :
    daysLeft === 1 ? 'Due tomorrow' :
    daysLeft === 0 ? 'Due today' :
    `Overdue by ${-daysLeft} day${daysLeft === -1 ? '' : 's'}`;

  const workerParams = new URLSearchParams({ email: r.workerEmail, ...(r.workerName ? { name: r.workerName } : {}) });
  const guideUrl = `${appUrl()}/guides/${r.guide.slug}?${workerParams}`;
  const unsubscribeUrl = `${appUrl()}/api/reminders/unsubscribe?token=${r.unsubscribeToken}`;
  const greeting = r.workerName ? `Hi ${r.workerName},` : 'Hi,';
  const intro = r.firstEmail
    ? `${r.authorName} assigned you a task on InstructJet: <strong>${escapeHtml(r.guide.title)}</strong>.`
    : `This is a reminder about your task <strong>${escapeHtml(r.guide.title)}</strong> from ${escapeHtml(r.authorName)}.`;

  const subject = `${r.firstEmail ? 'New task' : when}: ${r.guide.title}`;
  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#1f2937">
      <p>${escapeHtml(greeting)}</p>
      <p>${intro}</p>
      <p style="font-size:16px"><strong>Deadline:</strong> ${deadlineLabel} — <strong>${when}</strong></p>
      ${r.guide.reminder_message ? `<p style="padding:12px;background:#f3f4f6;border-radius:8px">${escapeHtml(r.guide.reminder_message).replace(/\n/g, '<br>')}</p>` : ''}
      <p>Open the guide, follow the steps, and submit your work with the <strong>📤 Submit Work</strong> button at the bottom of the page. You can also ask the AI assistant there if anything is unclear.</p>
      <p><a href="${guideUrl}" style="display:inline-block;padding:10px 18px;background:#D02752;color:#fff;border-radius:8px;text-decoration:none">Open the guide</a></p>
      ${r.guide.is_public ? '' : '<p style="font-size:13px;color:#6b7280">This guide is password-protected. Ask the person who assigned it for the password.</p>'}
      <p style="font-size:13px;color:#6b7280">Reminders stop automatically once you submit your work, using this email address (${escapeHtml(r.workerEmail)}).</p>
      <p style="font-size:12px;color:#9ca3af"><a href="${unsubscribeUrl}" style="color:#9ca3af">Stop these reminders</a></p>
    </div>`;
  const textBody = `${greeting}

${intro.replace(/<[^>]+>/g, '')}

Deadline: ${deadlineLabel} — ${when}
${r.guide.reminder_message ? `\n${r.guide.reminder_message}\n` : ''}
Open the guide and submit your work with the "Submit Work" button: ${guideUrl}
${r.guide.is_public ? '' : 'This guide is password-protected. Ask the person who assigned it for the password.\n'}
Reminders stop automatically once you submit your work using this email address (${r.workerEmail}).
Stop these reminders: ${unsubscribeUrl}`;

  return { subject, htmlBody, textBody };
}

/**
 * Sends one reminder and records it. The row is claimed first (last_sent_on
 * set to today only if it wasn't already), so overlapping runs never send
 * the same reminder twice on one day.
 */
export async function sendReminder(
  reminder: { id: string; worker_email: string; worker_name: string | null; deadline: string; unsubscribe_token: string; send_count: number; last_sent_on: string | null },
  guide: ReminderEmailInput['guide'],
  authorName: string
): Promise<boolean> {
  const today = todayUtc();
  let claim = supabaseAdmin
    .from('guide_reminders')
    .update({ last_sent_on: today })
    .eq('id', reminder.id)
    .eq('status', 'active');
  claim = reminder.last_sent_on ? claim.eq('last_sent_on', reminder.last_sent_on) : claim.is('last_sent_on', null);
  const { data: claimed } = await claim.select('id');
  if (!claimed?.length) return false;

  const email = buildReminderEmail({
    workerEmail: reminder.worker_email,
    workerName: reminder.worker_name,
    deadline: reminder.deadline,
    unsubscribeToken: reminder.unsubscribe_token,
    guide,
    authorName,
    firstEmail: reminder.send_count === 0,
  });
  const sent = await sendEmail(reminder.worker_email, email.subject, email.htmlBody, email.textBody);

  await supabaseAdmin
    .from('guide_reminders')
    .update(sent ? { send_count: reminder.send_count + 1 } : { last_sent_on: reminder.last_sent_on })
    .eq('id', reminder.id);
  return sent;
}

/** Daily run: expire old reminders, then send today's reminders for guides that have them enabled. */
export async function runDailyReminders(): Promise<{ sent: number; failed: number; expired: number }> {
  const today = todayUtc();
  const expireBefore = new Date(Date.parse(`${today}T00:00:00Z`) - OVERDUE_REMINDER_DAYS * 86_400_000)
    .toISOString().slice(0, 10);

  const { data: expiredRows } = await supabaseAdmin
    .from('guide_reminders')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('deadline', expireBefore)
    .select('id');

  const { data: due } = await supabaseAdmin
    .from('guide_reminders')
    .select('id, guide_id, worker_email, worker_name, deadline, unsubscribe_token, send_count, last_sent_on, guides!inner(title, slug, is_public, reminders_enabled, reminder_message, user_id)')
    .eq('status', 'active')
    .eq('guides.reminders_enabled', true)
    .or(`last_sent_on.is.null,last_sent_on.lt.${today}`)
    .limit(500);

  const ownerIds = [...new Set((due || []).map((r: any) => r.guides.user_id))];
  const { data: owners } = ownerIds.length
    ? await supabaseAdmin.from('users').select('id, full_name, email').in('id', ownerIds)
    : { data: [] as { id: string; full_name: string | null; email: string }[] };
  const ownerName = (id: string) => {
    const o = owners?.find(u => u.id === id);
    return o?.full_name || o?.email || 'Your team lead';
  };

  let sent = 0;
  let failed = 0;
  for (const r of (due || []) as any[]) {
    const ok = await sendReminder(r, r.guides, ownerName(r.guides.user_id));
    if (ok) sent++; else failed++;
  }
  return { sent, failed, expired: expiredRows?.length || 0 };
}

/** Stops reminders for workers who submitted work for the guide. */
export async function markRemindersCompleted(guideId: string, emails: string[]) {
  const unique = [...new Set(emails.map(e => e?.trim().toLowerCase()).filter(Boolean))];
  if (!unique.length) return;
  const { error } = await supabaseAdmin
    .from('guide_reminders')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('guide_id', guideId)
    .eq('status', 'active')
    .in('worker_email', unique);
  if (error) console.error('Failed to complete reminders:', error);
}
