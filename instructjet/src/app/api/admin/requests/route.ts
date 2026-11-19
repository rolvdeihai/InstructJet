// app/api/admin/requests/route.ts
//
// GET   ?status=&type=                      help requests from participants
// PATCH { id, decision: 'approved'|'rejected', message, sendEmail? }
//       records the decision and emails the participant (default: send)
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';
import { sendDecisionEmail } from '@/lib/program/request-emails';
import { getDecisionMessages } from '@/lib/program/server';
import type { RequestType } from '@/lib/program/requests';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  let query = supabaseAdmin
    .from('program_requests')
    .select('*, users!program_requests_user_id_fkey(email, full_name), program_participants(status, profile)')
    .order('created_at', { ascending: false })
    .limit(500);
  const status = req.nextUrl.searchParams.get('status');
  const type = req.nextUrl.searchParams.get('type');
  if (status) query = query.in('status', status.split(','));
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) return dbError(error);
  return NextResponse.json({ requests: data || [] });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const decision = body.decision as 'approved' | 'rejected';
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (decision !== 'approved' && decision !== 'rejected') return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });

  const { data: existing, error: loadErr } = await supabaseAdmin
    .from('program_requests')
    .select('*, users!program_requests_user_id_fkey(email, full_name), program_participants(profile)')
    .eq('id', body.id)
    .maybeSingle();
  if (loadErr) return dbError(loadErr);
  if (!existing) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  if (existing.status === 'withdrawn') return NextResponse.json({ error: 'The participant withdrew this request' }, { status: 400 });

  const type = existing.type as RequestType;
  const message = (typeof body.message === 'string' && body.message.trim()) || (await getDecisionMessages())[type][decision];
  const sendEmail = body.sendEmail !== false;

  let emailed: boolean | null = null;
  if (sendEmail && existing.users?.email) {
    emailed = await sendDecisionEmail(
      existing,
      {
        email: existing.users.email,
        full_name: existing.users.full_name,
        business_name: existing.program_participants?.profile?.business_name,
      },
      decision,
      message.slice(0, 5000)
    );
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('program_requests')
    .update({
      status: decision,
      admin_message: message.slice(0, 5000),
      reviewed_at: now,
      reviewed_by: admin.id,
      decision_email_sent: emailed,
      updated_at: now,
    })
    .eq('id', body.id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true, emailed });
}
