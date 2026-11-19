// app/api/admin/requests/settings/route.ts
//
// GET  default approve / disapprove messages (saved overrides merged over built-ins)
// PUT  { messages: { helper: { approved, rejected }, funding: { approved, rejected } } }
//      saves them; a blank message falls back to the built-in default
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbError, requireAdmin } from '@/lib/admin';
import { getDecisionMessages } from '@/lib/program/server';
import { DEFAULT_DECISION_MESSAGE, mergeDecisionMessages } from '@/lib/program/requests';

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json({ messages: await getDecisionMessages(), builtIn: DEFAULT_DECISION_MESSAGE });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const merged = mergeDecisionMessages(body.messages);
  // Store only what differs from the built-ins, so improving the built-in text later still reaches untouched messages
  const toSave: Record<string, Record<string, string>> = {};
  for (const t of ['helper', 'funding'] as const) {
    for (const d of ['approved', 'rejected'] as const) {
      const v = merged[t][d].trim().slice(0, 5000);
      if (v !== DEFAULT_DECISION_MESSAGE[t][d]) (toSave[t] ||= {})[d] = v;
    }
  }

  const { error } = await supabaseAdmin
    .from('program_settings')
    .update({ request_messages: toSave, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) return dbError(error);
  return NextResponse.json({ success: true, messages: mergeDecisionMessages(toSave) });
}
