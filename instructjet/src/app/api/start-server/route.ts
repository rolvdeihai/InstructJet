import { NextResponse } from 'next/server';

export async function POST() {
  const pat = process.env.GITHUB_PAT;
  if (!pat) {
    return NextResponse.json({ error: 'GitHub PAT not configured' }, { status: 500 });
  }

  const response = await fetch('https://api.github.com/repos/rolvdeihai/InstructJet/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${pat}`,
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({ event_type: 'start-server' }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('GitHub API error:', errorText);
    return NextResponse.json({ error: 'Failed to start server' }, { status: 500 });
  }

  return NextResponse.json({ status: 'started' });
}