// app/api/guides/[id]/suggestions/apply/route.ts
//
// Two steps, like reviewing a pull request:
//   { ids }                         → AI rewrites the guide, returns a preview (1000 tokens)
//   { ids, content, commit: true }  → saves the reviewed content and marks the suggestions applied
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getOwnedGuide } from '@/lib/guide-owner';
import { checkSufficientTokens, deductTokens } from '@/lib/token-manager';
import { generateOptimizedGuide } from '@/lib/team-insights';

export const maxDuration = 120;

const APPLY_COST = 1000;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id);
  if (owned.error) return owned.error;
  const { user, guide } = owned;

  const { ids, content, commit } = await req.json();
  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: 'Select at least one suggestion' }, { status: 400 });
  }

  const { data: suggestions } = await supabaseAdmin
    .from('guide_suggestions')
    .select('id, title, proposed_change, section')
    .eq('guide_id', id)
    .eq('status', 'pending')
    .in('id', ids);
  if (!suggestions?.length) {
    return NextResponse.json({ error: 'These suggestions are no longer pending' }, { status: 409 });
  }

  if (commit) {
    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('guides')
      .update({ content, updated_at: now })
      .eq('id', id);
    if (updateError) {
      console.error('Failed to save optimized guide:', updateError);
      return NextResponse.json({ error: 'Failed to save guide' }, { status: 500 });
    }
    await supabaseAdmin
      .from('guide_suggestions')
      .update({ status: 'applied', resolved_at: now })
      .in('id', suggestions.map(s => s.id));
    return NextResponse.json({ success: true, applied: suggestions.length });
  }

  const hasTokens = await checkSufficientTokens(user.id, APPLY_COST);
  if (!hasTokens) {
    return NextResponse.json(
      { error: 'Insufficient tokens. Please purchase more tokens or upgrade your plan.' },
      { status: 402 }
    );
  }

  try {
    const revised = await generateOptimizedGuide(guide, suggestions);
    await deductTokens(user.id, APPLY_COST, 'guide_optimize', {
      guide_id: id,
      suggestion_ids: suggestions.map(s => s.id),
    });
    return NextResponse.json({ content: revised.content, truncated: revised.truncated });
  } catch (err) {
    console.error('Guide optimization failed:', err);
    return NextResponse.json({ error: 'The AI could not optimize the guide. Please try again.' }, { status: 502 });
  }
}
