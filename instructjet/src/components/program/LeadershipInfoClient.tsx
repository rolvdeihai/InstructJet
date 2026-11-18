// src/components/program/LeadershipInfoClient.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  BUSINESS_CATEGORIES,
  BUSINESS_STAGES,
  CAPSTONE_EDITABLE,
  CAPSTONE_QUESTIONS,
  CAPSTONE_STATUS_LABEL,
  CATALOG_TYPES,
  EVENT_FORMATS,
  FUNDING_OPTIONS,
  MIN_CERTIFICATES,
  REVENUE_RANGES,
  TEAM_SIZES,
  type CapstoneCertificate,
  type CapstoneProject,
  type ProgramProfile,
} from '@/lib/program/config';

interface Capstone {
  id: string;
  status: string;
  certificates: CapstoneCertificate[];
  answers: Record<string, string>;
  project: CapstoneProject;
  submitted_at: string | null;
  claimed_at: string | null;
  review_notes: string | null;
}

interface ProgramState {
  participant: { id: string; status: string; subscribed_at: string; email_opt_out: boolean } | null;
  profile: ProgramProfile;
  profileComplete: boolean;
  capstone: Capstone | null;
  capstoneUnlocked: boolean;
  capstoneUnlockAt: string;
  discordUrl: string | null;
}

type Tab = 'profile' | 'capstone' | 'community';

const input =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';
const label = 'block text-sm font-medium text-gray-700 mb-1';
const card = 'rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm';

