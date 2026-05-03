import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const gasUrl = process.env.GAS_OTP_URL;
    if (!gasUrl) {
      console.error('GAS_OTP_URL not configured');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_otp',
        email,
        purpose: 'reset_password', // custom purpose for email subject
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json(
        { error: data.message || 'Failed to send verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}