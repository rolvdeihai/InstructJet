// src/lib/email-transport.ts
//
// Business Support Program emails go out through Google Apps Script web apps
// (`send_email` action). Every Gmail account has its own daily quota, so
// GAS_PROGRAM_EMAIL_URLS lists several deployments, comma separated.
//
// Flow for one email:
//   1. Try the current script.
//   2. If it fails, call /api/email-script-management, which loops through
//      every script until one sends it (and retries network errors once).
//   3. The script that worked becomes the current one, so each Gmail account is
//      used until its quota runs out and used-up scripts are not retried for
//      every email.
//
// OTP / password reset / contact / guide reminders keep using GAS_OTP_URL:
// OTP codes live inside that one script.

export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}

export interface Attempt {
  script: number; // 1-based position in GAS_PROGRAM_EMAIL_URLS
  error: string;
}

export interface LoopResult {
  ok: boolean;
  script: number | null; // which script sent it
  attempts: Attempt[]; // failures before success (or all failures)
}

export function programEmailUrls(): string[] {
  const raw = process.env.GAS_PROGRAM_EMAIL_URLS || process.env.GAS_OTP_URL || '';
  return [...new Set(raw.split(/[\s,]+/).map((u) => u.trim()).filter((u) => /^https:\/\//.test(u)))];
}

function managementSecret() {
  return process.env.PROGRAM_CRON_SECRET || process.env.CRON_SECRET || '';
}

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://instructjet.com').replace(/\/$/, '');
}

type SendResult = { ok: true } | { ok: false; error: string; transient: boolean };

async function sendVia(url: string, p: EmailPayload): Promise<SendResult> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_email', to: p.to, subject: p.subject, htmlBody: p.htmlBody, textBody: p.textBody }),
      signal: AbortSignal.timeout(25_000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { ok: true };
    return { ok: false, error: String(data.error || data.message || `HTTP ${res.status}`), transient: res.status >= 500 };
  } catch (err) {
    return { ok: false, error: (err as Error).message, transient: true };
  }
}

/**
 * Tries every script in order (starting at `start`, skipping `skip`) until one
 * sends the email. Scripts that failed with a network/5xx error get one more try.
 */
export async function sendThroughAllScripts(p: EmailPayload, opts: { start?: number; skip?: number[] } = {}): Promise<LoopResult> {
  const urls = programEmailUrls();
  const attempts: Attempt[] = [];
  if (!urls.length) return { ok: false, script: null, attempts: [{ script: 0, error: 'GAS_PROGRAM_EMAIL_URLS is not configured' }] };

  const start = ((opts.start ?? 0) % urls.length + urls.length) % urls.length;
  const order = urls.map((_, i) => (start + i) % urls.length).filter((i) => !opts.skip?.includes(i + 1));
  const retry: number[] = [];

  for (const pass of [order, retry]) {
    for (const i of pass) {
      const r = await sendVia(urls[i], p);
      if (r.ok) return { ok: true, script: i + 1, attempts };
      attempts.push({ script: i + 1, error: r.error });
      if (pass === order && r.transient) retry.push(i);
    }
  }
  return { ok: false, script: null, attempts };
}

let current = Math.floor(Math.random() * 1000); // per server instance; random start spreads load

/** Sends one program email: current script first, then the management API failover. */
export async function sendProgramEmail(p: EmailPayload): Promise<boolean> {
  const urls = programEmailUrls();
  if (!urls.length) {
    console.error('[email] GAS_PROGRAM_EMAIL_URLS / GAS_OTP_URL not configured');
    return false;
  }
  const first = current % urls.length;
  const r = await sendVia(urls[first], p);
  if (r.ok) return true;
  console.warn(`[email] Script #${first + 1} failed for ${p.to}: ${r.error}. Failing over.`);
  if (urls.length === 1 && !r.transient) return false;

  let result: LoopResult | null = null;
  const secret = managementSecret();
  if (secret) {
    try {
      const res = await fetch(`${appUrl()}/api/email-script-management`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ ...p, start: first + 1, skip: urls.length > 1 ? [first + 1] : [] }),
        signal: AbortSignal.timeout(120_000),
      });
      if (res.ok || res.status === 502) result = await res.json();
      else console.error(`[email] /api/email-script-management returned HTTP ${res.status}`);
    } catch (err) {
      console.error('[email] /api/email-script-management unreachable:', (err as Error).message);
    }
  }
  // The API could not be reached (or no secret is set): loop here instead
  if (!result) result = await sendThroughAllScripts(p, { start: first + 1, skip: urls.length > 1 ? [first + 1] : [] });

  if (result.ok && result.script) {
    current = result.script - 1; // stay on the script that still has quota
    return true;
  }
  console.error(`[email] Every script failed for ${p.to}:`, result.attempts);
  return false;
}
