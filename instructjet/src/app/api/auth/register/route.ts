import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hashPassword } from '@/lib/auth';
import { jwtVerify } from 'jose';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, verificationToken } = await request.json();

    // Validate verification token
    if (!verificationToken) {
      return NextResponse.json({ error: 'Verification required' }, { status: 400 });
    }

    let verifiedEmail: string;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(verificationToken, secret);
      verifiedEmail = payload.email as string;
      if (!payload.verified) throw new Error();
    } catch {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    // Email from token must match the one provided (optional consistency check)
    if (verifiedEmail !== email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 400 });
    }

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

    // Hash password and insert user
    const passwordHash = await hashPassword(password);
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

    // Create token balance record
    try {
      await supabaseAdmin
        .from('token_balances')
        .insert({ user_id: user.id, subscription_tokens: 0, package_tokens: 0 });
    } catch (tokenError) {
      console.error('Failed to create token balance:', tokenError);
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Unexpected registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}