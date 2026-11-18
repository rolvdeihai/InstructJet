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
      .select('subscription_id, plan_tier, subscription_plan, subscription_status, current_period_end')
      .eq('id', user.id)
      .single();

    if (userError || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (dbUser.plan_tier !== 'premium') {
      return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 });
    }

    if (dbUser.subscription_status === 'canceling') {
      return NextResponse.json({ error: 'Your subscription is already set to end at the close of this billing period' }, { status: 400 });
    }

    // Access granted by our team (e.g. manual program enrollment) has no
    // provider subscription to cancel and nothing will renew.
    if (!dbUser.subscription_id) {
      return NextResponse.json(
        { error: 'Your access was set up by our team and will not renew. Please contact us if you want to end it early.' },
        { status: 400 }
      );
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

    // Keep access until the paid period ends. Paddle sends `subscription.canceled`
    // at that point, and the webhook downgrades the user and ends program membership.
    const endsAt: string | null =
      responseData?.data?.scheduled_change?.effective_at ||
      responseData?.data?.current_billing_period?.ends_at ||
      dbUser.current_period_end ||
      null;

    await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'canceling',
        current_period_end: endsAt ? new Date(endsAt).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    const isProgram = dbUser.subscription_plan === 'business_program';
    const until = endsAt ? ` on ${new Date(endsAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}` : ' at the end of your billing period';

    return NextResponse.json({
      success: true,
      endsAt,
      message: isProgram
        ? `Cancelled. You stay in the Business Support Program and keep Premium until it ends${until}. You will not be charged again.`
        : `Cancelled. You keep Premium until it ends${until}. You will not be charged again.`,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}