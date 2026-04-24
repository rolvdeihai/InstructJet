// app/api/paypal/confirm-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionID, userEmail } = body as { subscriptionID: string; userEmail: string };

    if (!subscriptionID || !userEmail) {
      return NextResponse.json(
        { error: 'Missing subscriptionID or userEmail' },
        { status: 400 }
      );
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user to premium (tier, status, period end)
    const nextPeriodEnd = new Date();
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + 30);

    await supabaseAdmin
      .from('users')
      .update({
        plan_tier: 'premium',
        subscription_status: 'active',
        subscription_id: subscriptionID,
        current_period_end: nextPeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Give first month's tokens (1,000,000)
    await supabaseAdmin
      .from('token_balances')
      .update({
        subscription_tokens: 1000000,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    );
  }
}