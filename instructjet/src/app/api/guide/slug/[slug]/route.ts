import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const { data: guide, error } = await supabaseAdmin
      .from('guides')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    return NextResponse.json({ guide });
  } catch (error: any) {
    console.error('API /guide/slug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}