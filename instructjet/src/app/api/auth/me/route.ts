// src/app/api/auth/me/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  console.log('🔵 /api/auth/me route called');
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('instructjet_session')?.value;
    console.log('Session token:', sessionToken ? 'present' : 'missing');

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await getUserFromSession(sessionToken);
    console.log('User found:', user ? user.email : 'null');
    return NextResponse.json({ user });
  } catch (error) {
    console.error('❌ Error in /api/auth/me:', error);
    return NextResponse.json({ user: null, error: 'Internal error' }, { status: 500 });
  }
}