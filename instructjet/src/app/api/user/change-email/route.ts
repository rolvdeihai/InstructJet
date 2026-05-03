import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getCurrentUser } from '@/lib/session';
import { comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail, otp, currentPassword } = await request.json();

    if (!newEmail || !otp || !currentPassword) {
      return NextResponse.json({ error: 'New email, OTP, and current password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if new email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', newEmail)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email already taken' }, { status: 409 });
    }

    // Verify current password
    const { data: userWithHash } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single();

    if (!userWithHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValidPassword = await comparePassword(currentPassword, userWithHash.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Verify OTP with Google Apps Script
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
        email: newEmail, // OTP was sent to the new email
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

    // Update email
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email: newEmail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Email change error:', updateError);
      return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email updated successfully' });
  } catch (error) {
    console.error('Change email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}