import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription ID
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

    // Get PayPal access token
    const auth = await axios.post<{ access_token: string }>(
      `${PAYPAL_API_BASE_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: { username: PAYPAL_CLIENT_ID!, password: PAYPAL_CLIENT_SECRET! },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    const accessToken = auth.data.access_token;

    // Cancel the subscription at the end of current period (no refund)
    await axios.post(
      `${PAYPAL_API_BASE_URL}/v1/billing/subscriptions/${dbUser.subscription_id}/cancel`,
      { reason: 'User requested cancellation' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update user record to free tier
    const now = new Date().toISOString();
    await supabaseAdmin
      .from('users')
      .update({
        plan_tier: 'free',
        subscription_status: 'canceled',
        subscription_id: null,
        subscribed_plan_id: null,
        current_period_end: null,
        updated_at: now,
      })
      .eq('id', user.id);

    // Reset subscription tokens to 0 (keep package tokens)
    await supabaseAdmin
      .from('token_balances')
      .update({ subscription_tokens: 0 })
      .eq('user_id', user.id);

    return NextResponse.json({ success: true, message: 'Subscription cancelled. You have been downgraded to Free.' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    let errorMessage = 'Failed to cancel subscription';
    if (error instanceof AxiosError && error.response?.data) {
      errorMessage = error.response.data.message || errorMessage;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}