function Field({ title, hint, children, required }: { title: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className={label}>
        {title}
        {required && <span className="text-primary-600"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Banner({ tone, children }: { tone: 'info' | 'success' | 'warn' | 'error'; children: React.ReactNode }) {
  const tones = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warn: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>{children}</div>;
}

/* ─── Business profile ─────────────────────────────────────────── */
function ProfileForm({ initial, onSaved }: { initial: ProgramProfile; onSaved: (complete: boolean, profile: ProgramProfile) => void }) {
  const [p, setP] = useState<ProgramProfile>({ opportunities: CATALOG_TYPES.filter((t) => t.value !== 'other').map((t) => t.value), event_format: 'both', language: 'en', ...initial });
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof ProgramProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setP({ ...p, [k]: e.target.value });
  const toggleOpp = (v: string) => {
    const cur = p.opportunities || [];
    setP({ ...p, opportunities: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/program/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: p }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setStatus({
        tone: 'success',
        msg: data.profileComplete
          ? 'Saved. Your weekly picks will be matched to this profile.'
          : 'Saved. Fill in the fields marked * so we can match opportunities to you.',
      });
      onSaved(!!data.profileComplete, p);
    } catch (err) {
      setStatus({ tone: 'error', msg: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <section className={card}>
        <h3 className="text-lg font-semibold text-gray-900">Your business</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field title="Business name" required>
            <input className={input} value={p.business_name || ''} onChange={set('business_name')} maxLength={120} />
          </Field>
          <Field title="Business category" required>
            <select className={input} value={p.business_category || ''} onChange={set('business_category')}>
              <option value="">Select…</option>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field title="Niche / sub-industry" hint="e.g. specialty coffee, B2B SaaS for clinics, batik fashion">
            <input className={input} value={p.sub_industry || ''} onChange={set('sub_industry')} maxLength={120} />
          </Field>
          <Field title="Website or social media">
            <input className={input} value={p.website || ''} onChange={set('website')} placeholder="https://" maxLength={300} />
          </Field>
          <div className="sm:col-span-2">
            <Field title="What does your business do?" required hint="Products/services, how you sell, what makes you different.">
              <textarea className={input} rows={4} value={p.description || ''} onChange={set('description')} maxLength={2000} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field title="Who are your customers?">
              <textarea className={input} rows={2} value={p.target_customers || ''} onChange={set('target_customers')} maxLength={1000} />
            </Field>
          </div>
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-semibold text-gray-900">Size & stage</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field title="Stage" required>
            <select className={input} value={p.stage || ''} onChange={set('stage')}>
              <option value="">Select…</option>
              {BUSINESS_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field title="Years operating">
            <input className={input} value={p.years_operating || ''} onChange={set('years_operating')} maxLength={20} />
          </Field>
          <Field title="Team size" required>
            <select className={input} value={p.team_size || ''} onChange={set('team_size')}>
              <option value="">Select…</option>
              {TEAM_SIZES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field title="Monthly revenue">
            <select className={input} value={p.monthly_revenue || ''} onChange={set('monthly_revenue')}>
              <option value="">Select…</option>
              {REVENUE_RANGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
        <div className="mt-4 grid gap-4">
          <Field title="Growth goals for the next 6–12 months" required>
            <textarea className={input} rows={3} value={p.growth_goals || ''} onChange={set('growth_goals')} maxLength={2000} />
          </Field>
          <Field title="The one number you want to grow" hint="e.g. monthly revenue from Rp20jt to Rp50jt, 100 repeat customers, 3 new hires">
            <input className={input} value={p.growth_metric || ''} onChange={set('growth_metric')} maxLength={300} />
          </Field>
          <Field title="Biggest challenges right now" required hint="Team, hiring, cash flow, marketing, operations, delegation…">
            <textarea className={input} rows={3} value={p.challenges || ''} onChange={set('challenges')} maxLength={2000} />
          </Field>
          <Field title="Leadership or business skills you want to learn">
            <textarea className={input} rows={2} value={p.skills_to_learn || ''} onChange={set('skills_to_learn')} maxLength={1000} />
          </Field>
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-semibold text-gray-900">What should we send you?</h3>
        <p className="mt-1 text-sm text-gray-500">Every week we pick the most relevant opportunities for you from our catalog.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATALOG_TYPES.filter((t) => t.value !== 'other').map((t) => {
            const on = p.opportunities?.includes(t.value);
            return (
              <button
                type="button"
                key={t.value}
                onClick={() => toggleOpp(t.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${on ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field title="Funding">
            <select className={input} value={p.funding || ''} onChange={set('funding')}>
              <option value="">Select…</option>
              {FUNDING_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
          <Field title="Event format">
            <select className={input} value={p.event_format || 'both'} onChange={set('event_format')}>
              {EVENT_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
          <Field title="City">
            <input className={input} value={p.city || ''} onChange={set('city')} maxLength={80} />
          </Field>
          <Field title="Country" required>
            <input className={input} value={p.country || ''} onChange={set('country')} maxLength={80} />
          </Field>
          <Field title="WhatsApp (optional)">
            <input className={input} value={p.whatsapp || ''} onChange={set('whatsapp')} maxLength={40} />
          </Field>
          <Field title="Email language">
            <select className={input} value={p.language || 'en'} onChange={set('language')}>
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </Field>
        </div>
      </section>

      {status && <Banner tone={status.tone}>{status.msg}</Banner>}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60 sm:w-auto"
      >
        {saving ? 'Saving…' : 'Save business profile'}
      </button>
    </form>
  );
}

/* ─── Capstone ────────────────────────────────────────────────── */
function CapstoneSection({ state, onChanged }: { state: ProgramState; onChanged: () => void }) {
  const c = state.capstone;
  const [certs, setCerts] = useState<CapstoneCertificate[]>(
    c?.certificates?.length ? c.certificates : [{ name: '', issuer: '', url: '' }]
  );
  const [answers, setAnswers] = useState<Record<string, string>>(c?.answers || {});
  const [project, setProject] = useState<CapstoneProject>(c?.project || {});
  const [busy, setBusy] = useState<'save' | 'submit' | 'claim' | null>(null);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  if (!state.capstoneUnlocked) {
    const unlock = new Date(state.capstoneUnlockAt);
    const days = Math.max(0, Math.ceil((unlock.getTime() - Date.now()) / 86_400_000));
    return (
      <div className={card}>
        <h3 className="text-lg font-semibold text-gray-900">Capstone project · locked</h3>
        <p className="mt-2 text-gray-600">
          Your capstone opens after 3 months in the program, on{' '}
          <strong>{unlock.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> ({days} day
          {days === 1 ? '' : 's'} to go).
        </p>
        <p className="mt-3 text-sm text-gray-600">To prepare, keep:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>the shareable links of every certificate you earn from the courses we send you,</li>
          <li>notes on leadership changes you make and the results (numbers help),</li>
          <li>one real business problem you want to solve as your capstone project.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">Completing the capstone lets you claim <strong>Claude Cowork</strong>.</p>
      </div>
    );
  }

  const status = c?.status || 'draft';
  const editable = CAPSTONE_EDITABLE.includes(status);

  const send = async (action: 'save' | 'submit' | 'claim') => {
    setBusy(action);
    setMsg(null);
    try {
      const res = await fetch('/api/program/capstone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, certificates: certs, answers, project }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setMsg({
        tone: 'success',
        text:
          action === 'claim'
            ? 'Claim sent. We will review your capstone and send your Claude Cowork access by email.'
            : action === 'submit'
              ? 'Capstone submitted. You can now claim Claude Cowork.'
              : 'Draft saved.',
      });
      onChanged();
    } catch (e) {
      setMsg({ tone: 'error', text: (e as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const setCert = (i: number, k: keyof CapstoneCertificate, v: string) => setCerts(certs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Capstone project</h3>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{CAPSTONE_STATUS_LABEL[status]}</span>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Show what you learned: share your certificates, answer the questions, and describe one real project you completed. Submit it, then claim Claude Cowork.
        </p>
        {status === 'rejected' && c?.review_notes && (
          <div className="mt-4">
            <Banner tone="warn">
              <strong>Feedback from the reviewer:</strong> {c.review_notes}
            </Banner>
          </div>
        )}
        {status === 'claimed' && <div className="mt-4"><Banner tone="info">Your claim is being reviewed. We will email you.</Banner></div>}
        {status === 'approved' && <div className="mt-4"><Banner tone="success">Approved! Your Claude Cowork access is on its way.</Banner></div>}
        {status === 'fulfilled' && <div className="mt-4"><Banner tone="success">Claude Cowork has been granted. Congratulations on finishing the program!</Banner></div>}
      </div>

      <fieldset disabled={!editable} className="space-y-6 disabled:opacity-80">
        <section className={card}>
          <h4 className="font-semibold text-gray-900">1. Your certificates</h4>
          <p className="mt-1 text-sm text-gray-500">
            The shareable links (Coursera, Google, Scrum.org, HubSpot, LinkedIn…) of certificates you earned during the program. At least {MIN_CERTIFICATES}.
          </p>
          <div className="mt-4 space-y-3">
            {certs.map((cert, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-[1fr_0.7fr_1.3fr_auto]">
                <input className={input} placeholder="Certificate name" value={cert.name} onChange={(e) => setCert(i, 'name', e.target.value)} />
                <input className={input} placeholder="Issuer" value={cert.issuer} onChange={(e) => setCert(i, 'issuer', e.target.value)} />
                <input className={input} placeholder="https://… shareable link" value={cert.url} onChange={(e) => setCert(i, 'url', e.target.value)} />
                <button
                  type="button"
                  onClick={() => setCerts(certs.length > 1 ? certs.filter((_, j) => j !== i) : [{ name: '', issuer: '', url: '' }])}
                  className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setCerts([...certs, { name: '', issuer: '', url: '' }])} className="mt-3 text-sm font-medium text-primary-600 hover:underline">
            + Add certificate
          </button>
        </section>

        <section className={card}>
          <h4 className="font-semibold text-gray-900">2. Check your understanding</h4>
          <div className="mt-4 space-y-5">
            {CAPSTONE_QUESTIONS.map((q, i) => {
              const len = (answers[q.id] || '').trim().length;
              return (
                <div key={q.id}>
                  <label className={label}>
                    {i + 1}. {q.question}
                  </label>
                  <textarea className={input} rows={4} value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} maxLength={5000} />
                  <p className={`mt-1 text-xs ${len >= q.minChars ? 'text-green-600' : 'text-gray-400'}`}>
                    {len} / {q.minChars} characters minimum
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className={card}>
          <h4 className="font-semibold text-gray-900">3. Capstone project</h4>
          <p className="mt-1 text-sm text-gray-500">One real improvement you led in your business during the program.</p>
          <div className="mt-4 grid gap-4">
            <Field title="Project title" required>
              <input className={input} value={project.title || ''} onChange={(e) => setProject({ ...project, title: e.target.value })} maxLength={200} />
            </Field>
            <Field title="The problem" required>
              <textarea className={input} rows={3} value={project.problem || ''} onChange={(e) => setProject({ ...project, problem: e.target.value })} maxLength={3000} />
            </Field>
            <Field title="What you did (and how you led your team through it)" required>
              <textarea className={input} rows={4} value={project.solution || ''} onChange={(e) => setProject({ ...project, solution: e.target.value })} maxLength={3000} />
            </Field>
            <Field title="Outcome" required hint="Results, numbers, what you would do differently.">
              <textarea className={input} rows={3} value={project.outcome || ''} onChange={(e) => setProject({ ...project, outcome: e.target.value })} maxLength={3000} />
            </Field>
            <Field title="Link to evidence (optional)" hint="Slides, document, photos, SOP, website…">
              <input className={input} value={project.link || ''} onChange={(e) => setProject({ ...project, link: e.target.value })} placeholder="https://" maxLength={500} />
            </Field>
          </div>
        </section>
      </fieldset>

      {msg && <Banner tone={msg.tone}>{msg.text}</Banner>}

      <div className="flex flex-col gap-3 sm:flex-row">
        {editable && (
          <>
            <button
              onClick={() => send('save')}
              disabled={!!busy}
              className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
            >
              {busy === 'save' ? 'Saving…' : 'Save draft'}
            </button>
            <button
              onClick={() => send('submit')}
              disabled={!!busy}
              className="rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {busy === 'submit' ? 'Submitting…' : status === 'submitted' ? 'Update submission' : 'Submit capstone'}
            </button>
          </>
        )}
        {status === 'submitted' && (
          <button
            onClick={() => send('claim')}
            disabled={!!busy}
            className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {busy === 'claim' ? 'Sending claim…' : 'Claim Claude Cowork'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Community & emails ─────────────────────────────────────── */
function CommunitySection({ state, onChanged }: { state: ProgramState; onChanged: () => void }) {
  const [saving, setSaving] = useState(false);
  const optOut = state.participant?.email_opt_out;

  const toggle = async () => {
    setSaving(true);
    await fetch('/api/program/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_opt_out: !optOut }),
    });
    setSaving(false);
    onChanged();
  };

  return (
    <div className="space-y-6">
      <div className={`${card} bg-indigo-50 border-indigo-100`}>
        <h3 className="text-lg font-semibold text-indigo-900">InstructJet Discord community</h3>
        <p className="mt-2 text-sm text-indigo-900/80">
          Mentoring, peer support, booking 1:1 consultations, getting your basic website built, and meeting other business owners all happen on Discord.
        </p>
        {state.discordUrl ? (
          <a
            href={state.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#5865F2] px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Join the Discord
          </a>
        ) : (
          <p className="mt-4 text-sm text-indigo-900/70">The invite link will appear here and in your welcome emails.</p>
        )}
      </div>

      <div className={card}>
        <h3 className="text-lg font-semibold text-gray-900">Program emails</h3>
        <p className="mt-2 text-sm text-gray-600">
          Daily leadership lessons and a weekly selection of events, investor opportunities, free certified courses and communities matched to your business profile.
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-700">{optOut ? 'Emails are turned off' : 'Emails are on'}</span>
          <button
            onClick={toggle}
            disabled={saving}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${optOut ? 'bg-primary-600 text-white' : 'border border-gray-300 bg-white text-gray-700'} disabled:opacity-60`}
          >
            {optOut ? 'Turn on' : 'Turn off'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function LeadershipInfoClient() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [tab, setTab] = useState<Tab>('profile');

  const load = useCallback(async () => {
    const res = await fetch('/api/program/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as ProgramState;
    setState(data);
    return data;
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = '/login?next=' + encodeURIComponent('/leadership-info');
      return;
    }
    let cancelled = false;
    const welcome = new URLSearchParams(window.location.search).get('welcome') === '1';
    (async () => {
      let data = await load();
      // Right after checkout the Paddle webhook may still be on its way
      if (welcome && !data?.participant) {
        setWaitingForPayment(true);
        for (let i = 0; i < 30 && !cancelled && !data?.participant; i++) {
          await new Promise((r) => setTimeout(r, 3000));
          data = await load();
        }
        if (!cancelled) setWaitingForPayment(false);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, load]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 pt-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-600" />
        <p className="text-gray-600">{waitingForPayment ? 'Confirming your payment… this can take up to a minute.' : 'Loading…'}</p>
      </main>
    );
  }

  if (!state?.participant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-20">
        <div className={`${card} max-w-lg text-center`}>
          <h1 className="text-2xl font-bold text-gray-900">You are not in the Business Support Program yet</h1>
          <p className="mt-3 text-gray-600">
            If you just paid, give it a minute and refresh this page. If it still does not show up, contact us and we will sort it out.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/leadership" className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700">
              See the program
            </Link>
            <Link href="/contact" className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
              Contact us
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const inactive = state.participant.status !== 'active';
  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: 'profile', label: 'Business profile', badge: state.profileComplete ? undefined : 'To do' },
    { id: 'capstone', label: 'Capstone', badge: state.capstoneUnlocked && (!state.capstone || state.capstone.status === 'draft') ? 'Open' : undefined },
    { id: 'community', label: 'Community & emails' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-slate-950 px-4 pb-12 pt-28 text-white sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Business Support Program</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Leadership Info</h1>
          <p className="mt-3 text-slate-300">
            Member since{' '}
            {new Date(state.participant.subscribed_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}. Keep your business
            profile up to date: it decides which events, investors, courses and communities we send you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-6 space-y-4">
          {inactive && <Banner tone="warn">Your program membership is {state.participant.status}. Emails are paused and the capstone is read-only.</Banner>}
          {!state.profileComplete && !inactive && (
            <Banner tone="info">Start here: tell us about your business so we can match opportunities to you.</Banner>
          )}
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {t.label}
              {t.badge && <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[10px] uppercase text-white">{t.badge}</span>}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'profile' && (
            <ProfileForm initial={state.profile} onSaved={(complete, profile) => setState({ ...state, profile, profileComplete: complete })} />
          )}
          {tab === 'capstone' && <CapstoneSection key={state.capstone?.status || 'new'} state={state} onChanged={load} />}
          {tab === 'community' && <CommunitySection state={state} onChanged={load} />}
        </div>
      </div>
    </main>
  );
}
