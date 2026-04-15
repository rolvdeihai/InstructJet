import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('instructjet_session')?.value;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    // Clear cookie
    cookieStore.delete('instructjet_session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}