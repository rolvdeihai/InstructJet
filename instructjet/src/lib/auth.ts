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
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single();
  if (error || !session) return null;
  if (new Date(session.expires_at) < new Date()) return null;
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, plan_tier')
    .eq('id', session.user_id)
    .single();
  return user;
}

export async function deleteSession(token: string) {
  await supabaseAdmin.from('sessions').delete().eq('token', token);
}