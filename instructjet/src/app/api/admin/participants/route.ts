// app/api/admin/participants/route.ts
//
// GET    ?status=            participants with user, capstone and email info
// POST   { email, subscribed_at?, grant_premium? }   enroll a user manually (e.g. paid Rp150.000 by transfer)
// PATCH  { id, status?, capstone_unlocked?, subscribed_at?, admin_notes?, email_opt_out? }
// DELETE ?id=                remove from the program (keeps the user account)
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';
import { enrollParticipant } from '@/lib/program/server';
import { CAPSTONE_UNLOCK_DAYS, isCapstoneUnlocked, isProfileComplete } from '@/lib/program/config';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  let query = supabaseAdmin
    .from('program_participants')
    .select('*, users(email, full_name, plan_tier, is_active), program_capstones(id, status, submitted_at, claimed_at)')
    .order('created_at', { ascending: false });
  const status = req.nextUrl.searchParams.get('status');
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return dbError(error);

  const participants = (data || []).map((p: any) => {
    const capstone = Array.isArray(p.program_capstones) ? p.program_capstones[0] : p.program_capstones;
    return {
      ...p,
      program_capstones: undefined,
      capstone: capstone || null,
      profile_complete: isProfileComplete(p.profile),
      capstone_open: isCapstoneUnlocked(p),
    };
  });
  return NextResponse.json({ participants });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const { data: user } = await supabaseAdmin.from('users').select('id').ilike('email', email).maybeSingle();
  if (!user) return NextResponse.json({ error: 'No user with that email. They need to sign up first.' }, { status: 404 });

  const subscribedAt = body.subscribed_at ? new Date(body.subscribed_at) : new Date();
  if (isNaN(subscribedAt.getTime())) return NextResponse.json({ error: 'Invalid start date' }, { status: 400 });

  try {
    const participant = await enrollParticipant(user.id, { source: 'manual', subscribedAt: subscribedAt.toISOString() });

    // Program members get premium benefits for the 3-month program
    if (body.grant_premium !== false) {
      const until = new Date(subscribedAt.getTime() + CAPSTONE_UNLOCK_DAYS * 86_400_000).toISOString();
      await supabaseAdmin
        .from('users')
        .update({ plan_tier: 'premium', subscription_plan: 'business_program', subscription_status: 'active', current_period_end: until })
        .eq('id', user.id);
      await supabaseAdmin
        .from('token_balances')
        .update({ subscription_tokens: 1_000_000, last_token_reset: new Date().toISOString() })
        .eq('user_id', user.id);
    }
    return NextResponse.json({ participant });
  } catch (e) {
    return dbError(e as Error);
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) {
    if (!['active', 'paused', 'canceled', 'deactivated'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (typeof body.capstone_unlocked === 'boolean') update.capstone_unlocked = body.capstone_unlocked;
  if (typeof body.email_opt_out === 'boolean') update.email_opt_out = body.email_opt_out;
  if (typeof body.admin_notes === 'string') update.admin_notes = body.admin_notes.slice(0, 5000);
  if (body.subscribed_at) {
    const d = new Date(body.subscribed_at);
    if (isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    update.subscribed_at = d.toISOString();
  }

  const { error } = await supabaseAdmin.from('program_participants').update(update).eq('id', body.id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('program_participants').delete().eq('id', id);
  if (error) return dbError(error);
  return NextResponse.json({ success: true });
}
