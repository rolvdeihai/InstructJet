// src/components/LeadershipLanding.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CpuChipIcon,
  CheckBadgeIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BellAlertIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

/* ─── Programme constants (edit here) ───────────────────────────── */
const PRICE = 150_000;
const PROGRAM_DAYS = 90;
const COHORT_SEATS = 20; // real capacity: every programme is tailored by hand

const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID');

const COMPANIES = [
  { name: 'Resilio Partners', role: 'Software Engineer & Digital Marketer', logo: '/companies/resilio.png', dark: false },
  { name: 'Caprae Capital Partners', role: 'Machine Learning Engineer', logo: '/companies/caprae.png', dark: true },
  { name: 'SaaSquatch Leads', role: 'Software Engineer', logo: '/companies/saasquatch.png', dark: false },
  { name: 'Alfagift · Global Loyalty Indonesia', role: 'Data Science', logo: '/companies/alfagift.png', dark: false },
];

const PAINS = [
  { icon: ArrowPathIcon, title: 'You repeat the same instruction three times', body: 'and the work still comes back different from what you pictured.' },
  { icon: BellAlertIcon, title: 'You chase updates all day', body: 'because nobody knows where a task stands unless you ask.' },
  { icon: VideoCameraIcon, title: 'Meetings run long and decide nothing', body: 'and everyone leaves with a different idea of the next step.' },
  { icon: DocumentTextIcon, title: 'SOPs exist, but nobody follows them', body: 'because they are long, outdated, or impossible to find.' },
  { icon: CpuChipIcon, title: 'Everyone talks about AI', body: 'but your team still does by hand what a bot could finish in minutes.' },
  { icon: HeartIcon, title: 'Hard conversations get postponed', body: 'feedback, conflicts, low performers, until they become crises.' },
];

const PILLARS = [
  {
    icon: SparklesIcon,
    title: 'A programme tailored to your team',
    feature: 'We map your real use case (team size, industry, bottlenecks) before week one.',
    outcome: 'You learn what your situation needs, not a generic leadership syllabus.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: '1:1 consultation',
    feature: 'Private sessions to work on your actual problems: people, process, priorities.',
    outcome: 'Every hard decision has a sparring partner, so you stop guessing.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Institution-certified courses',
    feature: 'Curated courses from Google, Coursera and other recognised institutions, matched to your gaps.',
    outcome: 'Credentials you can show your boss, your team and your LinkedIn.',
  },
  {
    icon: HeartIcon,
    title: 'Daily communication & psychology lessons',
    feature: 'Short daily lessons on influence, feedback, motivation and conflict.',
    outcome: 'Ten minutes a day compounds into a leader people trust and follow.',
  },
  {
    icon: DocumentTextIcon,
    title: 'SOP redesign service',
    feature: 'We rewrite your messy procedures into clear, checkable step-by-step guides.',
    outcome: 'Your team does it right the first time, without you in the loop.',
  },
  {
    icon: CpuChipIcon,
    title: 'Leading AI employees',
    feature: 'Set up AI agents and automations, and learn to delegate to them like a team member.',
    outcome: 'Your team handles more work without hiring another person.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Management & AI tool mastery',
    feature: 'Hands-on training on the exact tools in your stack, configured for your workflow.',
    outcome: 'Everyone knows where work lives, who owns it and when it is due.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'Programme certification',
    feature: 'Complete the 3 months and the capstone to earn your Leadership Support certificate.',
    outcome: 'Proof that you did not just attend; you implemented.',
  },
];

const TOOLS = [
  { name: 'Claude + Cowork', logo: '/tools/claude.png', use: 'An AI employee that researches, drafts and analyses in minutes, not days' },
  { name: 'InstructJet Premium', logo: '/instructjet_logo.png', crop: true, use: 'Turn instructions into guides and auto-check your team’s work' },
  { name: 'Make.com', logo: '/tools/make.jpg', use: 'Automate the repetitive work between your apps, 24/7' },
  { name: 'Trello', logo: '/tools/trello.png', use: 'Every task with an owner, a status and a deadline' },
  { name: 'Asana', logo: '/tools/asana.png', use: 'Timelines, workloads and dependencies at a glance' },
  { name: 'Google Meet', logo: '/tools/meet.png', use: 'Recordings, notes and meetings that end with decisions' },
  { name: 'Slack / Discord', logo: '/tools/slack.png', use: 'A communication environment with channels, rules and rituals' },
  { name: 'Notion', logo: '/tools/notion.png', use: 'A single source of truth for SOPs, docs and onboarding' },
];

