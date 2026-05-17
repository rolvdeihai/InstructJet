import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getCurrentUser } from '@/lib/session';
import { comparePassword } from '@/lib/auth';
import { getUserTokenBalance } from '@/lib/token-manager'; // 👈 new import

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

    // 🔁 Use token-manager to get balance (automatically handles monthly reset)
    const balance = await getUserTokenBalance(user.id);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Fetch recent token transactions (last 10)
    const { data: recentTransactions } = await supabaseAdmin
      .from('token_transactions')
      .select('id, amount, feature, metadata, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      user: fullUser,
      tokenBalance: {
        subscription_tokens: balance.subscription_tokens,
        package_tokens: balance.package_tokens,
        month_year: currentMonth,
      },
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

    const { fullName, currentPassword } = await request.json();

    if (fullName !== undefined && typeof fullName !== 'string') {
      return NextResponse.json({ error: 'Invalid full name' }, { status: 400 });
    }

    // Require password confirmation for name change
    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password required to update profile' }, { status: 400 });
    }

    // Verify current password
    const { data: userWithHash } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single();

    if (!userWithHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValid = await comparePassword(currentPassword, userWithHash.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
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