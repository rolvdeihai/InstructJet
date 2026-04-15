// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user
    const { data: user, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName || null,
        plan_tier: 'free',
      })
      .select('id, email, full_name, plan_tier')
      .single();

    if (insertError) {
      console.error('Registration error:', insertError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Create initial token balance (use try/catch to avoid failing registration)
    try {
      await supabaseAdmin
        .from('token_balances')
        .insert({
          user_id: user.id,
          subscription_tokens: 0,
          package_tokens: 0,
        });
    } catch (tokenError) {
      console.error('Failed to create token balance:', tokenError);
      // We don't fail registration because of token balance; we can create later.
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Unexpected registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}