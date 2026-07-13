// src/app/api/listing/view/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing listing id' }, { status: 400 });
    }

    // Increment views using a simple update (since RPC might not be available)
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('guide_listings')
      .select('views')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const newViews = (current?.views || 0) + 1;
    const { data, error: updateError } = await supabaseAdmin
      .from('guide_listings')
      .update({ views: newViews })
      .eq('id', id)
      .select('views')
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ views: data?.views || newViews });
  } catch (error: any) {
    console.error('Error incrementing listing views:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}