// app/api/admin/participants/send/route.ts
//
// POST { id, preview?: true }  send the participant's next email now, or preview it
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { previewProgramEmail, sendProgramEmailNow } from '@/lib/program/emails';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    if (body.preview) {
      const email = await previewProgramEmail(body.id);
      return NextResponse.json({ email });
    }
    const result = await sendProgramEmailNow(body.id);
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET ?id=  email history for one participant
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { data } = await supabaseAdmin
    .from('program_email_log')
    .select('id, kind, subject, status, error, sent_at, included_discord, catalog_ids, lesson_id')
    .eq('participant_id', id)
    .order('sent_at', { ascending: false })
    .limit(100);
  return NextResponse.json({ log: data || [] });
}
