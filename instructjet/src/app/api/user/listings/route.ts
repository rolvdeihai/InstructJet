// src/app/api/user/listings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: userGuides, error: guidesError } = await supabaseAdmin
    .from('guides')
    .select('id')
    .eq('user_id', user.id);

  if (guidesError) {
    return NextResponse.json({ error: guidesError.message }, { status: 500 });
  }

  const guideIds = userGuides?.map(g => g.id) || [];
  if (guideIds.length === 0) {
    return NextResponse.json({ listings: [] });
  }

  // Only active listings
  const { data: listings, error: listingsError } = await supabaseAdmin
    .from('guide_listings')
    .select(`
      id,
      description,
      category,
      price,
      active_until,
      views,
      guide_id,
      guides!inner(title)
    `)
    .in('guide_id', guideIds)
    .eq('is_active', true) // <-- only active
    .order('created_at', { ascending: false });

  if (listingsError) {
    return NextResponse.json({ error: listingsError.message }, { status: 500 });
  }

  const formattedListings = listings?.map(l => {
    const guideObj = Array.isArray(l.guides) ? l.guides[0] : l.guides;
    return {
      id: l.id,
      guide_id: l.guide_id,
      guide_title: (guideObj as any)?.title || 'Untitled',
      description: l.description,
      category: l.category,
      price: l.price,
      active_until: l.active_until,
      views: l.views || 0,
    };
  }) || [];

  return NextResponse.json({ listings: formattedListings });
}