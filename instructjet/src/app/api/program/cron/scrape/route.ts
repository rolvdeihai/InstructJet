// app/api/program/cron/scrape/route.ts
//
// Weekly catalog refresh (events, investor events, courses, communities).
// Called by the Google Apps Script weekly trigger with
// `Authorization: Bearer $PROGRAM_CRON_SECRET`.
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedCron } from '@/lib/program/server';
import { runWeeklyScrape } from '@/lib/program/scrape';
import { CATALOG_TYPE_VALUES, type CatalogType } from '@/lib/program/config';

export const maxDuration = 300;

async function handle(req: NextRequest) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    // ?type=course scrapes one catalog type (keeps each call under Apps Script's 60s fetch limit)
    const type = req.nextUrl.searchParams.get('type');
    if (type && !CATALOG_TYPE_VALUES.includes(type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    const result = await runWeeklyScrape((type as CatalogType) || undefined);
    console.log('[program/cron/scrape]', result);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[program/cron/scrape]', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
