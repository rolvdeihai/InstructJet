// app/api/reminders/unsubscribe/route.ts
//
// Link in every reminder email. GET shows a confirmation button (so email
// link scanners don't unsubscribe people), POST stops the reminders.
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const page = (body: string) =>
  new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>InstructJet reminders</title></head>
<body style="font-family:Arial,sans-serif;max-width:480px;margin:64px auto;padding:0 16px;color:#1f2937;text-align:center">${body}</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );

const isUuid = (v: string | null): v is string => !!v && /^[0-9a-f-]{36}$/i.test(v);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!isUuid(token)) return page('<h2>Invalid link</h2>');
  return page(`<h2>Stop task reminders?</h2>
<p>You will no longer get daily reminder emails for this task.</p>
<form method="POST"><input type="hidden" name="token" value="${token}">
<button type="submit" style="padding:10px 18px;background:#D02752;color:#fff;border:0;border-radius:8px;font-size:15px;cursor:pointer">Stop reminders</button></form>`);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = form.get('token');
  if (typeof token !== 'string' || !isUuid(token)) return page('<h2>Invalid link</h2>');

  await supabaseAdmin
    .from('guide_reminders')
    .update({ status: 'stopped' })
    .eq('unsubscribe_token', token)
    .eq('status', 'active');
  return page('<h2>Reminders stopped</h2><p>You won’t receive more reminder emails for this task.</p>');
}
