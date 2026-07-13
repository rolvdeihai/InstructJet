'use client';

import { useEffect } from 'react';

export function ViewTracker({ type, id }: { type: 'guide' | 'listing'; id: string }) {
  useEffect(() => {
    const endpoint = type === 'guide' ? `/api/guide/view/${id}` : `/api/listing/view/${id}`;
    fetch(endpoint, { method: 'POST' }).catch(err => console.error('View tracker error:', err));
  }, [type, id]);

  return null;
}