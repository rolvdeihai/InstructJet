// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GAS_OTP_URL!;

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Build email content
    const subject = `InstructJet Support Request from ${name}`;
    const htmlBody = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
    `;
    const textBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Call GAS send_email action – no token needed
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_email',
        to: 'jethro.lim@resilio-partners.com',
        subject,
        htmlBody,
        textBody,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to send email.');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}