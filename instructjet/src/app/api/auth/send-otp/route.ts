import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const gasUrl = process.env.GAS_OTP_URL!;
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_otp',
        email,
        purpose: 'signup',
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({ error: data.message || 'Failed to send OTP' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}