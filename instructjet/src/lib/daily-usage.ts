// lib/daily-usage.ts
import { supabaseAdmin } from './supabase-admin';

/**
 * Get the current daily DeepSeek usage count for a user (UTC date).
 * For premium users, always returns 0 (unlimited).
 */
export async function getDailyDeepSeekUsage(userId: string): Promise<number> {
  // Check if user is premium first (to avoid unnecessary DB calls)
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', userId)
    .single();

  if (user?.plan_tier === 'premium') {
    return 0; // unlimited
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const { data, error } = await supabaseAdmin
    .from('daily_ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (error || !data) {
    return 0;
  }
  return data.count || 0;
}

/**
 * Increment daily usage count for a free user.
 * Does nothing for premium users.
 */
export async function incrementDailyDeepSeekUsage(userId: string): Promise<void> {
  // Check if premium – skip if so
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', userId)
    .single();

  if (user?.plan_tier === 'premium') {
    console.log(`[daily-usage] User ${userId} is premium – skipping increment`);
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  // 1. Try to get existing row
  const { data: existing, error: selectError } = await supabaseAdmin
    .from('daily_ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (selectError) {
    console.error('[daily-usage] Error checking existing row:', selectError);
    return;
  }

  if (existing) {
    // Increment the count
    const newCount = (existing.count || 0) + 1;
    const { error: updateError } = await supabaseAdmin
      .from('daily_ai_usage')
      .update({ count: newCount })
      .eq('user_id', userId)
      .eq('date', today);
    if (updateError) {
      console.error('[daily-usage] Failed to increment count:', updateError);
    } else {
      console.log(`[daily-usage] Incremented to ${newCount} for user ${userId}`);
    }
  } else {
    // Insert new row with count = 1
    const { error: insertError } = await supabaseAdmin
      .from('daily_ai_usage')
      .insert({ user_id: userId, date: today, count: 1 });
    if (insertError) {
      console.error('[daily-usage] Failed to insert new row:', insertError);
    } else {
      console.log(`[daily-usage] Inserted new row with count=1 for user ${userId}`);
    }
  }
}

/**
 * Check if the user is allowed to use DeepSeek for a given operation.
 * For evaluation (isEvaluation=true), always allowed.
 * For non-evaluation, premium users always allowed; free users allowed if count < 20.
 */
export async function canUseDeepSeek(
  userId: string,
  isEvaluation = false
): Promise<{ allowed: boolean; remaining: number }> {
  if (isEvaluation) {
    return { allowed: true, remaining: Infinity };
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', userId)
    .single();

  if (user?.plan_tier === 'premium') {
    return { allowed: true, remaining: Infinity };
  }

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabaseAdmin
    .from('daily_ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  const currentCount = data?.count || 0;
  const allowed = currentCount < 20;
  const remaining = Math.max(0, 20 - currentCount);
  console.log(`[daily-usage] User ${userId} count=${currentCount}, allowed=${allowed}, remaining=${remaining}`);
  return { allowed, remaining };
}