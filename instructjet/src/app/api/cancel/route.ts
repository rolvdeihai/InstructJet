import { NextRequest, NextResponse } from 'next/server';

const HF_API_URL = process.env.HF_API_BASE_URL;

export async function POST(req: NextRequest) {
  const { requestId } = await req.json();
  if (!requestId) {
    return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
  }
  try {
    const res = await fetch(`${HF_API_URL}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: requestId }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Cancel error:', err);
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
  }
}