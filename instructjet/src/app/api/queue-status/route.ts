import { NextResponse } from 'next/server';

const HF_API_URL = process.env.HF_API_BASE_URL;

export async function GET() {
  try {
    const res = await fetch(`${HF_API_URL}/queue-status`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ active: 0, queued: 0 });
  }
}