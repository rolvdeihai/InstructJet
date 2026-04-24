// app/api/paypal/create-subscription/route.ts
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
const PAYPAL_PREMIUM_PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_PREMIUM_PLAN_ID || !APP_URL) {
  throw new Error('Missing PayPal environment variables');
}

const PAYPAL_API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Define types for PayPal API responses
interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

interface PayPalSubscriptionResponse {
  id: string;
  links: PayPalLink[];
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planType = 'monthly' } = body as { userId: string; planType?: string };
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user from DB
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const auth = await axios.post<{ access_token: string }>(
      `${PAYPAL_API_BASE_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: PAYPAL_CLIENT_ID!,      // Add ! to assert non-undefined
          password: PAYPAL_CLIENT_SECRET!,  // Add ! to assert non-undefined
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    const accessToken = auth.data.access_token; // Now TypeScript knows it's string
    // Choose plan ID
    const planId = PAYPAL_PREMIUM_PLAN_ID;

    // Create subscription
    const subscription = await axios.post<PayPalSubscriptionResponse>(
      `${PAYPAL_API_BASE_URL}/v1/billing/subscriptions`,
      {
        plan_id: planId,
        custom_id: userId,
        application_context: {
          brand_name: 'InstructJet',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${APP_URL}/dashboard?subscription=success`,
          cancel_url: `${APP_URL}/pricing?subscription=cancelled`,
        },
        subscriber: {
          email_address: user.email,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save subscription ID to user
    await supabaseAdmin
      .from('users')
      .update({
        subscription_id: subscription.data.id,
        subscribed_plan_id: planId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    const approvalLink = subscription.data.links.find((link: PayPalLink) => link.rel === 'approve');
    if (!approvalLink) {
      throw new Error('No approval link found in PayPal response');
    }
    const approvalUrl = approvalLink.href;

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.data.id,
      approvalUrl,
    });
  } catch (error: any) {
    console.error('Create subscription error:', error);
    
    let errorMessage = 'Failed to create subscription';
    let details = '';
    
    if (error instanceof AxiosError) {
      details = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    } else if (error instanceof Error) {
      details = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details },
      { status: 500 }
    );
  }
}