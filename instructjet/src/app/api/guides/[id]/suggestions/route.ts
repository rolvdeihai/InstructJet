// app/api/guides/[id]/suggestions/route.ts
//
// Dismiss suggestions, or restore dismissed ones to pending.
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getOwnedGuide } from '@/lib/guide-owner';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await getOwnedGuide(id, 'id, user_id');
  if (owned.error) return owned.error;

  const { ids, status } = await req.json();
  if (!Array.isArray(ids) || !ids.length || !['dismissed', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('guide_suggestions')
    .update({ status, resolved_at: status === 'dismissed' ? new Date().toISOString() : null })
    .eq('guide_id', id)
    .neq('status', 'applied')
    .in('id', ids);
  if (error) {
    console.error('Failed to update suggestions:', error);
    return NextResponse.json({ error: 'Failed to update suggestions' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
