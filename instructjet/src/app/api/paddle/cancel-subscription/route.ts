import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription_id (set by webhook on activation)
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('subscription_id, plan_tier')
      .eq('id', user.id)
      .single();

    if (userError || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (dbUser.plan_tier !== 'premium') {
      return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 });
    }

    if (!dbUser.subscription_id) {
      return NextResponse.json({ error: 'No subscription ID found' }, { status: 400 });
    }

    // Call Paddle API to cancel the subscription at period end
    const response = await fetch(
        `https://api.paddle.com/subscriptions/${dbUser.subscription_id}/cancel`,
        {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${PADDLE_API_KEY}`,
            'Content-Type': 'application/json',
            'Paddle-Version': '1',
            },
            body: JSON.stringify({
            effective_from: 'next_billing_period',
            }),
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Paddle cancel error:', errorData);
      return NextResponse.json(
        { error: 'Failed to cancel subscription in Paddle' },
        { status: 500 }
      );
    }

    // Update user in Supabase to free tier immediately (Paddle will send webhook later)
    // But to keep UI consistent, downgrade now. Webhook will also run but should be idempotent.
    await supabaseAdmin
      .from('users')
      .update({
        plan_tier: 'free',
        subscription_status: 'canceled',
        subscription_id: null,
        current_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Reset subscription tokens (package tokens remain)
    await supabaseAdmin
      .from('token_balances')
      .update({ subscription_tokens: 0 })
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled. You have been downgraded to Free.',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}