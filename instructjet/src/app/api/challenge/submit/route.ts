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

  // Check premium
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', user.id)
    .single();
  if (userData?.plan_tier !== 'premium') {
    return NextResponse.json({ error: 'Only premium users can participate' }, { status: 403 });
  }

  // Get Monday of current week
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? 6 : day - 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Check not already submitted this week
  const { data: existing } = await supabaseAdmin
    .from('challenge_submissions')
    .select('id')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: 'You have already submitted a guide this week' }, { status: 400 });
  }

  // Insert submission
  const { error: insertError } = await supabaseAdmin
    .from('challenge_submissions')
    .insert({
      user_id: user.id,
      guide_url,
      week_start: weekStartStr,
      submitted_at: new Date().toISOString(),
    });
  if (insertError) {
    console.error('Insert error:', insertError);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Guide submitted successfully!' });
}