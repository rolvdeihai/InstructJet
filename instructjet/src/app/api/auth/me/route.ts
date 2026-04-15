import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('instructjet_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await getUserFromSession(sessionToken);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}