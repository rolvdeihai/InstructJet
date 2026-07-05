import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { guide_url } = await req.json();
  if (!guide_url || typeof guide_url !== 'string') {
    return NextResponse.json({ error: 'Guide URL is required' }, { status: 400 });
  }

  // ─── Check for valid deposit ──────────────────────────────────────────
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: deposits, error: depositError } = await supabaseAdmin
    .from('token_purchases')
    .select('purchase_date')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gte('tokens', 5000)
    .lte('purchase_date', sevenDaysAgo.toISOString())
    .eq('refunded_tokens', 0)
    .limit(1);

  if (depositError) {
    console.error('Error checking deposit:', depositError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!deposits || deposits.length === 0) {
    return NextResponse.json({
      error: 'You need a $5 deposit (5,000 tokens) that is at least 7 days old and not refunded to participate.'
    }, { status: 403 });
  }

  // ─── Get Monday of current week ──────────────────────────────────────
  const day = now.getDay();
  const diffToMonday = (day === 0 ? 6 : day - 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // ─── Check not already submitted this week ──────────────────────────
  const { data: existing } = await supabaseAdmin
    .from('challenge_submissions')
    .select('id')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'You have already submitted a guide this week' }, { status: 400 });
  }

  // ─── Insert submission ──────────────────────────────────────────────
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('challenge_submissions')
    .insert({
      user_id: user.id,
      guide_url,
      week_start: weekStartStr,
      submitted_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (insertError || !inserted) {
    console.error('Insert error:', insertError);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }

  // ─── Generate certificate URL ──────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const certificateUrl = `${baseUrl}/certificates/${inserted.id}`;

  return NextResponse.json({
    success: true,
    message: 'Guide submitted successfully!',
    certificateUrl,
  });
}