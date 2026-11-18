// app/api/program/unsubscribe/route.ts
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:system-ui,sans-serif;background:#f6f5f2;margin:0;display:grid;place-items:center;min-height:100vh;padding:16px"><div style="max-width:420px;background:#fff;border-radius:16px;padding:32px;text-align:center"><h1 style="font-size:20px;margin:0 0 12px">${title}</h1><p style="color:#475569;line-height:1.6;margin:0">${body}</p></div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );

const validToken = (t: string) => /^[0-9a-f-]{36}$/i.test(t);

// GET only shows a confirmation button, so email link scanners that prefetch
// links do not unsubscribe people by accident.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || '';
  if (!validToken(token)) return page('Invalid link', 'This unsubscribe link is not valid.');
  return page(
    'Unsubscribe from program emails?',
    `You will stop receiving Business Support Program emails.</p><form method="post" style="margin-top:20px"><input type="hidden" name="token" value="${token}"><button style="background:#d02752;color:#fff;border:0;border-radius:999px;padding:12px 22px;font-weight:600;cursor:pointer">Unsubscribe</button></form><p style="display:none">`
  );
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const token = String(form?.get('token') || '');
  if (!validToken(token)) return page('Invalid link', 'This unsubscribe link is not valid.');
  const { data } = await supabaseAdmin
    .from('program_participants')
    .update({ email_opt_out: true, updated_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select('id');
  if (!data?.length) return page('Invalid link', 'This unsubscribe link is not valid.');
  return page(
    'You are unsubscribed',
    'You will no longer receive Business Support Program emails. You can turn them back on any time from your Leadership Info page.'
  );
}
