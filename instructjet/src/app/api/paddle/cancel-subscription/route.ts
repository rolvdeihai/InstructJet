// app/api/paddle/cancel-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;
const PADDLE_ENV = process.env.PADDLE_ENVIRONMENT || 'sandbox';
const PADDLE_API_BASE_URL = PADDLE_ENV === 'production'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription_id from Supabase
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

    console.log(`Cancelling Paddle subscription: ${dbUser.subscription_id} for user ${user.id}`);

    // Call Paddle API to cancel the subscription
    const response = await fetch(
      `${PADDLE_API_BASE_URL}/subscriptions/${dbUser.subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
          'Paddle-Version': '1',
        },
        body: JSON.stringify({
          effective_from: 'next_billing_period', // cancel at the end of current period
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Paddle cancel error:', JSON.stringify(responseData, null, 2));
      // Handle specific error cases
      if (responseData.error?.code === 'subscription_already_canceled') {
        // Already canceled – treat as success for our side
        console.log('Subscription already canceled in Paddle');
      } else {
        return NextResponse.json(
          { error: responseData.error?.detail || 'Failed to cancel subscription in Paddle' },
          { status: response.status }
        );
      }
    } else {
      console.log('Paddle subscription canceled successfully');
    }

    // Update user in Supabase to free tier (immediate)
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

    // Reset subscription tokens
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