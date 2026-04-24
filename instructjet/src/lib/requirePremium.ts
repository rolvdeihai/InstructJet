// lib/requirePremium.ts
import { SupabaseClient } from '@supabase/supabase-js';

export async function requirePremium(
  userId: string,
  supabase: SupabaseClient
): Promise<void> {
  const { data: user, error } = await supabase
    .from('users')
    .select('plan_tier')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  if (user?.plan_tier !== 'premium') {
    throw new Error('Premium subscription required');
  }
}