const ROADMAP = [
  {
    month: 'Month 1',
    title: 'Foundation',
    subtitle: 'Know yourself, know your team',
    weeks: [
      'Leadership diagnostic & use-case mapping',
      '1:1 kickoff consultation & personal learning plan',
      'Communication fundamentals: clear instructions, active listening',
      'Workspace setup: Slack/Discord, Trello or Asana, Notion',
    ],
  },
  {
    month: 'Month 2',
    title: 'Systems',
    subtitle: 'Make the work run without you',
    weeks: [
      'SOP redesign of your 3 most critical processes',
      'Meeting system: agendas, Google Meet workflows, decision logs',
      'Feedback, delegation & accountability frameworks',
      'Certified course milestone #1',
    ],
  },
  {
    month: 'Month 3',
    title: 'Scale with AI',
    subtitle: 'Lead humans and AI employees',
    weeks: [
      'Deploy your first AI employees with Claude & Make.com',
      'Automated quality checks with InstructJet',
      'Psychology of motivation, conflict & difficult conversations',
      'Capstone review, certification & 90-day forward plan',
    ],
  },
];

const BEFORE_AFTER = [
  ['Instructions live in your head', 'Instructions live in clear SOPs anyone can follow'],
  ['You chase status updates', 'Status is visible on one board'],
  ['Meetings to "sync up"', 'Short meetings that end with owners & deadlines'],
  ['Repetitive work done by hand', 'AI employees & automations handle the routine'],
  ['Feedback avoided or explosive', 'Feedback given calmly, regularly, with structure'],
  ['You are the bottleneck', 'You are the multiplier'],
];

const FIT = {
  yes: [
    'New or recently promoted team leads and supervisors',
    'Founders and small-business owners managing their first team',
    'Managers of remote or hybrid teams',
    'Leaders who want to put AI to work but don’t know where to start',
  ],
  no: [
    'People looking for a certificate without doing the work',
    'Those who can’t commit ~20 minutes a day for 12 weeks',
    'Leaders who want theory only, with no change to how their team works',
  ],
};

const FAQS = [
  {
    q: 'Rp150.000 for all of this? What’s the catch?',
    a: 'No catch. We keep the price accessible on purpose: most leaders in Indonesia never get structured leadership training, and we would rather reach many leaders than a few. The cost is your commitment: you must actually implement what we build together.',
  },
  {
    q: 'I’m busy. How much time does it take?',
    a: 'Plan for roughly 20 minutes a day (the daily lesson plus a small action) and a few longer sessions per month for consultation and setup. Most of the programme is applied directly to your real work, so it saves time rather than adding to it.',
  },
  {
    q: 'My team isn’t technical. Will the AI and tools part work for us?',
    a: 'Yes. We start from your current workflow and only introduce tools that remove friction. Every tool comes with a setup tailored to your team and a short guide your team can follow.',
  },
  {
    q: 'What happens after the 3 months?',
    a: 'You keep your redesigned SOPs, your configured workspace, your automations, your certificates and your 90-day forward plan. Tool access provided through the programme lasts for the 3-month period; we’ll help you decide which ones are worth keeping.',
  },
  {
    q: 'What if the programme isn’t right for me?',
    a: 'That’s why you apply first. We review every application and have a short fit conversation before you pay anything. If we don’t believe we can help you, we’ll tell you honestly.',
  },
  {
    q: 'Is this only for big companies?',
    a: 'Not at all. It works best for teams of 2–30 people, where a single leader’s habits shape the whole team’s output.',
  },
];

