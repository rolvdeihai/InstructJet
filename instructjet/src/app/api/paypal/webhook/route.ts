// app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_WEBHOOK_ID) {
  throw new Error('Missing PayPal environment variables');
}

const PAYPAL_API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Type definitions
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface PayPalVerificationResponse {
  verification_status: 'SUCCESS' | 'FAILURE';
}

interface TokenBalance {
  subscription_tokens: number;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody) as PayPalWebhookEvent;
    const headers = Object.fromEntries(request.headers.entries());

    // Verify signature
    const isValid = await verifyWebhookSignature(event, headers, rawBody);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    // Process asynchronously
    processWebhookEvent(event).catch(console.error);

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return new Response('OK', { status: 200 });
  }
}

async function verifyWebhookSignature(
  event: PayPalWebhookEvent,
  headers: Record<string, string>,
  rawBody: string
): Promise<boolean> {
  try {
    const auth = await axios.post<{ access_token: string }>(
        `${PAYPAL_API_BASE_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
            auth: {
            username: PAYPAL_CLIENT_ID!,   // ✅ non-null assertion
            password: PAYPAL_CLIENT_SECRET!, // ✅ non-null assertion
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    );
    const accessToken = auth.data.access_token; // Now TypeScript knows it's a string

    const verification = await axios.post<PayPalVerificationResponse>(
      `${PAYPAL_API_BASE_URL}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return verification.data.verification_status === 'SUCCESS';
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    if (error instanceof AxiosError) {
      errorMessage = error.message;
      console.error('Verification failed:', error.response?.data);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Verification failed:', errorMessage);
    return false;
  }
}

async function processWebhookEvent(event: PayPalWebhookEvent) {
  const eventType = event.event_type;
  const resource = event.resource;
  const subscriptionId = resource.id;

  // Deduplication
  const { data: existing } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('id', event.id)
    .single();

  if (existing) {
    console.log(`Event ${event.id} already processed, skipping`);
    return;
  }

  // Find user by subscription_id
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .single();

  if (!user) {
    console.error(`No user found for subscription ${subscriptionId}`);
    return;
  }

  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(now.getDate() + 30);

  switch (eventType) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      await supabaseAdmin
        .from('users')
        .update({
          plan_tier: 'premium',
          subscription_status: 'active',
          current_period_end: nextMonth.toISOString(),
        })
        .eq('id', user.id);

      await supabaseAdmin
        .from('token_balances')
        .update({ subscription_tokens: 1000000 })
        .eq('user_id', user.id);

      console.log(`Subscription activated for user ${user.id}`);
      break;

    case 'BILLING.SUBSCRIPTION.CANCELLED':
      await supabaseAdmin
        .from('users')
        .update({
          plan_tier: 'free',
          subscription_status: 'canceled',
          subscription_id: null,
          current_period_end: null,
        })
        .eq('id', user.id);

      await supabaseAdmin
        .from('token_balances')
        .update({ subscription_tokens: 0 })
        .eq('user_id', user.id);

      console.log(`Subscription cancelled for user ${user.id}`);
      break;

    case 'BILLING.SUBSCRIPTION.RENEWED':
      const { data: balance } = await supabaseAdmin
        .from('token_balances')
        .select('subscription_tokens')
        .eq('user_id', user.id)
        .single<TokenBalance>();

      const newTokens = (balance?.subscription_tokens || 0) + 1000000;
      await supabaseAdmin
        .from('token_balances')
        .update({ subscription_tokens: newTokens })
        .eq('user_id', user.id);

      await supabaseAdmin
        .from('users')
        .update({ current_period_end: nextMonth.toISOString() })
        .eq('id', user.id);

      console.log(`Renewed +1M tokens for user ${user.id}`);
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  // Mark event as processed
  await supabaseAdmin
    .from('webhook_events')
    .insert({ id: event.id, processed_at: new Date().toISOString() });
}