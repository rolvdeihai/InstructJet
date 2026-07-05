import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get current week Monday
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? 6 : day - 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Check for qualifying deposit: >= 5000 tokens, purchased at least 7 days ago, active, not refunded
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: deposits, error: depositError } = await supabaseAdmin
    .from('token_purchases')
    .select('purchase_date, refunded_tokens, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gte('tokens', 5000)                           // at least $5 worth
    .lte('purchase_date', sevenDaysAgo.toISOString()) // older than 7 days
    .eq('refunded_tokens', 0);                     // not refunded

  if (depositError) {
    console.error('Error fetching deposits:', depositError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const hasValidDeposit = deposits && deposits.length > 0;

  // Check existing submission this week
  const { data: existing } = await supabaseAdmin
    .from('challenge_submissions')
    .select('id, submitted_at')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .maybeSingle();

  const canSubmit = hasValidDeposit && !existing;
  const alreadySubmitted = !!existing;

  return NextResponse.json({
    canSubmit,
    alreadySubmitted,
    hasDeposit: hasValidDeposit,
    weekStart: weekStartStr,
    submittedAt: existing?.submitted_at || null,
  });
}