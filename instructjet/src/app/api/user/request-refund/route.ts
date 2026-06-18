import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestedTokens, bankHolderName, bankName, bankAccountNumber } = await request.json();

    // Validation
    if (!requestedTokens || requestedTokens <= 0) {
      return NextResponse.json({ error: 'Invalid token amount' }, { status: 400 });
    }
    if (!bankHolderName || !bankName || !bankAccountNumber) {
      return NextResponse.json({ error: 'All bank fields required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Calculate total refundable tokens
    const { data: purchases, error: fetchError } = await supabaseAdmin
      .from('token_purchases')
      .select('tokens, refunded_tokens')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('refundable_until', now);

    if (fetchError) {
      console.error('Fetch purchases error:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const totalRefundable = purchases.reduce(
      (sum, p) => sum + (p.tokens - (p.refunded_tokens || 0)),
      0
    );

    if (requestedTokens > totalRefundable) {
      return NextResponse.json(
        { error: `Requested amount exceeds refundable tokens (${totalRefundable})` },
        { status: 400 }
      );
    }

    // Insert refund request
    const { data: requestRecord, error: insertError } = await supabaseAdmin
      .from('refund_requests')
      .insert({
        user_id: user.id,
        requested_tokens: requestedTokens,
        bank_holder_name: bankHolderName,
        bank_name: bankName,
        bank_account_number: bankAccountNumber,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert refund request error:', insertError);
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }

    return NextResponse.json({ success: true, request: requestRecord });
  } catch (error) {
    console.error('Refund request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}