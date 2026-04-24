// src/lib/auth.ts

import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabase-admin';

const SESSION_EXPIRY_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  const { error } = await supabaseAdmin
    .from('sessions')
    .insert({
      token,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
    });

  if (error) throw new Error('Failed to create session');
  return token;
}

export async function getUserFromSession(token: string | undefined) {
  if (!token) return null;

  // 1. Get session from sessions table (only session data)
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single();

  if (sessionError || !session) return null;

  // 2. Check if session expired
  if (new Date(session.expires_at) < new Date()) return null;

  // 3. Fetch the user from users table with all required fields
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, plan_tier, current_period_end')
    .eq('id', session.user_id)
    .single();

  if (userError || !user) return null;

  return user;
}

export async function deleteSession(token: string) {
  await supabaseAdmin.from('sessions').delete().eq('token', token);
}