// src/app/api/listing/detail/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing listing id' }, { status: 400 });
    }

    // Fetch listing
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('guide_listings')
      .select(`
        id,
        description,
        category,
        contact_info,
        price,
        active_until,
        views,
        guide_id
      `)
      .eq('id', id)
      .eq('is_active', true)
      .gt('active_until', new Date().toISOString())
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found or inactive' }, { status: 404 });
    }

    // Fetch guide
    const { data: guide, error: guideError } = await supabaseAdmin
      .from('guides')
      .select('id, slug, title, content, user_id')
      .eq('id', listing.guide_id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Fetch seller
    const { data: seller } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email')
      .eq('id', guide.user_id)
      .single();

    return NextResponse.json({
      listing,
      guide,
      seller: seller || null,
    });
  } catch (error: any) {
    console.error('API /listing/detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}