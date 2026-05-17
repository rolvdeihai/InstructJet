// lib/token-manager.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MONTHLY_ALLOCATION = {
  free: 50_000,
  basic: 300_000,
  premium: 1_000_000,
};

export async function resetSubscriptionTokensIfNeeded(userId: string) {
  // Get user and current token balance
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', userId)
    .single();
  if (!user) throw new Error('User not found');

  const { data: balance } = await supabaseAdmin
    .from('token_balances')
    .select('last_token_reset, subscription_tokens')
    .eq('user_id', userId)
    .single();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastReset = balance?.last_token_reset ? new Date(balance.last_token_reset) : null;

  // If never reset or last reset is in a different month
  if (!lastReset || lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    const allocation = MONTHLY_ALLOCATION[user.plan_tier as keyof typeof MONTHLY_ALLOCATION] || MONTHLY_ALLOCATION.free;
    
    // Update subscription tokens to allocation, keep package tokens unchanged
    const { error } = await supabaseAdmin
      .from('token_balances')
      .update({
        subscription_tokens: allocation,
        last_token_reset: now.toISOString(),
        month_year: currentMonth,
        updated_at: now.toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return { reset: true, newSubscriptionTokens: allocation };
  }
  return { reset: false };
}

export async function getUserTokenBalance(userId: string) {
  await resetSubscriptionTokensIfNeeded(userId);
  
  const { data: balance } = await supabaseAdmin
    .from('token_balances')
    .select('subscription_tokens, package_tokens')
    .eq('user_id', userId)
    .single();
  
  if (!balance) {
    // Create default record
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('plan_tier')
      .eq('id', userId)
      .single();
    const allocation = MONTHLY_ALLOCATION[user?.plan_tier as keyof typeof MONTHLY_ALLOCATION] || MONTHLY_ALLOCATION.free;
    const newBalance = {
      user_id: userId,
      subscription_tokens: allocation,
      package_tokens: 0,
      last_token_reset: new Date().toISOString(),
      month_year: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    };
    await supabaseAdmin.from('token_balances').insert(newBalance);
    return { subscription_tokens: allocation, package_tokens: 0 };
  }
  
  return { subscription_tokens: balance.subscription_tokens || 0, package_tokens: balance.package_tokens || 0 };
}

export async function checkSufficientTokens(userId: string, required: number): Promise<boolean> {
  const balance = await getUserTokenBalance(userId);
  return (balance.subscription_tokens + balance.package_tokens) >= required;
}

export async function deductTokens(
  userId: string,
  amount: number,
  feature: string,
  metadata?: any
): Promise<{ success: boolean; error?: string; remaining: number }> {
  if (amount <= 0) return { success: true, remaining: 0 };
  
  // Check if enough
  const hasEnough = await checkSufficientTokens(userId, amount);
  if (!hasEnough) {
    return { success: false, error: 'Insufficient tokens', remaining: 0 };
  }
  
  // Get current balance
  const { data: balance, error: fetchError } = await supabaseAdmin
    .from('token_balances')
    .select('subscription_tokens, package_tokens')
    .eq('user_id', userId)
    .single();
  if (fetchError || !balance) {
    return { success: false, error: 'Could not fetch token balance', remaining: 0 };
  }
  
  let subscriptionLeft = balance.subscription_tokens || 0;
  let packageLeft = balance.package_tokens || 0;
  let remainingToDeduct = amount;
  
  // Deduct from subscription first
  const fromSubscription = Math.min(subscriptionLeft, remainingToDeduct);
  subscriptionLeft -= fromSubscription;
  remainingToDeduct -= fromSubscription;
  
  // Then from package
  const fromPackage = Math.min(packageLeft, remainingToDeduct);
  packageLeft -= fromPackage;
  remainingToDeduct -= fromPackage;
  
  if (remainingToDeduct > 0) {
    return { success: false, error: 'Inconsistent balance', remaining: 0 };
  }
  
  // Update database
  const { error: updateError } = await supabaseAdmin
    .from('token_balances')
    .update({
      subscription_tokens: subscriptionLeft,
      package_tokens: packageLeft,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  
  if (updateError) {
    return { success: false, error: updateError.message, remaining: 0 };
  }
  
  // Record transaction
  await supabaseAdmin.from('token_transactions').insert({
    user_id: userId,
    amount: -amount,
    source: 'usage',
    feature,
    metadata: { ...metadata, deducted_from_subscription: fromSubscription, deducted_from_package: fromPackage },
    created_at: new Date().toISOString(),
  });
  
  const remaining = subscriptionLeft + packageLeft;
  return { success: true, remaining };
}