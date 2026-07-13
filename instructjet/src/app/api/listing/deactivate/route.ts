// src/app/api/listing/deactivate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
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

  const { listingId } = await req.json();
  if (!listingId) {
    return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });
  }

  // Verify ownership: listing must belong to a guide owned by the user
  const { data: listing, error: fetchError } = await supabaseAdmin
    .from('guide_listings')
    .select('guide_id')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const { data: guide, error: guideError } = await supabaseAdmin
    .from('guides')
    .select('user_id')
    .eq('id', listing.guide_id)
    .single();

  if (guideError || !guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  if (guide.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Deactivate listing: set is_active false, active_until to past date
  const { error: updateError } = await supabaseAdmin
    .from('guide_listings')
    .update({
      is_active: false,
      active_until: new Date(Date.now() - 1000).toISOString(), // 1 second ago
    })
    .eq('id', listingId);

  if (updateError) {
    console.error('Error deactivating listing:', updateError);
    return NextResponse.json({ error: 'Failed to deactivate listing' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}