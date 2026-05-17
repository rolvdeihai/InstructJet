// src/hooks/useTokenReset.ts
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

// Monthly token allocation per plan
const MONTHLY_ALLOCATION = {
  free: 50000,
  basic: 300000,
  premium: 1000000,
};

export function useTokenReset() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const resetTokensIfNeeded = async () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Get current token balance and last reset month
      const { data: balance, error } = await supabase
        .from('token_balances')
        .select('subscription_tokens, package_tokens, last_token_reset, month_year')
        .eq('user_id', user.id)
        .single();

      if (error || !balance) return;

      const lastResetMonth = balance.month_year;
      const plan = user.plan_tier || 'free';
      const allocation = MONTHLY_ALLOCATION[plan as keyof typeof MONTHLY_ALLOCATION];

      // If month changed (or never reset), reset subscription tokens to allocation
      if (lastResetMonth !== currentMonth) {
        const { error: updateError } = await supabase
          .from('token_balances')
          .update({
            subscription_tokens: allocation,
            last_token_reset: now.toISOString(),
            month_year: currentMonth,
            updated_at: now.toISOString(),
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Token reset failed:', updateError);
        } else {
          console.log(`✅ Monthly token reset: ${allocation} tokens for ${plan}`);
        }
      }
    };

    resetTokensIfNeeded();
  }, [user]);
}