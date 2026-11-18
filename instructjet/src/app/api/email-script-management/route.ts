// app/api/email-script-management/route.ts
//
// Failover for Business Support Program emails. When a send through one Apps
// Script fails (usually its Gmail daily quota), lib/email-transport calls this
// endpoint, which loops through every script in GAS_PROGRAM_EMAIL_URLS until
// one sends the email.
//
// Auth: `Authorization: Bearer $PROGRAM_CRON_SECRET` (server to server only).
//   POST { to, subject, htmlBody, textBody, start?, skip? } → { ok, script, attempts }
//   GET  → how many scripts are configured
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedCron } from '@/lib/program/server';
import { programEmailUrls, sendThroughAllScripts } from '@/lib/email-transport';

export const maxDuration = 300;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const { to, subject, htmlBody, textBody } = body || {};
  if (typeof to !== 'string' || !EMAIL_RE.test(to) || typeof subject !== 'string' || typeof htmlBody !== 'string') {
    return NextResponse.json({ error: 'to, subject and htmlBody are required' }, { status: 400 });
  }
  const skip = Array.isArray(body.skip) ? body.skip.filter((n: unknown) => Number.isInteger(n)) : [];
  const start = Number.isInteger(body.start) ? body.start : 0;

  const result = await sendThroughAllScripts(
    { to, subject, htmlBody, textBody: typeof textBody === 'string' ? textBody : '' },
    { start, skip }
  );
  if (!result.ok) console.error('[email-script-management] every script failed for', to, result.attempts);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ scripts: programEmailUrls().length });
}
