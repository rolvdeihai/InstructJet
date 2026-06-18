// app/api/paddle/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// Supabase Client
// ============================================================
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// Environment Variables & Constants
// ============================================================
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET!;
const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;
const PADDLE_API_BASE_URL = process.env.PADDLE_ENVIRONMENT === 'production'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';
const TOKENS_PER_PACK = 250000;

// ============================================================
// Helper: Fetch a transaction by ID
// ============================================================
async function getTransaction(transactionId: string) {
  const response = await fetch(`${PADDLE_API_BASE_URL}/transactions/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${PADDLE_API_KEY}`,
      'Paddle-Version': '1',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch transaction: ${data.error?.detail || 'Unknown error'}`);
  }
  return data.data;
}

// ============================================================
// Helper: Get user_id from subscription (via transaction)
// ============================================================
async function getUserIdFromSubscription(subscription: any): Promise<string | null> {
  if (subscription.custom_data?.user_id) {
    return subscription.custom_data.user_id;
  }
  const transactionId = subscription.transaction_id;
  if (!transactionId) {
    console.error('No transaction_id in subscription');
    return null;
  }
  try {
    const transaction = await getTransaction(transactionId);
    return transaction.custom_data?.user_id || null;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

// ============================================================
// Signature Verification (Paddle Billing) with Full Debug
// ============================================================
function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  console.log('🔍 Signature debug:');
  console.log('Secret (first 10):', secret?.slice(0, 10) || 'missing');
  console.log('Secret (last 10):', secret?.slice(-10) || 'missing');
  console.log('Raw body length:', rawBody?.length || 0);
  console.log('Raw body first 200:', rawBody?.slice(0, 200));
  console.log('Raw body last 50:', rawBody?.slice(-50));
  console.log('Signature header:', signatureHeader);

  if (!signatureHeader) {
    console.warn('Missing paddle-signature header');
    return false;
  }

  const parts = signatureHeader.split(';');
  let ts: string | undefined;
  let h1: string | undefined;
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 'ts') ts = value;
    if (key === 'h1') h1 = value;
  }
  console.log('Parsed ts:', ts);
  console.log('Parsed h1:', h1);

  if (!ts || !h1) {
    console.warn('Missing ts or h1 in signature header');
    return false;
  }

  const dataToSign = rawBody + ':' + ts;
  console.log('DataToSign length:', dataToSign.length);
  console.log('DataToSign first 200:', dataToSign.slice(0, 200));

  const expected = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('hex');
  console.log('Expected signature:', expected);
  console.log('Received signature:', h1);

  // Check if they match as plain strings first (for debugging)
  const match = expected === h1;
  console.log('Match (string):', match);

  if (!match) {
    console.warn('Signature mismatch');
    // Log the differences
    console.warn('Expected first 16:', expected.slice(0, 16));
    console.warn('Received first 16:', h1.slice(0, 16));
    console.warn('Expected last 16:', expected.slice(-16));
    console.warn('Received last 16:', h1.slice(-16));
  }

  if (h1.length !== expected.length) {
    console.warn('Signature length mismatch');
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(h1, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

// ============================================================
// Webhook POST Handler
// ============================================================
export async function POST(request: NextRequest) {
  // 1. Read raw body (must be untouched for signature verification)
  const rawBody = await request.text();

  // 2. Get signature header
  const signature = request.headers.get('paddle-signature');

  // TEMPORARY: Bypass verification for testing
  // Remove this line after debugging
  const BYPASS_VERIFICATION = true;

  // 3. Verify signature
  const isValid = verifyPaddleSignature(rawBody, signature, PADDLE_WEBHOOK_SECRET);
  
  if (!isValid && !BYPASS_VERIFICATION) {
    console.error('❌ Invalid webhook signature – rejecting');
    return new Response('Unauthorized', { status: 401 });
  }

  if (!isValid && BYPASS_VERIFICATION) {
    console.warn('⚠️ Signature invalid but bypass is enabled – processing anyway');
  }

  // 4. Parse event
  const event = JSON.parse(rawBody);
  const eventId = event.event_id;
  const eventType = event.event_type;

  console.log(`✅ Processing event ${eventId} (${eventType})`);

  // 5. Idempotency: check if already processed
  const { data: existing } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('id', eventId)
    .maybeSingle();

  if (existing) {
    console.log(`⏭️ Event ${eventId} already processed – skipping`);
    return NextResponse.json({ received: true, already_processed: true });
  }

  // 6. Process event
  try {
    await processPaddleEvent(event);

    await supabaseAdmin
      .from('webhook_events')
      .insert({
        id: eventId,
        processed_at: new Date().toISOString(),
      });

    console.log(`✅ Event ${eventId} processed successfully`);
  } catch (error) {
    console.error(`❌ Error processing event ${eventId}:`, error);
  }

  return NextResponse.json({ received: true });
}

// ============================================================
// Event Processing Logic
// ============================================================
async function processPaddleEvent(event: any) {
  const eventType = event.event_type;
  const data = event.data;

  switch (eventType) {
    // ----------------------------------------------------------
    // Subscription Created (trial starts, grant access immediately)
    // ----------------------------------------------------------
    case 'subscription.created': {
      const subscription = data;
      const userId = await getUserIdFromSubscription(subscription);
      if (!userId) {
        console.error('❌ subscription.created: could not find user_id');
        return;
      }

      // Grant premium access immediately
      await supabaseAdmin
        .from('users')
        .update({
          plan_tier: 'premium',
          subscription_status: 'active',
          subscription_id: subscription.id,
          current_period_end: subscription.next_billed_at ? new Date(subscription.next_billed_at).toISOString() : null,
        })
        .eq('id', userId);

      // Give subscription tokens
      await supabaseAdmin
        .from('token_balances')
        .update({
          subscription_tokens: 1_000_000,
          last_token_reset: new Date().toISOString(),
        })
        .eq('user_id', userId);

      console.log(`✅ Subscription created for user ${userId} (access granted)`);
      break;
    }

    // ----------------------------------------------------------
    // Subscription Activated
    // ----------------------------------------------------------
    case 'subscription.activated': {
      const subscription = data;
      const userId = await getUserIdFromSubscription(subscription);
      if (!userId) {
        console.error('❌ subscription.activated: could not find user_id');
        return;
      }

      if (subscription.next_billed_at) {
        await supabaseAdmin
          .from('users')
          .update({
            current_period_end: new Date(subscription.next_billed_at).toISOString(),
          })
          .eq('id', userId);
      }

      console.log(`✅ Subscription activated for user ${userId}`);
      break;
    }

    // ----------------------------------------------------------
    // Subscription Canceled
    // ----------------------------------------------------------
    case 'subscription.canceled': {
      const subscription = data;
      const userId = await getUserIdFromSubscription(subscription);
      if (!userId) {
        console.error('❌ subscription.canceled: could not find user_id');
        return;
      }

      await supabaseAdmin
        .from('users')
        .update({
          plan_tier: 'free',
          subscription_status: 'canceled',
          subscription_id: null,
          current_period_end: null,
        })
        .eq('id', userId);

      await supabaseAdmin
        .from('token_balances')
        .update({ subscription_tokens: 0 })
        .eq('user_id', userId);

      console.log(`✅ Subscription canceled for user ${userId}`);
      break;
    }

    // ----------------------------------------------------------
    // Subscription Updated (Renewals)
    // ----------------------------------------------------------
    case 'subscription.updated': {
      const subscription = data;
      const userId = await getUserIdFromSubscription(subscription);
      if (!userId) {
        console.error('❌ subscription.updated: could not find user_id');
        return;
      }

      if (subscription.status === 'active' && subscription.next_billed_at) {
        const { data: tokenData } = await supabaseAdmin
          .from('token_balances')
          .select('last_token_reset')
          .eq('user_id', userId)
          .single();

        const lastReset = tokenData?.last_token_reset ? new Date(tokenData.last_token_reset) : null;
        const now = new Date();

        if (!lastReset || (now.getTime() - lastReset.getTime()) > 30 * 24 * 60 * 60 * 1000) {
          await supabaseAdmin
            .from('token_balances')
            .update({
              subscription_tokens: 1_000_000,
              last_token_reset: now.toISOString(),
            })
            .eq('user_id', userId);
          console.log(`🔄 Monthly tokens reset for user ${userId}`);
        }

        await supabaseAdmin
          .from('users')
          .update({
            current_period_end: new Date(subscription.next_billed_at).toISOString(),
          })
          .eq('id', userId);
      }
      break;
    }

    // ----------------------------------------------------------
    // Transaction Completed (One-time Token Pack Purchase)
    // ----------------------------------------------------------
    case 'transaction.completed': {
      const transaction = data;
      const customData = transaction.custom_data || {};
      const userId = customData.user_id;
      const type = customData.type;

      if (!userId) {
        console.error('❌ transaction.completed: missing user_id');
        return;
      }

      const isTokenPack = type === 'token_pack' ||
        transaction.items?.[0]?.price?.product?.name?.includes('Token') ||
        transaction.items?.[0]?.price?.name?.includes('Token');

      if (isTokenPack) {
        const tokensToAdd = TOKENS_PER_PACK;

        const { data: balance } = await supabaseAdmin
          .from('token_balances')
          .select('package_tokens')
          .eq('user_id', userId)
          .single();

        const newPackageTokens = (balance?.package_tokens || 0) + tokensToAdd;

        await supabaseAdmin
          .from('token_balances')
          .update({ package_tokens: newPackageTokens })
          .eq('user_id', userId);

        await supabaseAdmin
          .from('token_purchases')
          .insert({
            user_id: userId,
            transaction_id: transaction.id,
            tokens: tokensToAdd,
            purchase_date: new Date().toISOString(),
            refundable_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            refunded_tokens: 0,
            status: 'active',
          });

        console.log(`✅ Token pack purchased – added ${tokensToAdd} tokens to user ${userId}`);
      }
      break;
    }

    // ----------------------------------------------------------
    // Unhandled Events
    // ----------------------------------------------------------
    default:
      console.log(`ℹ️ Unhandled event type: ${eventType}`);
  }
}