/* ─── Small building blocks ─────────────────────────────────────── */
function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
        dark ? 'text-amber-300/90' : 'text-primary-600'
      }`}
    >
      <span className={`h-px w-6 ${dark ? 'bg-amber-300/60' : 'bg-primary-500'}`} />
      {children}
    </p>
  );
}

function Heading({ children, dark = false, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <h2
      className={`font-(family-name:--font-display) text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] ${
        dark ? 'text-white' : 'text-slate-900'
      } ${className}`}
    >
      {children}
    </h2>
  );
}

function PrimaryCTA({ label = 'Apply for the next cohort', className = '' }: { label?: string; className?: string }) {
  return (
    <a
      href="#apply"
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 hover:shadow-primary-600/30 ${className}`}
    >
      {label}
      <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

/* ─── Cost-of-inaction calculator ───────────────────────────────── */
function CostCalculator() {
  const [team, setTeam] = useState(5);
  const [hours, setHours] = useState(4);
  const [rate, setRate] = useState(40_000);

  const monthlyHours = team * hours * 4.33;
  const monthlyCost = monthlyHours * rate;
  const recovered = monthlyCost * 0.2 * 3; // conservative: recover just 20%, over 3 months
  const roi = recovered / PRICE;

  const sliders = [
    { label: 'People on your team', value: team, set: setTeam, min: 1, max: 30, step: 1, fmt: (v: number) => `${v}` },
    {
      label: 'Hours each person loses per week',
      hint: 'unclear instructions, rework, chasing, waiting',
      value: hours,
      set: setHours,
      min: 1,
      max: 12,
      step: 1,
      fmt: (v: number) => `${v} h`,
    },
    { label: 'Cost of one work hour', value: rate, set: setRate, min: 15_000, max: 200_000, step: 5_000, fmt: rupiah },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="flex items-baseline justify-between gap-4">
              <label className="text-sm font-medium text-slate-700">
                {s.label}
                {s.hint && <span className="block text-xs font-normal text-slate-400">{s.hint}</span>}
              </label>
              <span className="shrink-0 whitespace-nowrap font-(family-name:--font-display) text-2xl font-semibold text-slate-900 tabular-nums">
                {s.fmt(s.value)}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-3 w-full accent-primary-500"
              aria-label={s.label}
            />
          </div>
        ))}
        <p className="text-xs text-slate-400">
          Formula: people × hours lost/week × 4.33 weeks × cost per hour. Adjust to match your own team.
        </p>
      </div>

      <div className="lg:col-span-2 flex flex-col justify-between rounded-3xl bg-slate-950 p-6 sm:p-8 text-white">
        <div>
          <p className="text-sm text-slate-400">Your team is losing about</p>
          <p className="mt-1 font-(family-name:--font-display) text-4xl sm:text-5xl font-semibold tabular-nums text-white">
            {rupiah(monthlyCost)}
          </p>
          <p className="text-sm text-slate-400">every month ({Math.round(monthlyHours)} hours)</p>
        </div>
        <div className="my-6 h-px bg-white/10" />
        <div>
          <p className="text-sm text-slate-400">Recover just 20% of it over 3 months:</p>
          <p className="mt-1 font-(family-name:--font-display) text-3xl font-semibold tabular-nums text-amber-300">
            {rupiah(recovered)}
          </p>
          <p className="mt-3 text-sm text-slate-300">
            That is <span className="font-semibold text-white">{roi >= 10 ? Math.round(roi) : roi.toFixed(1)}×</span> the
            programme price of {rupiah(PRICE)}.
          </p>
        </div>
        <PrimaryCTA label="Stop the leak" className="mt-8 w-full" />
      </div>
    </div>
  );
}

