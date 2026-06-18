// app/api/paddle/create-token-pack/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
const TOKEN_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_TOKEN_PRICE_ID!;

// Use sandbox or live based on API key (or environment variable)
const PADDLE_API_BASE_URL = process.env.PADDLE_ENVIRONMENT === 'production'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paddleApiKey = process.env.PADDLE_API_KEY?.trim();
    const tokenPriceId = process.env.NEXT_PUBLIC_PADDLE_TOKEN_PRICE_ID?.trim();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (!paddleApiKey || !tokenPriceId || !appUrl) {
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

    console.log('Creating token pack transaction:', {
      price_id: tokenPriceId,
      user_id: user.id,
      email: dbUser.email,
    });

    const response = await fetch(`${PADDLE_API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
        'Paddle-Version': '1',
      },
      body: JSON.stringify({
        items: [{ price_id: tokenPriceId, quantity: 1 }],
        custom_data: { user_id: user.id, type: 'token_pack' },
        customer_email: dbUser.email,
        success_url: `${appUrl}/pricing?token_success=true`,
        cancel_url: `${appUrl}/pricing?token_cancelled=true`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paddle token pack error:', JSON.stringify(data.error, null, 2));
      return NextResponse.json(
        { error: data.error?.detail || 'Failed to create token pack checkout' },
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
      const getTx = await fetch(`${PADDLE_API_BASE_URL}/transactions/${txId}`, {
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

    console.log('Token pack checkout URL:', checkoutUrl);
    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error('Create token pack error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}