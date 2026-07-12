import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    const now = new Date().toISOString();

    // 1. Public guides with user info from users table
    const { data: publicGuides, error: publicError } = await supabaseAdmin
      .from('guides')
      .select(`
        id, 
        slug, 
        title, 
        content, 
        created_at, 
        user_id,
        users!inner(full_name, email)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (publicError) {
      console.error('Public guides error:', publicError);
      return NextResponse.json({ error: publicError.message }, { status: 500 });
    }

    // 2. Active listings with guide and user info
    const { data: listings, error: listingError } = await supabaseAdmin
      .from('guide_listings')
      .select(`
        id,
        description,
        category,
        contact_info,
        price,
        active_until,
        created_at,
        guide:guides!inner(
          id,
          slug,
          title,
          content,
          user_id,
          users!inner(full_name, email)
        )
      `)
      .eq('is_active', true)
      .gt('active_until', now)
      .order('created_at', { ascending: false });

    if (listingError) {
      console.error('Listings error:', listingError);
      return NextResponse.json({ error: listingError.message }, { status: 500 });
    }

    // Combine items
    const exploreItems = [
      ...(publicGuides || []).map((g: any) => ({
        type: 'guide' as const,
        id: g.id,
        slug: g.slug,
        title: g.title,
        content: g.content,
        created_at: g.created_at,
        user: {
          id: g.user_id,
          full_name: g.users?.full_name || 'Unknown',
          username: g.users?.email?.split('@')[0] || 'unknown',
        }
      })),
      ...(listings || []).map((l: any) => ({
        type: 'listing' as const,
        listingId: l.id,
        guideId: l.guide.id,
        slug: l.guide.slug,
        title: l.guide.title,
        content: l.guide.content,
        description: l.description,
        category: l.category,
        contactInfo: l.contact_info,
        price: l.price,
        activeUntil: l.active_until,
        created_at: l.created_at,
        user: {
          id: l.guide.user_id,
          full_name: l.guide.users?.full_name || 'Unknown',
          username: l.guide.users?.email?.split('@')[0] || 'unknown',
        }
      })),
    ];

    // Sort by created_at descending
    exploreItems.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ items: exploreItems });
  } catch (error) {
    console.error('Explore API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}