// app/api/admin/catalog/route.ts
//
// GET    ?type=&active=&source=&q=   list catalog items
// POST   item                        add an item
// PATCH  { id, ...fields }           edit / activate / deactivate
// DELETE ?id=                        delete
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';
import { CATALOG_TYPE_VALUES, CATEGORY_VALUES } from '@/lib/program/config';

function clean(body: any, partial: boolean) {
  const out: Record<string, unknown> = {};
  const errors: string[] = [];
  const str = (k: string, max: number) => {
    if (body[k] === undefined) return;
    out[k] = body[k] === null || body[k] === '' ? null : String(body[k]).trim().slice(0, max);
  };

  if (body.type !== undefined || !partial) {
    if (!CATALOG_TYPE_VALUES.includes(body.type)) errors.push('Invalid type');
    else out.type = body.type;
  }
  if (body.title !== undefined || !partial) {
    if (!body.title?.trim()) errors.push('Title is required');
    else out.title = String(body.title).trim().slice(0, 200);
  }
  if (body.url !== undefined || !partial) {
    try {
      const u = new URL(String(body.url).trim());
      if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
      out.url = u.toString();
    } catch {
      errors.push('A valid URL is required');
    }
  }
  if (body.category !== undefined) {
    out.category = body.category === 'general' || CATEGORY_VALUES.includes(body.category) ? body.category : 'general';
  }
  str('description', 1000);
  str('location', 120);
  str('platform', 40);
  str('provider', 120);
  str('certification', 160);
  if (body.event_date !== undefined) {
    out.event_date = body.event_date && /^\d{4}-\d{2}-\d{2}$/.test(body.event_date) ? body.event_date : null;
  }
  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(',');
    out.tags = tags.map((t: unknown) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 12);
  }
  for (const b of ['is_online', 'is_free', 'is_active'] as const) if (typeof body[b] === 'boolean') out[b] = body[b];
  return { out, errors };
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const sp = req.nextUrl.searchParams;
  let query = supabaseAdmin.from('program_catalog').select('*').order('created_at', { ascending: false }).limit(500);
  if (sp.get('type')) query = query.eq('type', sp.get('type')!);
  if (sp.get('source')) query = query.eq('source', sp.get('source')!);
  if (sp.get('active') === 'true') query = query.eq('is_active', true);
  if (sp.get('active') === 'false') query = query.eq('is_active', false);
  const q = sp.get('q')?.trim().replace(/[%,()]/g, ' ');
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,provider.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return dbError(error);
  return NextResponse.json({ items: data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const { out, errors } = clean(body, false);
  if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('program_catalog')
    .insert({ ...out, source: 'manual' })
    .select('*')
    .single();
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'An item with this URL already exists' }, { status: 409 });
    return dbError(error);
  }
  return NextResponse.json({ item: data });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { out, errors } = clean(body, true);
  if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('program_catalog')
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
  const { error } = await supabaseAdmin.from('program_catalog').delete().eq('id', id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true });
}
