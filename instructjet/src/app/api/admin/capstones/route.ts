// app/api/admin/capstones/route.ts
//
// GET   ?status=                capstone submissions / Claude Cowork claims
// PATCH { id, status, review_notes? }
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  let query = supabaseAdmin
    .from('program_capstones')
    .select('*, users(email, full_name), program_participants(subscribed_at, status, profile)')
    .order('updated_at', { ascending: false });
  const status = req.nextUrl.searchParams.get('status');
  if (status) query = query.in('status', status.split(','));

  const { data, error } = await query;
  if (error) return dbError(error);
  return NextResponse.json({ capstones: data || [] });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (!['draft', 'submitted', 'claimed', 'approved', 'rejected', 'fulfilled'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('program_capstones')
    .update({
      status: body.status,
      review_notes: typeof body.review_notes === 'string' ? body.review_notes.slice(0, 5000) : undefined,
      reviewed_at: now,
      updated_at: now,
    })
    .eq('id', body.id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true });
}
