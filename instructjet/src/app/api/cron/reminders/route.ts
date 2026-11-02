// app/api/cron/reminders/route.ts
//
// Daily reminder run. Called by the scheduled GitHub Action
// (.github/workflows/daily-reminders.yml) with `Authorization: Bearer $CRON_SECRET`.
// Safe to call more than once a day: each reminder is sent at most once per day.
import { NextRequest, NextResponse } from 'next/server';
import { runDailyReminders } from '@/lib/reminders';

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runDailyReminders();
  console.log('[cron/reminders]', result);
  return NextResponse.json(result);
}
