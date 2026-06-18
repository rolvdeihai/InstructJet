import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { comparePassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 🧹 DELETE any existing sessions for this user (to avoid multiple valid sessions)
    await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('user_id', user.id);

    // Create new session
    const sessionToken = await createSession(user.id);

    // 🍪 Clear existing cookie first (if any)
    const cookieStore = await cookies();
    cookieStore.delete('instructjet_session'); // remove old cookie
    
    // Set fresh cookie
    cookieStore.set('instructjet_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return user (without password_hash)
    const { password_hash, ...userWithoutHash } = user;
    return NextResponse.json({ user: userWithoutHash });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}