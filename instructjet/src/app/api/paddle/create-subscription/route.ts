// app/api/paddle/create-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
const SUBSCRIPTION_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID!;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paddleApiKey = process.env.PADDLE_API_KEY?.trim();
    const subscriptionPriceId = process.env.NEXT_PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID?.trim();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (!paddleApiKey || !subscriptionPriceId || !appUrl) {
      console.error('Missing environment variables');
      return NextResponse.json({ error: 'Payment provider misconfigured' }, { status: 500 });
    }

    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single();

    if (userError || !dbUser || !dbUser.email) {
      console.error('User not found or missing email');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Creating Paddle transaction with:', {
      price_id: subscriptionPriceId,
      user_id: user.id,
      email: dbUser.email,
    });

    const response = await fetch('https://sandbox-api.paddle.com/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
        'Paddle-Version': '1',
      },
      body: JSON.stringify({
        items: [{ price_id: subscriptionPriceId, quantity: 1 }],
        custom_data: { user_id: user.id },
        customer_email: dbUser.email,
        success_url: `${appUrl}/pricing?subscription=success`,
        cancel_url: `${appUrl}/pricing?subscription=cancelled`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paddle error:', JSON.stringify(data.error, null, 2));
      return NextResponse.json(
        { error: data.error?.detail || 'Failed to create checkout' },
        { status: response.status }
      );
    }

    // ✅ Correct path: data.data.checkout.url
    const transaction = data.data;
    let checkoutUrl = transaction.checkout?.url;

    // If missing, fetch the transaction again (just in case)
    if (!checkoutUrl) {
      console.warn('Checkout URL missing in initial response, fetching transaction...');
      const txId = transaction.id;
      const getTx = await fetch(`https://sandbox-api.paddle.com/transactions/${txId}`, {
        headers: {
          'Authorization': `Bearer ${paddleApiKey}`,
          'Paddle-Version': '1',
        },
      });
      const txData = await getTx.json();
      checkoutUrl = txData.data?.checkout?.url || null;
    }

    if (!checkoutUrl) {
      console.error('No checkout URL found in Paddle response');
      return NextResponse.json(
        { error: 'No checkout URL available' },
        { status: 500 }
      );
    }

    console.log('Checkout URL:', checkoutUrl);
    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}