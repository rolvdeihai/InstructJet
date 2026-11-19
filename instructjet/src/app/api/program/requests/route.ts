// app/api/program/requests/route.ts
//
// GET                                   the participant's own help requests
// POST  { type: 'helper'|'funding', details }   create one (admins are emailed)
// PATCH { id, action: 'withdraw' }      withdraw a pending request
import { after, NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getParticipantByUserId } from '@/lib/program/server';
import { notifyAdminsOfRequest } from '@/lib/program/request-emails';
import {
  COMMITMENTS,
  CURRENCIES,
  FUNDING_TYPES,
  UNPAID,
  WAGE_PERIODS,
  WORK_MODES,
  type RequestType,
} from '@/lib/program/requests';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneOf = (v: unknown, list: readonly string[]) => (typeof v === 'string' && list.includes(v) ? v : '');
const num = (v: unknown) => str(v, 30).replace(/[^\d.,]/g, '');
const url = (v: unknown) => {
  let u = str(v, 500);
  if (!u) return '';
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = `https://${u}`;
  return /^https?:\/\/[^\s]+$/i.test(u) ? u : '';
};
const MAX_PENDING = 5;

function sanitize(type: RequestType, d: any): { details: Record<string, string>; error?: string } {
  d = d && typeof d === 'object' ? d : {};
  if (type === 'helper') {
    const details = {
      kind: d.kind === 'worker' ? 'worker' : 'helper',
      role_title: str(d.role_title, 150),
      help_needed: str(d.help_needed, 3000),
      skills: str(d.skills, 1000),
      commitment: oneOf(d.commitment, COMMITMENTS),
      work_mode: oneOf(d.work_mode, WORK_MODES),
      location: str(d.location, 150),
      headcount: num(d.headcount).slice(0, 6),
      wage_min: num(d.wage_min),
      wage_max: num(d.wage_max),
      wage_currency: oneOf(d.wage_currency, CURRENCIES),
      wage_period: oneOf(d.wage_period, WAGE_PERIODS),
      start_date: /^\d{4}-\d{2}-\d{2}$/.test(d.start_date || '') ? d.start_date : '',
      notes: str(d.notes, 2000),
    };
    if (!details.role_title) return { details, error: 'Give the role a short title.' };
    if (details.help_needed.length < 20) return { details, error: 'Describe what you need help with (at least 20 characters).' };
    if (details.wage_period === UNPAID) {
      details.wage_min = details.wage_max = details.wage_currency = '';
    } else {
      if (!details.wage_period) return { details, error: 'Choose how the wage is paid (per hour, per month…), or Volunteer / unpaid.' };
      if (!details.wage_min && !details.wage_max) return { details, error: 'Enter the wage you can offer.' };
    }
    return { details };
  }
  const details = {
    funding_type: oneOf(d.funding_type, FUNDING_TYPES),
    amount: num(d.amount),
    currency: oneOf(d.currency, CURRENCIES),
    use_of_funds: str(d.use_of_funds, 3000),
    traction: str(d.traction, 2000),
    equity_offered: str(d.equity_offered, 200),
    raised_before: str(d.raised_before, 500),
    pitch_deck_url: url(d.pitch_deck_url),
    timeline: str(d.timeline, 200),
    notes: str(d.notes, 2000),
  };
  if (!details.funding_type) return { details, error: 'Choose the kind of funding you are looking for.' };
  if (!details.amount) return { details, error: 'Enter how much you want to raise.' };
  if (details.use_of_funds.length < 20) return { details, error: 'Explain how you will use the funds (at least 20 characters).' };
  return { details };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from('program_requests')
    .select('id, type, status, details, admin_message, reviewed_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Failed to load requests' }, { status: 500 });
  return NextResponse.json({ requests: data || [] });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const participant = await getParticipantByUserId(user.id);
  if (!participant || participant.status !== 'active') {
    return NextResponse.json({ error: 'An active Business Support Program membership is required' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const type = body.type as RequestType;
  if (type !== 'helper' && type !== 'funding') return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });

  const { details, error: invalid } = sanitize(type, body.details);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const { count } = await supabaseAdmin
    .from('program_requests')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending');
  if ((count || 0) >= MAX_PENDING) {
    return NextResponse.json({ error: `You already have ${MAX_PENDING} requests waiting for review. Please wait for a decision first.` }, { status: 429 });
  }

  const { data: row, error } = await supabaseAdmin
    .from('program_requests')
    .insert({ participant_id: participant.id, user_id: user.id, type, details })
    .select('id, type, status, details, admin_message, reviewed_at, created_at')
    .single();
  if (error || !row) return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });

  // Email admins after responding so the participant is not kept waiting
  after(async () => {
    try {
      await notifyAdminsOfRequest(row, {
        email: user.email,
        full_name: user.full_name ?? null,
        business_name: participant.profile?.business_name,
      });
    } catch (e) {
      console.error('[requests] admin notification failed:', e);
    }
  });

  return NextResponse.json({ success: true, request: row });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.id || body.action !== 'withdraw') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('program_requests')
    .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .select('id');
  if (error) return NextResponse.json({ error: 'Failed to withdraw' }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: 'Only pending requests can be withdrawn' }, { status: 400 });
  return NextResponse.json({ success: true });
}
