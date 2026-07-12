// src/app/api/guide/update-privacy/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUserFromSession(sessionToken);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { guideId, isPublic, password } = await req.json();
  if (!guideId) return NextResponse.json({ error: 'Missing guideId' }, { status: 400 });

  // Verify ownership
  const { data: guide, error: fetchError } = await supabaseAdmin
    .from('guides')
    .select('user_id')
    .eq('id', guideId)
    .single();
  if (fetchError || !guide) return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  if (guide.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let passwordHash = null;
  if (isPublic === false) {
    // Private guide requires a password
    if (!password || password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }
    passwordHash = await bcrypt.hash(password, 10);
  }

  const { error: updateError } = await supabaseAdmin
    .from('guides')
    .update({ is_public: isPublic, password_hash: passwordHash })
    .eq('id', guideId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}