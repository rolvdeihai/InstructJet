// app/api/team-insights/refresh/route.ts
//
// Called when the owner opens the dashboard. Analyzes guides that collected
// enough new team questions/feedback, then returns a per-guide summary.
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { refreshInsightsForUser, MIN_NEW_SIGNALS } from '@/lib/team-insights';

export const maxDuration = 60;

export async function POST() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get('instructjet_session')?.value);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { analyzed, guides } = await refreshInsightsForUser(user.id);
  return NextResponse.json({ analyzed, guides, threshold: MIN_NEW_SIGNALS });
}
