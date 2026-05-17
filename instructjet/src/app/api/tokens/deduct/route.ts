import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { deductTokens } from '@/lib/token-manager';

export async function POST(req: NextRequest) {
  // 1. Authenticate using custom session cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. Parse request body
  const { amount, feature, metadata } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }
  
  // 3. Deduct tokens
  const result = await deductTokens(user.id, amount, feature, metadata);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 402 });
  }
  
  return NextResponse.json({ success: true, remaining: result.remaining });
}