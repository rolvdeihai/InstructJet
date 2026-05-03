import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail } = await request.json();
    if (!newEmail) {
      return NextResponse.json({ error: 'New email is required' }, { status: 400 });
    }

    const gasUrl = process.env.GAS_OTP_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_otp',
        email: newEmail,
        purpose: 'change_email',
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json(
        { error: data.message || 'Failed to send verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Verification code sent to new email' });
  } catch (error) {
    console.error('Send email OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}