// app/api/guides/[id]/insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getOwnedGuide } from '@/lib/guide-owner';
import { analyzeGuideIfDue, MIN_NEW_SIGNALS } from '@/lib/team-insights';

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id);
  if (owned.error) return owned.error;
  const { guide } = owned;

  const analyzed = await analyzeGuideIfDue(guide);

  const [{ data: insight }, { data: suggestions }, { data: signals }] = await Promise.all([
    supabaseAdmin.from('guide_team_insights').select('profile, signals_analyzed, updated_at').eq('guide_id', id).maybeSingle(),
    supabaseAdmin
      .from('guide_suggestions')
      .select('id, title, rationale, proposed_change, section, priority, evidence_count, status, created_at, resolved_at')
      .eq('guide_id', id)
      .order('created_at', { ascending: false })
      .limit(100),
    supabaseAdmin.from('guide_team_signals').select('kind, analyzed_at').eq('guide_id', id),
  ]);

  const stats = {
    questions: signals?.filter(s => s.kind === 'question').length || 0,
    feedback: signals?.filter(s => s.kind === 'feedback').length || 0,
    submissions: signals?.filter(s => s.kind === 'submission').length || 0,
    newSignals: signals?.filter(s => !s.analyzed_at).length || 0,
  };

  return NextResponse.json({
    guide: { id: guide.id, slug: guide.slug, title: guide.title, content: guide.content, team_profile: guide.team_profile },
    insight,
    suggestions: suggestions || [],
    stats,
    threshold: MIN_NEW_SIGNALS,
    analyzed,
  });
}
