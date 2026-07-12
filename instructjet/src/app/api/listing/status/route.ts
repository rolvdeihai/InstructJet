// src/app/api/listing/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guideId = searchParams.get('guideId');
  if (!guideId) return NextResponse.json({ error: 'Missing guideId' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('guide_listings')
    .select('*')
    .eq('guide_id', guideId)
    .eq('is_active', true)
    .gt('active_until', new Date().toISOString())
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listing: data });
}