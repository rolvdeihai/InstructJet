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

  const now = new Date();

  // ---- Check deposit ----
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: deposits, error: depositError } = await supabaseAdmin
    .from('token_purchases')
    .select('purchase_date, refunded_tokens, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gte('tokens', 5000)
    .lte('purchase_date', sevenDaysAgo.toISOString())
    .eq('refunded_tokens', 0);

  if (depositError) {
    console.error('Error fetching deposits:', depositError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  const hasValidDeposit = deposits && deposits.length > 0;

  // ---- Check active listing (sold a guide) ----
  // Fetch user's guide IDs
  const { data: userGuides, error: userGuidesError } = await supabaseAdmin
    .from('guides')
    .select('id')
    .eq('user_id', user.id);

  const guideIds = userGuides?.map(g => g.id) || [];
  
  // Fetch active listings for those guides
  let hasListing = false;
  if (guideIds.length > 0) {
    const { data: userListings, error: listingsErr } = await supabaseAdmin
      .from('guide_listings')
      .select('id')
      .eq('is_active', true)
      .gt('active_until', now.toISOString())
      .in('guide_id', guideIds);
    
    if (listingsErr) {
      console.error('Error fetching listings:', listingsErr);
      // We'll continue but treat as no listing
    } else {
      hasListing = userListings && userListings.length > 0;
    }
  }

  // ---- Check existing submission this week ----
  const day = now.getDay();
  const diffToMonday = (day === 0 ? 6 : day - 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const { data: existing } = await supabaseAdmin
    .from('challenge_submissions')
    .select('id, submitted_at')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .maybeSingle();

  const canSubmit = hasValidDeposit && hasListing && !existing;
  const alreadySubmitted = !!existing;

  return NextResponse.json({
    canSubmit,
    alreadySubmitted,
    hasDeposit: hasValidDeposit,
    hasListing,
    weekStart: weekStartStr,
    submittedAt: existing?.submitted_at || null,
  });
}