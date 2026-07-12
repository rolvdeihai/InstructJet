// src/app/profile/me/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function ProfileMePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  
  if (!sessionToken) {
    redirect('/login');
  }
  
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    redirect('/login');
  }

  // Try to get the user's profile
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('username')
    .eq('user_id', user.id)  // use user_id
    .single();

  // If profile doesn't exist, create it
  if (error || !profile) {
    const username = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
    
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: user.id,   // use user_id
        username: username,
        full_name: user.full_name || user.email,
      })
      .select('username')
      .single();

    if (createError || !newProfile) {
      console.error('Failed to create profile:', createError);
      redirect('/settings');
    }

    redirect(`/profile/${newProfile.username}`);
  }

  redirect(`/profile/${profile.username}`);
}