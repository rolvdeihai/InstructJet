// src/lib/guide-owner.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Loads a guide for its owner. Returns either `{ user, guide }` or `{ error }`
 * with a ready-to-return NextResponse (401 / 404 / 403).
 */
export async function getOwnedGuide(guideId: string, columns = 'id, slug, title, content, team_profile, user_id') {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get('instructjet_session')?.value);
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: guide, error } = await supabaseAdmin
    .from('guides')
    .select(columns)
    .eq('id', guideId)
    .single();
  if (error || !guide) {
    return { error: NextResponse.json({ error: 'Guide not found' }, { status: 404 }) };
  }
  if ((guide as any).user_id !== user.id) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { user, guide: guide as any };
}
