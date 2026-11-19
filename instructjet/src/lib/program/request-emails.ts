// src/lib/program/request-emails.ts
//
// Emails for help requests: notify admins when one comes in, and tell the
// participant when an admin approves / rejects it.
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendProgramEmail } from '@/lib/email-transport';
import { appUrl, mapLimit } from './server';
import { describeRequest, REQUEST_TYPE_LABEL, requestTitle, type RequestType } from './requests';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = (s: string) => esc(s).replace(/\n/g, '<br>');

function layout(greeting: string, body: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6f5f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0f172a;padding:20px 28px;color:#fcd34d;font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:700">InstructJet · Business Support Program</td></tr>
<tr><td style="padding:24px 28px 8px;color:#0f172a;font-size:16px">${esc(greeting)}</td></tr>
<tr><td style="padding:8px 28px 24px;color:#334155;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #eee;font-size:12px;color:#94a3b8;line-height:1.6">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string) {
  return `<a href="${esc(href)}" style="display:inline-block;background:#d02752;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;font-size:14px">${esc(label)}</a>`;
}

function detailsTable(rows: { label: string; value: string }[]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:14px">${rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;color:#64748b;vertical-align:top;width:38%">${esc(r.label)}</td><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;color:#0f172a">${nl2br(r.value)}</td></tr>`
    )
    .join('')}</table>`;
}

interface RequestRow {
  id: string;
  type: RequestType;
  details: Record<string, string>;
}

interface Requester {
  email: string;
  full_name: string | null;
  business_name?: string;
}

/** Admin recipients: every active admin user, plus PROGRAM_ADMIN_EMAILS (comma separated). */
async function adminEmails(): Promise<string[]> {
  const { data } = await supabaseAdmin.from('users').select('email').eq('role', 'admin').eq('is_active', true);
  const extra = (process.env.PROGRAM_ADMIN_EMAILS || '').split(/[\s,]+/).filter((e) => e.includes('@'));
  return [...new Set([...(data || []).map((u) => u.email as string), ...extra].map((e) => e.trim().toLowerCase()).filter(Boolean))];
}

export async function notifyAdminsOfRequest(req: RequestRow, who: Requester) {
  const to = await adminEmails();
  if (!to.length) {
    console.warn('[requests] No admin emails to notify');
    return;
  }
  const typeLabel = REQUEST_TYPE_LABEL[req.type];
  const title = requestTitle(req.type, req.details);
  const rows = describeRequest(req.type, req.details);
  const url = `${appUrl()}/admin?tab=requests`;
  const name = who.full_name || who.email;
  const subject = `New ${typeLabel.toLowerCase()} request from ${who.business_name || name}`;

  const html = layout(
    'Hi admin,',
    `<p style="margin:0 0 12px"><strong>${esc(name)}</strong> (${esc(who.email)})${who.business_name ? ` from <strong>${esc(who.business_name)}</strong>` : ''} sent a new <strong>${esc(typeLabel)}</strong> request:</p>
<p style="margin:0 0 4px;font-weight:600;color:#0f172a">${esc(title)}</p>
${detailsTable(rows)}
${button(url, 'Review in the admin dashboard')}`,
    'You receive this because you are an InstructJet admin.'
  );
  const text = [
    `${name} (${who.email})${who.business_name ? ` from ${who.business_name}` : ''} sent a new ${typeLabel} request:`,
    title,
    '',
    ...rows.map((r) => `${r.label}: ${r.value}`),
    '',
    `Review: ${url}`,
  ].join('\n');

  await mapLimit(to, 3, (email) => sendProgramEmail({ to: email, subject, htmlBody: html, textBody: text }));
}

export async function sendDecisionEmail(req: RequestRow, who: Requester, decision: 'approved' | 'rejected', message: string) {
  const typeLabel = REQUEST_TYPE_LABEL[req.type];
  const title = requestTitle(req.type, req.details);
  const first = who.full_name?.split(' ')[0] || who.business_name || 'there';
  const url = `${appUrl()}/leadership-info?tab=requests`;
  const subject =
    decision === 'approved' ? `Your ${typeLabel.toLowerCase()} request was approved` : `Update on your ${typeLabel.toLowerCase()} request`;

  const html = layout(
    `Hi ${first},`,
    `<p style="margin:0 0 12px">${decision === 'approved' ? 'Your request has been <strong style="color:#15803d">approved</strong>.' : 'We have reviewed your request.'}</p>
<p style="margin:0 0 16px;color:#64748b;font-size:14px">${esc(title)}</p>
<p style="margin:0 0 20px">${nl2br(message)}</p>
${button(url, 'View your requests')}`,
    'You receive this because you are in the InstructJet Business Support Program.'
  );
  const text = [
    `Hi ${first},`,
    '',
    decision === 'approved' ? 'Your request has been approved.' : 'We have reviewed your request.',
    title,
    '',
    message,
    '',
    `View your requests: ${url}`,
  ].join('\n');

  return sendProgramEmail({ to: who.email, subject, htmlBody: html, textBody: text });
}