/* ─── FAQ item ──────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-lg font-medium text-slate-900">{q}</span>
        <ChevronDownIcon className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}>
        <p className="overflow-hidden leading-relaxed text-slate-600">{a}</p>
      </div>
    </div>
  );
}

/* ─── Application form ──────────────────────────────────────────── */
function ApplicationForm() {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', role: '', teamSize: '', challenge: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.challenge) {
      setErrorMsg('Please fill in your name, email and biggest challenge.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    const message = [
      '[Leadership Support Program – Application]',
      `WhatsApp: ${form.whatsapp || '-'}`,
      `Role: ${form.role || '-'}`,
      `Team size: ${form.teamSize || '-'}`,
      '',
      'Biggest leadership challenge:',
      form.challenge,
    ].join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send application.');
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-3xl bg-white p-8 sm:p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckIcon className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="mt-5 font-(family-name:--font-display) text-2xl font-semibold text-slate-900">Application received</h3>
        <p className="mt-3 text-slate-600">
          Thank you, {form.name.split(' ')[0]}. We’ll review your use case and contact you within 2 working days to schedule
          your fit conversation.
        </p>
      </div>
    );
  }

  const input =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition';

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-10 shadow-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name *</label>
          <input className={input} value={form.name} onChange={update('name')} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
          <input type="email" className={input} value={form.email} onChange={update('email')} placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">WhatsApp</label>
          <input className={input} value={form.whatsapp} onChange={update('whatsapp')} placeholder="+62…" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Team size</label>
          <select className={input} value={form.teamSize} onChange={update('teamSize')}>
            <option value="">Select…</option>
            <option>Just starting (0–1)</option>
            <option>2–5 people</option>
            <option>6–15 people</option>
            <option>16–30 people</option>
            <option>30+ people</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Your role & organisation</label>
          <input className={input} value={form.role} onChange={update('role')} placeholder="e.g. Operations Lead at a logistics startup" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            What is your biggest leadership challenge right now? *
          </label>
          <textarea
            rows={4}
            className={input}
            value={form.challenge}
            onChange={update('challenge')}
            placeholder="e.g. My team keeps missing deadlines and I spend my whole day following up…"
          />
        </div>
      </div>

      {status === 'error' && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Submit my application'}
        {status !== 'sending' && <ArrowRightIcon className="h-4 w-4" />}
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <ShieldCheckIcon className="h-4 w-4" />
        No payment now. We confirm fit with you first, then send payment details.
      </p>
    </form>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function LeadershipLanding() {
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const apply = document.getElementById('apply');
      const pastHero = window.scrollY > 700;
      const atApply = apply ? apply.getBoundingClientRect().top < window.innerHeight : false;
      setShowStickyCta(pastHero && !atApply);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="bg-[#FAF8F5] text-slate-700 antialiased">
      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -top-72 -left-72 h-[60rem] w-[60rem] bg-[radial-gradient(closest-side,rgba(208,39,82,0.28),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-60 -right-40 h-[50rem] w-[50rem] bg-[radial-gradient(closest-side,rgba(245,158,11,0.10),transparent)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow dark>Leadership Support Program · 3 months</Eyebrow>
            <h1 className="mt-6 font-(family-name:--font-display) text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Lead a team that runs on <span className="italic text-amber-200">clarity</span>, not on chasing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              A tailored 3-month programme that turns you into a confident, AI-ready leader, with personal consultation,
              certified courses, redesigned SOPs and a fully configured management stack built around <em>your</em> team.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <PrimaryCTA />
              <a
                href="#program"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/5"
              >
                See what’s included
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4 text-amber-300" /> 12 weeks, ~20 min/day
              </span>
              <span className="flex items-center gap-2">
                <UserGroupIcon className="h-4 w-4 text-amber-300" /> Max {COHORT_SEATS} leaders per cohort
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-amber-300" /> Apply first, pay after fit call
              </span>
            </div>
          </div>

          {/* Snapshot card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-7 sm:p-8 shadow-2xl">
              <div className="absolute -top-3 right-6 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-950">
                All-inclusive
              </div>
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-amber-300/60">
                  <Image src="/jethro-tesla.jpeg" alt="Jethro Lim" fill sizes="56px" className="object-cover" priority />
                </div>
                <div>
                  <p className="font-semibold text-white">Mentored by Jethro Lim</p>
                  <p className="text-sm text-slate-400">Engineer · Marketer · Founder of InstructJet</p>
                </div>
              </div>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3 text-sm text-slate-200">
                {[
                  'Tailored learning path for your use case',
                  '1:1 consultation sessions',
                  'Certified courses (Google, Coursera & more)',
                  'Daily communication & psychology lessons',
                  'SOP redesign for your team',
                  'AI employees + pro access to 8 tools for 3 months',
                  'Programme certification',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="my-6 h-px bg-white/10" />
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Full programme</p>
                  <p className="font-(family-name:--font-display) text-4xl font-semibold text-white">{rupiah(PRICE)}</p>
                </div>
                <p className="text-right text-sm text-slate-400">
                  ≈ {rupiah(PRICE / PROGRAM_DAYS)}
                  <br />
                  per day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo strip */}
        <div className="relative mx-auto mt-20 max-w-7xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Mentor experience from teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {COMPANIES.map((c) => (
              <div key={c.name} className="flex items-center gap-3 opacity-80 transition hover:opacity-100">
                <div className={`relative h-9 w-9 overflow-hidden rounded-lg ${c.dark ? 'bg-slate-800' : 'bg-white'}`}>
                  <Image src={c.logo} alt={`${c.name} logo`} fill sizes="36px" className="object-contain p-0.5" />
                </div>
                <span className="text-sm font-medium text-slate-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM ════════════════════════════════════════════════ */}
      <section id="problem" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Eyebrow>Sound familiar?</Eyebrow>
            <Heading className="mt-4">Most leaders were promoted for doing the work, not for leading it.</Heading>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Nobody hands you a manual when you get a team. So you fill the gaps yourself, and slowly become the bottleneck
              everything waits on.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PAINS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <p.icon className="h-6 w-6 text-primary-500" />
                <h3 className="mt-4 font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-slate-600">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl border border-primary-100 bg-primary-50/60 p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <ExclamationTriangleIcon className="h-8 w-8 shrink-0 text-primary-600" />
              <div>
                <p className="font-(family-name:--font-display) text-2xl font-semibold text-slate-900">
                  The real problem isn’t your team. It’s the missing system around them.
                </p>
                <p className="mt-3 text-lg leading-relaxed text-slate-700">
                  You don’t need another motivational seminar. You need clear instructions, visible work, healthy
                  communication and tools that do the repetitive parts. That is exactly what this programme builds with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CALCULATOR ═════════════════════════════════════════════ */}
      <section id="calculator" className="border-y border-slate-200 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>The cost of doing nothing</Eyebrow>
            <Heading className="mt-4">What is unclear leadership costing you right now?</Heading>
            <p className="mt-6 text-lg text-slate-600">
              Rework, waiting and follow-ups are invisible on a payslip, but they are very real on your calendar. Move the
              sliders to estimate yours.
            </p>
          </div>
          <div className="mt-14">
            <CostCalculator />
          </div>
        </div>
      </section>

      {/* ═══ TRANSFORMATION ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <Eyebrow>The transformation</Eyebrow>
            <Heading className="mt-4">From bottleneck to multiplier in 90 days.</Heading>
          </div>
          <div className="mt-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 bg-slate-50 text-xs font-semibold uppercase tracking-wider">
              <div className="px-5 py-4 text-slate-500 sm:px-8">Today</div>
              <div className="border-l border-slate-200 px-5 py-4 text-primary-600 sm:px-8">After the programme</div>
            </div>
            {BEFORE_AFTER.map(([before, after]) => (
              <div key={before} className="grid grid-cols-2 border-t border-slate-100">
                <div className="flex gap-3 px-5 py-5 text-slate-500 sm:px-8">
                  <XMarkIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                  <span>{before}</span>
                </div>
                <div className="flex gap-3 border-l border-slate-100 px-5 py-5 font-medium text-slate-900 sm:px-8">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <span>{after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROGRAM PILLARS ════════════════════════════════════════ */}
      <section id="program" className="bg-slate-950 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Eyebrow dark>What’s included</Eyebrow>
            <Heading dark className="mt-4">
              Everything a new leader needs, in one programme.
            </Heading>
            <p className="mt-6 text-lg text-slate-400">
              Eight pillars, each designed around one question: <span className="text-white">what will this change for you and your team?</span>
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="group bg-slate-950 p-7 transition hover:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p.icon className="h-7 w-7 text-amber-300" />
                  <span className="text-xs font-semibold tabular-nums tracking-widest text-slate-600">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.feature}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-200">
                  <span className="font-semibold text-amber-300">→ </span>
                  {p.outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOOLKIT ════════════════════════════════════════════════ */}
      <section id="toolkit" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Your leadership stack</Eyebrow>
              <Heading className="mt-4">The pro version of every tool. Included.</Heading>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                No extra subscriptions to buy. You get <strong className="text-slate-900">pro access to every tool below for
                the full 3 months</strong>, and we teach you to use each one the way top teams do, so your team can move
                faster and compete with companies many times its size.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              <div className="flex justify-center sm:col-span-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                  <SparklesIcon className="h-4 w-4 text-amber-300" />
                  Free Pro Subscription
                </span>
              </div>
              {TOOLS.map((t) => (
                <div key={t.name} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-primary-200 hover:shadow-md">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                    {'crop' in t ? (
                      // wide wordmark: show only the jet icon from the left of the image
                      <Image src={t.logo} alt={`${t.name} logo`} width={155} height={84} className="absolute max-w-none" style={{ left: -15, top: -20 }} />
                    ) : (
                      <Image src={t.logo} alt={`${t.name} logo`} fill sizes="44px" className="object-contain p-1.5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-500">{t.use}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5 sm:col-span-2">
                <div className="flex -space-x-2">
                  {['/tools/google.png', '/tools/coursera.png', '/tools/linkedin.png'].map((src) => (
                    <div key={src} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-white">
                      <Image src={src} alt="" fill sizes="36px" className="object-contain p-1" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Plus certified courses</span> from Google, Coursera and
                  other institutions, chosen for your gaps, and ready to add to your LinkedIn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ROADMAP ════════════════════════════════════════════════ */}
      <section id="roadmap" className="border-y border-slate-200 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>The 12-week journey</Eyebrow>
            <Heading className="mt-4">A clear path, one month at a time.</Heading>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {ROADMAP.map((m, i) => (
              <div key={m.month} className="relative rounded-3xl border border-slate-200 bg-white p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 font-(family-name:--font-display) text-lg font-semibold text-amber-300">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{m.month}</span>
                </div>
                <h3 className="mt-6 font-(family-name:--font-display) text-3xl font-semibold text-slate-900">{m.title}</h3>
                <p className="text-primary-600">{m.subtitle}</p>
                <ul className="mt-6 space-y-3">
                  {m.weeks.map((w) => (
                    <li key={w} className="flex gap-3 text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MENTOR ═════════════════════════════════════════════════ */}
      <section id="mentor" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm">
              <div aria-hidden className="absolute -inset-3 rounded-[2.4rem] bg-linear-to-br from-primary-200 via-amber-100 to-transparent opacity-80" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                <Image src="/jethro-tesla.jpeg" alt="Jethro Lim, programme mentor" fill sizes="(max-width: 1024px) 384px, 420px" className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-2 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-xl sm:-right-8">
                <p className="font-(family-name:--font-display) text-xl font-semibold">Jethro Lim</p>
                <p className="text-xs text-slate-400">Programme Mentor · B.S. Computer Science, BINUS</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>Your mentor</Eyebrow>
            <Heading className="mt-4">I learned leadership the hard way. You don’t have to.</Heading>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
              <p>
                As a software engineer leading projects, I kept hitting the same wall: <strong className="text-slate-900">communication gaps</strong>{' '}
                between what managers wanted and what people built. Vague requirements, unclear instructions, wasted weeks.
              </p>
              <p>
                My mentors taught me that great leadership isn’t about talking more; it’s about <strong className="text-slate-900">structuring clarity</strong>.
                I turned that lesson into InstructJet, and now into this programme: the system I wish I had on day one.
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {COMPANIES.map((c) => (
                <div key={c.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 ${c.dark ? 'bg-slate-800' : 'bg-white'}`}>
                    <Image src={c.logo} alt={`${c.name} logo`} fill sizes="48px" className="object-contain p-1" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-sm text-slate-500">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FIT ════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-200 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Eyebrow>Is this for you?</Eyebrow>
            <Heading className="mt-4">Built for leaders who want to change how their team works.</Heading>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-100 bg-white p-8">
              <p className="font-semibold text-emerald-700">This is for you if you are…</p>
              <ul className="mt-6 space-y-4">
                {FIT.yes.map((f) => (
                  <li key={f} className="flex gap-3 text-slate-700">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="font-semibold text-slate-500">This is not for…</p>
              <ul className="mt-6 space-y-4">
                {FIT.no.map((f) => (
                  <li key={f} className="flex gap-3 text-slate-500">
                    <XMarkIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <Eyebrow>Investment</Eyebrow>
            <Heading className="mt-4">One price. Everything included.</Heading>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Less than the cost of a single team lunch, for three months of support that changes how your whole team works.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl lg:grid lg:grid-cols-5">
            <div className="p-8 sm:p-12 lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Leadership Support Program</p>
              <p className="mt-2 text-slate-400">3 months · tailored to your team</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  'Tailored learning programme',
                  '1:1 consultation sessions',
                  'Certified courses (Google, Coursera…)',
                  'Daily communication & psychology',
                  'SOP redesign service',
                  'AI employees setup & training',
                  'Pro: Claude Cowork & InstructJet Premium',
                  'Pro: Make.com, Trello & Asana',
                  'Pro: Google Meet, Slack / Discord & Notion',
                  'Training to use every tool like a top team',
                  'Management templates & tools',
                  'Programme certificate',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-200">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 bg-white/[0.03] p-8 sm:p-12 lg:col-span-2 lg:border-l lg:border-t-0">
              <p className="text-sm text-slate-400">Full programme</p>
              <p className="mt-2 font-(family-name:--font-display) text-5xl font-semibold text-white">{rupiah(PRICE)}</p>
              <p className="mt-2 text-slate-400">
                one-time · ≈ {rupiah(PRICE / PROGRAM_DAYS)}/day
              </p>
              <PrimaryCTA className="mt-8 w-full" />
              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <p className="flex gap-2">
                  <ShieldCheckIcon className="h-5 w-5 shrink-0 text-amber-300" /> No payment until we confirm it’s a fit
                </p>
                <p className="flex gap-2">
                  <ClockIcon className="h-5 w-5 shrink-0 text-amber-300" /> Max {COHORT_SEATS} leaders per cohort, because
                  every programme is tailored by hand
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════════════════ */}
      <section id="faq" className="border-t border-slate-200 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <Heading className="mt-4">Honest answers.</Heading>
            <p className="mt-6 text-slate-600">
              Still unsure? Ask us anything in your application. We read every one personally.
            </p>
            <QuestionMarkCircleIcon className="mt-8 hidden h-16 w-16 text-slate-200 lg:block" />
          </div>
          <div className="lg:col-span-8">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APPLY ══════════════════════════════════════════════════ */}
      <section id="apply" className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div aria-hidden className="pointer-events-none absolute -top-60 -right-40 h-[50rem] w-[50rem] bg-[radial-gradient(closest-side,rgba(208,39,82,0.22),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <Eyebrow dark>Apply now</Eyebrow>
            <Heading dark className="mt-4">
              Your team is waiting for the leader you’re about to become.
            </Heading>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Tell us about your team and your biggest challenge. We’ll review your use case, schedule a short fit
              conversation, and send payment details only if we’re confident we can help.
            </p>
            <ol className="mt-10 space-y-5">
              {[
                ['Apply', 'Two minutes. Tell us about your team.'],
                ['Fit conversation', 'A short call to understand your use case.'],
                ['Start', `Pay ${rupiah(PRICE)} and receive your tailored plan & tools.`],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300/40 text-sm font-semibold text-amber-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{t}</p>
                    <p className="text-sm text-slate-400">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <ApplicationForm />
        </div>
      </section>

      {/* ═══ Mobile sticky CTA ══════════════════════════════════════ */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">3-month programme</p>
            <p className="font-(family-name:--font-display) text-xl font-semibold text-slate-900">{rupiah(PRICE)}</p>
          </div>
          <a href="#apply" className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25">
            Apply now
          </a>
        </div>
      </div>
    </main>
  );
}
