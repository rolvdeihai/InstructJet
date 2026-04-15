import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getCurrentUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch full user data including subscription fields
    const { data: fullUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, plan_tier, subscription_id, subscribed_plan_id, plan_status')
      .eq('id', user.id)
      .single();

    if (userError || !fullUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch token balance
    const { data: tokenBalance } = await supabaseAdmin
      .from('token_balances')
      .select('subscription_tokens, package_tokens, month_year')
      .eq('user_id', user.id)
      .single();

    // Fetch recent token transactions (last 10)
    const { data: recentTransactions } = await supabaseAdmin
      .from('token_transactions')
      .select('id, amount, source, feature, metadata, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      user: fullUser,
      tokenBalance: tokenBalance || { subscription_tokens: 0, package_tokens: 0, month_year: null },
      recentTransactions: recentTransactions || [],
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName } = await request.json();

    if (fullName !== undefined && typeof fullName !== 'string') {
      return NextResponse.json({ error: 'Invalid full name' }, { status: 400 });
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        full_name: fullName || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select('id, email, full_name, plan_tier, subscription_id, subscribed_plan_id, plan_status')
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}