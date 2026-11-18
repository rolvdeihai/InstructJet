// app/api/admin/users/route.ts
//
// GET   ?q=&page=&plan=&role=&status=   list users with token balances and program status
// PATCH { id, ...fields }               update plan, period end, role, active flag, tokens
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';

const PAGE_SIZE = 25;

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(Number(sp.get('page')) || 1, 1);
  const q = (sp.get('q') || '').trim();

  let query = supabaseAdmin.from('users').select('*', { count: 'exact' });
  if (q) {
    const safe = q.replace(/[%,()]/g, ' ');
    query = query.or(`email.ilike.%${safe}%,full_name.ilike.%${safe}%`);
  }
  if (sp.get('plan')) query = query.eq('plan_tier', sp.get('plan')!);
  if (sp.get('role')) query = query.eq('role', sp.get('role')!);
  if (sp.get('status') === 'inactive') query = query.eq('is_active', false);
  if (sp.get('status') === 'active') query = query.eq('is_active', true);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) return dbError(error);

  const ids = (data || []).map((u) => u.id);
  const [{ data: balances }, { data: participants }] = await Promise.all([
    ids.length
      ? supabaseAdmin.from('token_balances').select('user_id, subscription_tokens, package_tokens').in('user_id', ids)
      : Promise.resolve({ data: [] as any[] }),
    ids.length
      ? supabaseAdmin.from('program_participants').select('user_id, id, status').in('user_id', ids)
      : Promise.resolve({ data: [] as any[] }),
  ]);
  const balanceBy = new Map((balances || []).map((b) => [b.user_id, b]));
  const participantBy = new Map((participants || []).map((p) => [p.user_id, p]));

  const users = (data || []).map(({ password_hash: _omit, ...u }) => ({
    ...u,
    tokens: balanceBy.get(u.id) || null,
    participant: participantBy.get(u.id) || null,
  }));

  return NextResponse.json({ users, total: count || 0, page, pageSize: PAGE_SIZE });
}

const USER_FIELDS = ['full_name', 'plan_tier', 'subscription_plan', 'subscription_status', 'current_period_end', 'role', 'is_active'] as const;

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const id = body.id as string;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  if (id === admin.id && (body.role === 'user' || body.is_active === false)) {
    return NextResponse.json({ error: 'You cannot remove your own admin access or deactivate yourself' }, { status: 400 });
  }
  if (body.role !== undefined && !['user', 'admin'].includes(body.role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  if (body.plan_tier !== undefined && !['free', 'basic', 'premium'].includes(body.plan_tier)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const f of USER_FIELDS) if (body[f] !== undefined) update[f] = body[f] === '' ? null : body[f];
  if (update.current_period_end) {
    const d = new Date(update.current_period_end as string);
    if (isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    update.current_period_end = d.toISOString();
  }

  if (Object.keys(update).length) {
    const { error } = await supabaseAdmin.from('users').update(update).eq('id', id);
    if (error) return dbError(error);
  }

  // Deactivating signs the user out everywhere
  if (body.is_active === false) await supabaseAdmin.from('sessions').delete().eq('user_id', id);

  // Token balances
  const tokenUpdate: Record<string, number> = {};
  for (const f of ['subscription_tokens', 'package_tokens'] as const) {
    if (body[f] !== undefined) {
      const n = Math.floor(Number(body[f]));
      if (!Number.isFinite(n) || n < 0) return NextResponse.json({ error: `Invalid ${f}` }, { status: 400 });
      tokenUpdate[f] = n;
    }
  }
  if (Object.keys(tokenUpdate).length) {
    const { data: existing } = await supabaseAdmin.from('token_balances').select('user_id').eq('user_id', id).maybeSingle();
    const now = new Date();
    const { error } = existing
      ? await supabaseAdmin.from('token_balances').update({ ...tokenUpdate, updated_at: now.toISOString() }).eq('user_id', id)
      : await supabaseAdmin.from('token_balances').insert({
          user_id: id,
          subscription_tokens: 0,
          package_tokens: 0,
          ...tokenUpdate,
          last_token_reset: now.toISOString(),
          month_year: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
        });
    if (error) return dbError(error);
  }

  return NextResponse.json({ success: true });
}
