import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, verification code, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // 1. Verify OTP with Google Apps Script
    const gasUrl = process.env.GAS_OTP_URL;
    if (!gasUrl) {
      console.error('GAS_OTP_URL not configured');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const verifyRes = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_otp',
        email,
        otp,
      }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json(
        { error: verifyData.message || 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // 2. Find user in Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal that email doesn't exist for security
      return NextResponse.json({ error: 'Invalid email or user not found' }, { status: 404 });
    }

    // 3. Hash new password and update
    const passwordHash = await hashPassword(newPassword);
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Password reset error:', updateError);
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}