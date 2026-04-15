// lib/session.ts (replace with this)
import { cookies } from 'next/headers';
import { getUserFromSession } from './auth';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('instructjet_session')?.value;
  
  if (!token) return null;
  
  return await getUserFromSession(token);
}