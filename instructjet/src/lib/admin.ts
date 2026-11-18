// src/lib/admin.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

/**
 * Use at the top of every /api/admin route:
 *   const admin = await requireAdmin(); if (admin instanceof NextResponse) return admin;
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return user;
}

export function dbError(error: { message?: string } | null, fallback = 'Database error') {
  console.error('[admin]', error);
  return NextResponse.json({ error: error?.message || fallback }, { status: 500 });
}
