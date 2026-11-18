// app/api/program/me/route.ts
//
// The signed-in participant's program state (GET) and business profile edits (PUT).
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getParticipantByUserId, getProgramSettings } from '@/lib/program/server';
import {
  CATALOG_TYPE_VALUES,
  capstoneUnlockDate,
  isCapstoneUnlocked,
  isProfileComplete,
  type ProgramProfile,
} from '@/lib/program/config';

const TEXT_LIMITS: Partial<Record<keyof ProgramProfile, number>> = {
  business_name: 120,
  business_category: 40,
  sub_industry: 120,
  description: 2000,
  stage: 40,
  years_operating: 20,
  team_size: 20,
  monthly_revenue: 40,
  target_customers: 1000,
  growth_goals: 2000,
  growth_metric: 300,
  challenges: 2000,
  skills_to_learn: 1000,
  funding: 20,
  event_format: 20,
  city: 80,
  country: 80,
  website: 300,
  whatsapp: 40,
};

function sanitizeProfile(input: any): ProgramProfile {
  const out: ProgramProfile = {};
  for (const [key, max] of Object.entries(TEXT_LIMITS) as [keyof ProgramProfile, number][]) {
    const v = input?.[key];
    if (typeof v === 'string') (out as any)[key] = v.trim().slice(0, max);
  }
  if (Array.isArray(input?.opportunities)) {
    out.opportunities = input.opportunities.filter((o: unknown) => typeof o === 'string' && CATALOG_TYPE_VALUES.includes(o));
  }
  out.language = input?.language === 'id' ? 'id' : 'en';
  return out;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const participant = await getParticipantByUserId(user.id);
  if (!participant) return NextResponse.json({ participant: null });

  const [{ data: capstone }, settings] = await Promise.all([
    supabaseAdmin.from('program_capstones').select('*').eq('participant_id', participant.id).maybeSingle(),
    getProgramSettings(),
  ]);

  return NextResponse.json({
    participant: {
      id: participant.id,
      status: participant.status,
      subscribed_at: participant.subscribed_at,
      email_opt_out: participant.email_opt_out,
      profile_completed_at: participant.profile_completed_at,
    },
    profile: participant.profile || {},
    profileComplete: isProfileComplete(participant.profile),
    capstone: capstone || null,
    capstoneUnlocked: isCapstoneUnlocked(participant),
    capstoneUnlockAt: capstoneUnlockDate(participant.subscribed_at).toISOString(),
    discordUrl: settings.discord_url,
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const participant = await getParticipantByUserId(user.id);
  if (!participant) return NextResponse.json({ error: 'You are not in the Business Support Program' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  let profileComplete: boolean | undefined;

  if (body.profile) {
    const profile = sanitizeProfile(body.profile);
    update.profile = profile;
    profileComplete = isProfileComplete(profile);
    if (profileComplete && !participant.profile_completed_at) update.profile_completed_at = new Date().toISOString();
  }
  if (typeof body.email_opt_out === 'boolean') update.email_opt_out = body.email_opt_out;

  const { error } = await supabaseAdmin.from('program_participants').update(update).eq('id', participant.id);
  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  return NextResponse.json({ success: true, profileComplete });
}
