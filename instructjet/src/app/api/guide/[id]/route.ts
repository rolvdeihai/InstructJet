import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing guide id' }, { status: 400 });
  }

  const { data: guide, error } = await supabaseAdmin
    .from('guides')
    .select('id, title, content, is_public, user_id') // added user_id
    .eq('id', id)
    .single();

  if (error || !guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  // Check ownership
  if (guide.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ 
    title: guide.title, 
    content: guide.content,
    is_public: guide.is_public 
  });
}