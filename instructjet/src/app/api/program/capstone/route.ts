// app/api/program/capstone/route.ts
//
// Save / submit the capstone, then claim Claude Cowork.
// body: { action: 'save' | 'submit' | 'claim', certificates?, answers?, project? }
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getParticipantByUserId } from '@/lib/program/server';
import {
  CAPSTONE_EDITABLE,
  CAPSTONE_QUESTIONS,
  MIN_CERTIFICATES,
  isCapstoneUnlocked,
  type CapstoneCertificate,
  type CapstoneProject,
} from '@/lib/program/config';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

// Accept "coursera.org/…" by adding https://, drop anything that is not http(s)
const normUrl = (v: unknown) => {
  let u = str(v, 500);
  if (!u) return '';
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = `https://${u}`;
  return isUrl(u) ? u : '';
};

function sanitize(body: any) {
  const certificates: CapstoneCertificate[] = (Array.isArray(body.certificates) ? body.certificates : [])
    .slice(0, 20)
    .map((c: any) => ({ name: str(c?.name, 200), issuer: str(c?.issuer, 120), url: normUrl(c?.url) }))
    .filter((c: CapstoneCertificate) => c.name || c.url);
  const answers: Record<string, string> = {};
  for (const q of CAPSTONE_QUESTIONS) answers[q.id] = str(body.answers?.[q.id], 5000);
  const p = body.project || {};
  const project: CapstoneProject = {
    title: str(p.title, 200),
    problem: str(p.problem, 3000),
    solution: str(p.solution, 3000),
    outcome: str(p.outcome, 3000),
    link: normUrl(p.link),
  };
  return { certificates, answers, project };
}

function validateForSubmit(d: ReturnType<typeof sanitize>): string | null {
  const validCerts = d.certificates.filter((c) => c.name && isUrl(c.url));
  if (validCerts.length < MIN_CERTIFICATES) return `Add at least ${MIN_CERTIFICATES} certificate with a shareable link.`;
  for (const q of CAPSTONE_QUESTIONS) {
    if ((d.answers[q.id] || '').length < q.minChars) {
      return `Please answer in more detail: "${q.question.slice(0, 60)}…" (at least ${q.minChars} characters).`;
    }
  }
  if (!d.project.title || !d.project.problem || !d.project.solution || !d.project.outcome) return 'Complete every field of the capstone project.';
  return null;
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const participant = await getParticipantByUserId(user.id);
  if (!participant || participant.status !== 'active') {
    return NextResponse.json({ error: 'An active Business Support Program membership is required' }, { status: 403 });
  }
  if (!isCapstoneUnlocked(participant)) {
    return NextResponse.json({ error: 'The capstone opens after 3 months in the program' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action as 'save' | 'submit' | 'claim';
  const { data: existing } = await supabaseAdmin
    .from('program_capstones')
    .select('*')
    .eq('participant_id', participant.id)
    .maybeSingle();
  const now = new Date().toISOString();

  if (action === 'claim') {
    if (!existing || existing.status !== 'submitted') {
      return NextResponse.json({ error: 'Submit your capstone before claiming' }, { status: 400 });
    }
    await supabaseAdmin.from('program_capstones').update({ status: 'claimed', claimed_at: now, updated_at: now }).eq('id', existing.id);
    return NextResponse.json({ success: true, status: 'claimed' });
  }

  if (action !== 'save' && action !== 'submit') return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  if (existing && !CAPSTONE_EDITABLE.includes(existing.status)) {
    return NextResponse.json({ error: 'Your capstone is being reviewed and can no longer be edited' }, { status: 400 });
  }

  const data = sanitize(body);
  if (action === 'submit') {
    const problem = validateForSubmit(data);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  }

  // Editing after submitting keeps it submitted only while it still passes validation
  const status =
    action === 'submit' ? 'submitted' : existing?.status === 'submitted' && !validateForSubmit(data) ? 'submitted' : 'draft';
  const row = { ...data, status, updated_at: now, ...(action === 'submit' ? { submitted_at: now } : {}) };

  const { error } = existing
    ? await supabaseAdmin.from('program_capstones').update(row).eq('id', existing.id)
    : await supabaseAdmin.from('program_capstones').insert({ ...row, participant_id: participant.id, user_id: user.id });
  if (error) return NextResponse.json({ error: 'Failed to save capstone' }, { status: 500 });
  return NextResponse.json({ success: true, status });
}
