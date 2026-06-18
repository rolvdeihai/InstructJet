import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getCurrentUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date().toISOString();
    
    // Fetch all active purchases that are still refundable (refundable_until > now)
    const { data, error } = await supabaseAdmin
      .from('token_purchases')
      .select('tokens, refunded_tokens, refundable_until')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('refundable_until', now);

    if (error) {
      console.error('Error fetching refundable tokens:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const totalRefundable = data.reduce(
      (sum, p) => sum + (p.tokens - (p.refunded_tokens || 0)),
      0
    );

    const earliestExpiry = data.length
      ? new Date(Math.min(...data.map((p) => new Date(p.refundable_until).getTime())))
      : null;

    return NextResponse.json({
      totalRefundable,
      earliestExpiry: earliestExpiry ? earliestExpiry.toISOString() : null,
    });
  } catch (error) {
    console.error('Refundable tokens error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}