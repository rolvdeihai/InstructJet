// app/api/program/cron/daily/route.ts
//
// Daily Business Support Program emails. Called by the Google Apps Script
// time trigger (google-apps-script/program-triggers.gs) with
// `Authorization: Bearer $PROGRAM_CRON_SECRET`. Processes one batch per call;
// the script keeps calling while `remaining > 0`.
import { NextRequest, NextResponse } from 'next/server';
import { expireManualPremium, isAuthorizedCron } from '@/lib/program/server';
import { runDailyProgramEmails } from '@/lib/program/emails';

export const maxDuration = 300;

async function handle(req: NextRequest) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit')) || 15, 1), 50);
  try {
    // Cheap and idempotent, so it simply runs with every batch
    const expiredPremium = await expireManualPremium();
    const result = { ...(await runDailyProgramEmails(limit)), expiredPremium };
    console.log('[program/cron/daily]', result);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[program/cron/daily]', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
