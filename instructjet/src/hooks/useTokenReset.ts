// src/hooks/useTokenReset.ts
"use client";  // ✅ Add this line

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

export function useTokenReset() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkAndResetTokens = async () => {
      const now = new Date();
      const periodEnd = user.current_period_end ? new Date(user.current_period_end) : null;

      if (user.plan_tier === 'premium' && periodEnd && now >= periodEnd) {
        // Add 1M tokens
        const { data: balance } = await supabase
          .from('token_balances')
          .select('subscription_tokens')
          .eq('user_id', user.id)
          .single();

        const newTokens = (balance?.subscription_tokens || 0) + 1000000;
        await supabase
          .from('token_balances')
          .update({ subscription_tokens: newTokens })
          .eq('user_id', user.id);

        // Extend period by 30 days
        const newPeriodEnd = new Date();
        newPeriodEnd.setDate(now.getDate() + 30);
        await supabase
          .from('users')
          .update({ current_period_end: newPeriodEnd.toISOString() })
          .eq('id', user.id);

        console.log('Token reset: added 1M tokens');
      }
    };

    checkAndResetTokens();
  }, [user]);
}