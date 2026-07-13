import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const language = searchParams.get('language') || '';
    const tab = searchParams.get('tab') || 'recent'; // 'recent' | 'sale' | 'public'
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const now = new Date().toISOString();

    // ─── Build query for public guides ──────────────────────────────
    let publicQuery = supabaseAdmin
      .from('guides')
      .select('id, slug, title, content, created_at, user_id, language', { count: 'exact' })
      .eq('is_public', true);

    // Apply filters
    if (language) publicQuery = publicQuery.eq('language', language);
    if (tab === 'public') publicQuery = publicQuery.eq('is_public', true);
    if (tab === 'sale') publicQuery = publicQuery.eq('is_public', false); // but we handle sale separately below

    if (search) {
      publicQuery = publicQuery.ilike('title', `%${search}%`);
    }

    // For tab = 'sale', we only want listings; we'll handle separately.
    // For tab = 'recent' or 'public', we include public guides.

    let finalItems: any[] = [];
    let totalCount = 0;

    if (tab === 'sale') {
      // ─── Only listings (private guides with active listings) ─────
      // First get private guides with language and search filter
      let privateQuery = supabaseAdmin
        .from('guides')
        .select('id, user_id, slug, title, content, language')
        .eq('is_public', false);
      if (language) privateQuery = privateQuery.eq('language', language);
      if (search) privateQuery = privateQuery.ilike('title', `%${search}%`);
      const { data: privateGuides, error: privateError } = await privateQuery;
      if (privateError) throw privateError;
      const guideIds = privateGuides?.map(g => g.id) || [];

      // Get active listings for those guides
      let listingsQuery = supabaseAdmin
        .from('guide_listings')
        .select(`
          id,
          description,
          category,
          contact_info,
          price,
          active_until,
          created_at,
          guide_id
        `)
        .eq('is_active', true)
        .gt('active_until', now)
        .in('guide_id', guideIds);

      // Apply category filter
      if (category) {
        listingsQuery = listingsQuery.eq('category', category);
      }

      const { data: listings, error: listingsError, count: listingsCount } = await listingsQuery
        .range(from, to)
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      // Build maps
      const guidesMap: Record<string, any> = {};
      (privateGuides || []).forEach(g => { guidesMap[g.id] = g; });

      // Collect user IDs
      const userIds = (privateGuides || []).map(g => g.user_id);
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);
      const usersMap: Record<string, any> = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });

      finalItems = (listings || []).map((l: any) => {
        const guide = guidesMap[l.guide_id];
        const user = guide ? usersMap[guide.user_id] : null;
        return {
          type: 'listing' as const,
          listingId: l.id,
          guideId: l.guide_id,
          slug: guide?.slug || '',
          title: guide?.title || 'Unknown Guide',
          content: guide?.content || '',
          language: guide?.language || 'en',
          description: l.description,
          category: l.category,
          contactInfo: l.contact_info,
          price: l.price,
          activeUntil: l.active_until,
          created_at: l.created_at,
          user: {
            id: guide?.user_id || '',
            username: user?.full_name || user?.email?.split('@')[0] || 'unknown',
            full_name: user?.full_name || 'Unknown',
          }
        };
      });
      totalCount = listingsCount || 0;

    } else {
      // ─── Public guides (tab = 'recent' or 'public') ──────────────
      // Apply category? Category only applies to listings, so ignore.

      const { data: guides, error: guidesError, count: guidesCount } = await publicQuery
        .range(from, to)
        .order('created_at', { ascending: false });

      if (guidesError) throw guidesError;

      // Fetch users
      const userIds = (guides || []).map(g => g.user_id);
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);
      const usersMap: Record<string, any> = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });

      finalItems = (guides || []).map((g: any) => {
        const user = usersMap[g.user_id];
        return {
          type: 'guide' as const,
          id: g.id,
          slug: g.slug,
          title: g.title,
          content: g.content,
          language: g.language || 'en',
          created_at: g.created_at,
          user: {
            id: g.user_id,
            username: user?.full_name || user?.email?.split('@')[0] || 'unknown',
            full_name: user?.full_name || 'Unknown',
          }
        };
      });
      totalCount = guidesCount || 0;
    }

    const hasMore = (page * limit) < totalCount;

    return NextResponse.json({
      items: finalItems,
      hasMore,
      total: totalCount,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Explore API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}