// src/app/api/guide/view/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing guide id' }, { status: 400 });
    }

    const { data: current, error: fetchError } = await supabaseAdmin
      .from('guides')
      .select('views')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    const newViews = (current?.views || 0) + 1;
    const { data, error: updateError } = await supabaseAdmin
      .from('guides')
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
    console.error('Error incrementing guide views:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}