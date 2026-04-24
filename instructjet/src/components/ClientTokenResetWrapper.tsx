'use client';

import { useTokenReset } from '@/hooks/useTokenReset';

export default function ClientTokenResetWrapper({ children }: { children: React.ReactNode }) {
  useTokenReset();
  return <>{children}</>;
}