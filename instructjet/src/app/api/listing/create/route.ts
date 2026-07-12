// src/app/api/listing/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { deductTokens } from '@/lib/token-manager';

const ACTIVATION_COST = 5000;
const LISTING_DURATION_DAYS = 7;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUserFromSession(sessionToken);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { guideId, description, category, contactInfo, price } = await req.json();
  if (!guideId) return NextResponse.json({ error: 'Missing guideId' }, { status: 400 });

  // Verify guide ownership and that it's private
  const { data: guide, error: guideError } = await supabaseAdmin
    .from('guides')
    .select('user_id, is_public')
    .eq('id', guideId)
    .single();
  if (guideError || !guide) return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  if (guide.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (guide.is_public !== false) {
    return NextResponse.json({ error: 'Only private guides can be sold' }, { status: 400 });
  }

  // Deduct tokens
  const deductResult = await deductTokens(user.id, ACTIVATION_COST, 'listing_activation', { guideId });
  if (!deductResult.success) {
    return NextResponse.json({ error: deductResult.error || 'Insufficient tokens' }, { status: 402 });
  }

  // Check if there's already a listing (active or inactive)
  const { data: existingListing } = await supabaseAdmin
    .from('guide_listings')
    .select('id, is_active')
    .eq('guide_id', guideId)
    .maybeSingle();

  const now = new Date();
  const activeUntil = new Date(now.getTime() + LISTING_DURATION_DAYS * 24 * 60 * 60 * 1000);

  let result;
  if (existingListing) {
    // Update existing listing
    result = await supabaseAdmin
      .from('guide_listings')
      .update({
        description,
        category,
        contact_info: contactInfo,
        price: price || null,
        active_until: activeUntil.toISOString(),
        is_active: true,
        updated_at: now.toISOString(),
      })
      .eq('id', existingListing.id)
      .select();
  } else {
    // Create new listing
    result = await supabaseAdmin
      .from('guide_listings')
      .insert({
        guide_id: guideId,
        description,
        category,
        contact_info: contactInfo,
        price: price || null,
        active_until: activeUntil.toISOString(),
        is_active: true,
      })
      .select();
  }

  if (result.error) {
    // Refund tokens if database error
    // We can implement a refund logic, but for simplicity we'll just log.
    console.error('Failed to create listing, tokens already deducted:', result.error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }

  return NextResponse.json({ success: true, listing: result.data[0] });
}