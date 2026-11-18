// app/api/admin/lessons/route.ts
//
// Leadership crash-course lessons, sent in sort_order and rotated.
// GET | POST item | PATCH { id, ...fields } | DELETE ?id=
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';

function clean(body: any, partial: boolean) {
  const out: Record<string, unknown> = {};
  if (body.title !== undefined || !partial) {
    if (!body.title?.trim()) return { error: 'Title is required' };
    out.title = String(body.title).trim().slice(0, 200);
  }
  if (body.summary !== undefined) out.summary = String(body.summary || '').trim().slice(0, 500) || null;
  if (body.body !== undefined) out.body = String(body.body || '').trim().slice(0, 20000) || null;
  if (body.url !== undefined) {
    const url = String(body.url || '').trim();
    if (url) {
      try {
        if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error();
      } catch {
        return { error: 'Invalid URL (must start with https://)' };
      }
    }
    out.url = url || null;
  }
  if (body.sort_order !== undefined) out.sort_order = Math.floor(Number(body.sort_order)) || 0;
  if (typeof body.is_active === 'boolean') out.is_active = body.is_active;
  return { out };
}

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const { data, error } = await supabaseAdmin.from('program_lessons').select('*').order('sort_order').order('created_at');
  if (error) return dbError(error);
  return NextResponse.json({ lessons: data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const body = await req.json().catch(() => ({}));
  const { out, error: invalid } = clean(body, false);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  // New lessons go to the end unless an order is given
  if (out!.sort_order === undefined) {
    const { data: last } = await supabaseAdmin.from('program_lessons').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
    out!.sort_order = (last?.sort_order ?? 0) + 1;
  }
  const { data, error } = await supabaseAdmin.from('program_lessons').insert(out!).select('*').single();
  if (error) return dbError(error);
  return NextResponse.json({ lesson: data });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { out, error: invalid } = clean(body, true);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
  const { error } = await supabaseAdmin
    .from('program_lessons')
    .update({ ...out, updated_at: new Date().toISOString() })
    .eq('id', body.id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('program_lessons').delete().eq('id', id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true });
}
