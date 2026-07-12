// src/app/api/guide/verify-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { guideId, password } = await req.json();
  if (!guideId || !password) {
    return NextResponse.json({ error: 'Missing guideId or password' }, { status: 400 });
  }

  const { data: guide, error } = await supabaseAdmin
    .from('guides')
    .select('password_hash')
    .eq('id', guideId)
    .single();

  if (error || !guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  if (!guide.password_hash) {
    return NextResponse.json({ error: 'Guide is not private' }, { status: 400 });
  }

  const valid = await bcrypt.compare(password, guide.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}