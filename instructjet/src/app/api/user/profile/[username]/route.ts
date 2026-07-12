// src/app/api/user/profile/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> } // 👈 Promise
) {
  const { username } = await params; // 👈 await the promise
  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  // Get profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, user_id')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get user's public guides
  const { data: guides, error: guidesError } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, content, created_at, total_token_budget, token_budget_remaining')
    .eq('user_id', profile.user_id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (guidesError) {
    return NextResponse.json({ error: guidesError.message }, { status: 500 });
  }

  return NextResponse.json({ profile, guides });
}