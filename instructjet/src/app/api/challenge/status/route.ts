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

  // Check user plan tier
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', user.id)
    .single();
  const isPremium = userData?.plan_tier === 'premium';

  // Get current week Monday
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? 6 : day - 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Check existing submission this week
  const { data: existing } = await supabaseAdmin
    .from('challenge_submissions')
    .select('id, submitted_at')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .maybeSingle();

  const canSubmit = isPremium && !existing;
  const alreadySubmitted = !!existing;

  return NextResponse.json({
    canSubmit,
    alreadySubmitted,
    isPremium,
    weekStart: weekStartStr,
    submittedAt: existing?.submitted_at || null,
  });
}