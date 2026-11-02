// app/api/user/team-profile/route.ts
//
// The team profile from the user's most recent guide, used to prefill the
// questionnaire on the create page.
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get('instructjet_session')?.value);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from('guides')
    .select('team_profile')
    .eq('user_id', user.id)
    .not('team_profile', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ teamProfile: data?.team_profile || null });
}
