// app/api/guides/[id]/feedback/route.ts
//
// Free-form feedback from a team member about a guide (no AI call, no tokens).
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { recordTeamSignal } from '@/lib/team-insights';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content, sessionId } = await req.json();
  const feedback = typeof content === 'string' ? content.trim() : '';
  if (feedback.length < 3) {
    return NextResponse.json({ error: 'Feedback is too short' }, { status: 400 });
  }

  const { data: guide } = await supabaseAdmin.from('guides').select('id').eq('id', id).single();
  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  await recordTeamSignal({
    guideId: id,
    sessionId: typeof sessionId === 'string' ? sessionId : null,
    kind: 'feedback',
    content: feedback,
  });
  return NextResponse.json({ success: true });
}
