import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { getUserTokenBalance } from '@/lib/token-manager';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
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
  
  // 2. Get token balance (automatically handles monthly reset)
  const balance = await getUserTokenBalance(user.id);
  
  // 3. Get last 10 transactions using supabaseAdmin (server-side)
  const { data: transactions } = await supabaseAdmin
    .from('token_transactions')
    .select('id, amount, feature, created_at, metadata')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);
  
  return NextResponse.json({
    subscription_tokens: balance.subscription_tokens,
    package_tokens: balance.package_tokens,
    total_tokens: balance.subscription_tokens + balance.package_tokens,
    recent_transactions: transactions || [],
  });
}