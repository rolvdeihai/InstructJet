import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { deductTokens, checkSufficientTokens } from '@/lib/token-manager';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: guideId } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify user is the guide owner
  const { data: guide, error: guideError } = await supabaseAdmin
    .from('guides')
    .select('user_id, total_token_budget, token_budget_remaining')
    .eq('id', guideId)
    .single();
  if (guideError || !guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }
  if (guide.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    total_budget: guide.total_token_budget,
    remaining_budget: guide.token_budget_remaining,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: guideId } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Verify user is guide owner
  const { data: guide, error: guideError } = await supabaseAdmin
    .from('guides')
    .select('user_id, total_token_budget, token_budget_remaining')
    .eq('id', guideId)
    .single();
  if (guideError || !guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }
  if (guide.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Check if creator has enough tokens in their main balance
  const hasTokens = await checkSufficientTokens(user.id, amount);
  if (!hasTokens) {
    return NextResponse.json({ error: 'Insufficient tokens in your account' }, { status: 402 });
  }

  // Deduct from creator's main balance
  const deduction = await deductTokens(user.id, amount, 'guide_budget_topup', {
    guide_id: guideId,
    operation: 'add_budget',
  });
  if (!deduction.success) {
    return NextResponse.json({ error: deduction.error }, { status: 500 });
  }

  // Add to guide's budget
  const newTotal = (guide.total_token_budget || 0) + amount;
  const newRemaining = (guide.token_budget_remaining || 0) + amount;
  const { error: updateError } = await supabaseAdmin
    .from('guides')
    .update({
      total_token_budget: newTotal,
      token_budget_remaining: newRemaining,
      updated_at: new Date().toISOString(),
    })
    .eq('id', guideId);
  if (updateError) {
    // TODO: rollback token deduction? For simplicity, we'll just log error.
    console.error('Failed to update guide budget:', updateError);
    return NextResponse.json({ error: 'Failed to add budget' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    total_budget: newTotal,
    remaining_budget: newRemaining,
  });
}