// src/components/LeadershipLanding.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { LEADERSHIP_COPY, type LeadershipCopy, type LeadershipLocale } from '@/lib/leadership-copy';

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

// photos for the programme cards, in the same order as the copy; .jpg ones are Unsplash License stock photos
const PILLAR_IMAGES: Record<'business' | 'leadership', (string | null)[]> = {
  business: [
    '/program/job-seekers.png',
    '/program/education.png',
    '/program/internships.png',
    '/program/networking.jpg',
    '/program/investor-pitching.png',
    '/program/bazaar.jpg',
    '/program/community.png',
    '/program/website.jpg',
  ],
  leadership: [
    '/program/tailored.jpg',
    '/program/coaching.png',
    '/program/skills.png',
    '/program/mentorship.png',
    '/program/tools.png',
    '/program/ai-employees.jpg',
    '/program/templates.jpg',
    '/program/certification.jpg',
  ],
};

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

function PrimaryCTA({ label, className = '' }: { label: string; className?: string }) {
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

function SourceLink({ source }: { source: { label: string; url: string } }) {
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600">
      {source.label}
    </a>
  );
}

function PillarGrid({ pillars, images }: { pillars: LeadershipCopy['program']['business']; images: (string | null)[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p, i) => (
        <div key={p.title} className="group bg-slate-950 p-7 transition hover:bg-slate-900">
          {images[i] && (
            <div className="relative -mx-7 -mt-7 mb-7 aspect-[16/10] overflow-hidden bg-slate-900">
              <Image
                src={images[i]}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          )}
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
  );
}

/* ─── Video testimonial slider ──────────────────────────────────── */
function TestimonialSlider({ t }: { t: LeadershipCopy['testimonials'] }) {
  const [active, setActive] = useState(0);
  const count = t.items.length;
  const current = t.items[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="relative mx-auto aspect-[9/16] h-[480px] overflow-hidden rounded-2xl border border-primary-200 bg-slate-950 shadow-2xl shadow-primary-500/10 sm:h-[560px]">
          <video
            key={current.video}
            src={current.video}
            poster={current.poster}
            title={`${current.name} – ${current.role}`}
            controls
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="space-y-3">
          {t.items.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`w-full rounded-xl border p-5 text-left transition ${
                i === active ? 'border-primary-300 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                <span className={`text-xs font-semibold ${i === active ? 'text-primary-600' : 'text-slate-400'}`}>
                  {i === active ? t.nowPlaying : t.play}
                </span>
              </div>
              <p className="text-xs font-semibold text-primary-600">{item.role}</p>
              <p className="mt-2 text-slate-600">“{item.quote}”</p>
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setActive((active - 1 + count) % count)}
            aria-label={t.prev}
            className="h-10 w-10 rounded-full border border-slate-300 text-slate-600 transition hover:border-primary-400 hover:text-primary-600"
          >
            ‹
          </button>
          <button
            onClick={() => setActive((active + 1) % count)}
            aria-label={t.next}
            className="h-10 w-10 rounded-full border border-slate-300 text-slate-600 transition hover:border-primary-400 hover:text-primary-600"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Business impact calculator ────────────────────────────────── */
function ImpactCalculator({ t, numberLocale }: { t: LeadershipCopy['impact']; numberLocale: string }) {
  const [revenue, setRevenue] = useState(50_000_000);
  const [lifts, setLifts] = useState<Record<string, number>>(() =>
    Object.fromEntries(t.lifts.map((l) => [l.key, l.initial]))
  );

  const decimal = (n: number) => n.toLocaleString(numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const percents = t.lifts.map((l) => lifts[l.key]);
  const added = percents.reduce((sum, p) => sum + p, 0);
  const factor = percents.reduce((product, p) => product * (1 + p / 100), 1);
  const compounded = (factor - 1) * 100;
  const extraMonthly = revenue * (factor - 1);
  const extraYearly = extraMonthly * 12;
  const threeYearFactor = factor ** 3; // the same lifts repeated each year
  const roi = extraYearly / PRICE;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label className="text-sm font-medium text-slate-700">{t.revenue}</label>
            <span className="shrink-0 whitespace-nowrap font-(family-name:--font-display) text-2xl font-semibold text-slate-900 tabular-nums">
              {rupiah(revenue)}
            </span>
          </div>
          <input
            type="range"
            min={5_000_000}
            max={1_000_000_000}
            step={5_000_000}
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="mt-3 w-full accent-primary-500"
            aria-label={t.revenue}
          />
        </div>
        {t.lifts.map((l) => (
          <div key={l.key}>
            <div className="flex items-baseline justify-between gap-4">
              <label className="text-sm font-medium text-slate-700">
                {l.label}
                <span className="block text-xs font-normal text-slate-400">{l.hint}</span>
              </label>
              <span className="shrink-0 whitespace-nowrap font-(family-name:--font-display) text-2xl font-semibold text-slate-900 tabular-nums">
                +{lifts[l.key]}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={lifts[l.key]}
              onChange={(e) => setLifts({ ...lifts, [l.key]: Number(e.target.value) })}
              className="mt-3 w-full accent-primary-500"
              aria-label={l.label}
            />
          </div>
        ))}
        <p className="text-xs text-slate-400">{t.disclaimer}</p>
      </div>

      <div className="lg:col-span-2 flex flex-col justify-between rounded-3xl bg-slate-950 p-6 sm:p-8 text-white">
        <div>
          <p className="text-sm text-slate-400">{t.compounded(added)}</p>
          <p className="mt-1 font-(family-name:--font-display) text-4xl sm:text-5xl font-semibold tabular-nums text-amber-300">
            +{decimal(compounded)}%
          </p>
        </div>
        <div className="my-6 h-px bg-white/10" />
        <div>
          <p className="text-sm text-slate-400">{t.extra}</p>
          <p className="mt-1 break-words font-(family-name:--font-display) text-3xl font-semibold tabular-nums text-white">
            {rupiah(extraMonthly)}
            <span className="text-base font-normal text-slate-400">{t.perMonth}</span>
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {t.yearly(rupiah(extraYearly), roi >= 10 ? Math.round(roi).toLocaleString(numberLocale) : decimal(roi))}
          </p>
        </div>
        <div className="my-6 h-px bg-white/10" />
        <div>
          <p className="text-sm text-slate-400">{t.threeYears}</p>
          <p className="mt-1 font-(family-name:--font-display) text-3xl font-semibold tabular-nums text-white">
            {t.threeYearsResult(decimal(threeYearFactor))}
          </p>
        </div>
        <PrimaryCTA label={t.cta} className="mt-8 w-full" />
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
function ApplicationForm({ t, locale }: { t: LeadershipCopy['form']; locale: LeadershipLocale }) {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', role: '', teamSize: '', challenge: '' });
  const [needs, setNeeds] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const toggleNeed = (need: string) =>
    setNeeds(needs.includes(need) ? needs.filter((n) => n !== need) : [...needs, need]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.challenge) {
      setErrorMsg(t.required);
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    const message = [
      '[Leadership Support Program – Application]',
      `Page language: ${locale}`,
      `WhatsApp: ${form.whatsapp || '-'}`,
      `Role & business: ${form.role || '-'}`,
      `Team size: ${form.teamSize || '-'}`,
      `Needs most: ${needs.join(', ') || '-'}`,
      '',
      'Biggest business challenge:',
      form.challenge,
    ].join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.failed);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || t.generic);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-3xl bg-white p-8 sm:p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckIcon className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="mt-5 font-(family-name:--font-display) text-2xl font-semibold text-slate-900">{t.successTitle}</h3>
        <p className="mt-3 text-slate-600">{t.success(form.name.split(' ')[0])}</p>
      </div>
    );
  }

  const input =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition';

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-10 shadow-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.name}</label>
          <input className={input} value={form.name} onChange={update('name')} placeholder={t.namePlaceholder} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.email}</label>
          <input type="email" className={input} value={form.email} onChange={update('email')} placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">WhatsApp</label>
          <input className={input} value={form.whatsapp} onChange={update('whatsapp')} placeholder="+62…" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.teamSize}</label>
          <select className={input} value={form.teamSize} onChange={update('teamSize')}>
            <option value="">{t.select}</option>
            {t.teamSizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.role}</label>
          <input className={input} value={form.role} onChange={update('role')} placeholder={t.rolePlaceholder} />
        </div>
        <div className="sm:col-span-2">
          <p className="mb-1.5 block text-sm font-medium text-slate-700">{t.needsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {t.needs.map((need) => (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                aria-pressed={needs.includes(need)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  needs.includes(need)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                {need}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.challenge}</label>
          <textarea
            rows={4}
            className={input}
            value={form.challenge}
            onChange={update('challenge')}
            placeholder={t.challengePlaceholder}
          />
        </div>
      </div>

      {status === 'error' && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 disabled:opacity-60"
      >
        {status === 'sending' ? t.sending : t.submit}
        {status !== 'sending' && <ArrowRightIcon className="h-4 w-4" />}
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <ShieldCheckIcon className="h-4 w-4" />
        {t.note}
      </p>
    </form>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function LeadershipLanding({ locale }: { locale: LeadershipLocale }) {
  const t = LEADERSHIP_COPY[locale];
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
    <main lang={locale} className="bg-[#FAF8F5] text-slate-700 antialiased">
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Eyebrow dark>{t.hero.eyebrow}</Eyebrow>
              <a href={t.switchHref} className="text-sm text-slate-400 underline underline-offset-4 hover:text-white">
                {t.switchLabel}
              </a>
            </div>
            <h1 className="mt-6 font-(family-name:--font-display) text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.hero.titleBefore}
              <span className="italic text-amber-200">{t.hero.titleEm}</span>
              {t.hero.titleAfter}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">{t.hero.body}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <PrimaryCTA label={t.cta} />
              <a
                href="#program"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/5"
              >
                {t.hero.secondary}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4 text-amber-300" /> {t.hero.meta.time}
              </span>
              <span className="flex items-center gap-2">
                <UserGroupIcon className="h-4 w-4 text-amber-300" /> {t.hero.meta.seats(COHORT_SEATS)}
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-amber-300" /> {t.hero.meta.apply}
              </span>
            </div>
          </div>

          {/* Snapshot card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-7 sm:p-8 shadow-2xl">
              <div className="absolute -top-3 right-6 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-950">
                {t.hero.badge}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-amber-300/60">
                  <Image src="/jethro-graduation.jpeg" alt="Jethro Lim" fill sizes="56px" className="object-cover" priority />
                </div>
                <div>
                  <p className="font-semibold text-white">{t.hero.mentoredBy}</p>
                  <p className="text-sm text-slate-400">{t.hero.mentorRole}</p>
                </div>
              </div>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-3 text-sm text-slate-200">
                {t.hero.snapshot.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="my-6 h-px bg-white/10" />
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">{t.hero.fullProgramme}</p>
                  <p className="font-(family-name:--font-display) text-4xl font-semibold text-white">{rupiah(PRICE)}</p>
                </div>
                <p className="text-right text-sm text-slate-400">
                  ≈ {rupiah(PRICE / PROGRAM_DAYS)}
                  <br />
                  {t.hero.perDay}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo strip */}
        <div className="relative mx-auto mt-20 max-w-7xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t.hero.logos}</p>
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
            <Eyebrow>{t.problem.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.problem.title}</Heading>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">{t.problem.body}</p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.problem.odds.map((o) => (
              <div key={o.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-(family-name:--font-display) text-5xl font-semibold text-primary-600">{o.stat}</p>
                <h3 className="mt-4 font-semibold text-slate-900">{o.title}</h3>
                <p className="mt-1 flex-1 text-slate-600">{o.body}</p>
                <div className="mt-4">
                  <SourceLink source={o.source} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-3xl">
            <Heading className="!text-2xl sm:!text-3xl lg:!text-4xl">{t.problem.compoundTitle}</Heading>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t.problem.trapLabel}</p>
              <p className="mt-2 font-(family-name:--font-display) text-2xl font-semibold text-slate-900">{t.problem.trapTitle}</p>
              <ul className="mt-6 space-y-4">
                {t.problem.trap.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-600">
                    <XMarkIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-primary-100 bg-primary-50/60 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">{t.problem.goalLabel}</p>
              <p className="mt-2 font-(family-name:--font-display) text-2xl font-semibold text-slate-900">{t.problem.goalTitle}</p>
              <ul className="mt-6 space-y-4">
                {t.problem.goal.map((item) => (
                  <li key={item} className="flex gap-3 font-medium text-slate-800">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-20 max-w-3xl">
            <Heading className="!text-2xl sm:!text-3xl lg:!text-4xl">{t.problem.leversTitle}</Heading>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.problem.levers.map((l) => (
              <div key={l.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <l.icon className="h-6 w-6 text-primary-500" />
                  <h3 className="font-semibold text-slate-900">{l.title}</h3>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">{t.problem.aloneLabel}</span>
                  {l.alone}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">{t.problem.payoffLabel}</span>
                  {l.effect}
                </p>
                {l.stat && l.source && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-(family-name:--font-display) text-xl font-semibold text-slate-900">{l.stat}</span>{' '}
                      {l.statLabel}
                    </p>
                    <SourceLink source={l.source} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-primary-100 bg-primary-50/60 p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <ExclamationTriangleIcon className="h-8 w-8 shrink-0 text-primary-600" />
              <div>
                <p className="font-(family-name:--font-display) text-2xl font-semibold text-slate-900">{t.problem.oddsTitle}</p>
                <p className="mt-3 text-lg leading-relaxed text-slate-700">
                  {t.problem.oddsBefore}
                  <strong className="text-slate-900">{t.problem.oddsStrong}</strong>
                  {t.problem.oddsAfter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAIN REACTION ═════════════════════════════════════════ */}
      <section id="chain" className="bg-slate-950 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-3xl">
            <Eyebrow dark>{t.chain.eyebrow}</Eyebrow>
            <Heading dark className="mt-4">
              {t.chain.title}
            </Heading>
            <p className="mt-6 text-lg text-slate-400">{t.chain.body}</p>
          </div>
          <ol className="mt-14 space-y-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
            {t.chain.steps.map((c, i) => (
              <li key={c.title} className="flex gap-6 bg-slate-950 p-6 sm:p-8">
                <span className="font-(family-name:--font-display) text-4xl font-semibold tabular-nums text-amber-300">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-1 text-slate-400">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{t.testimonials.eyebrow}</Eyebrow>
            <Heading className="mt-4">
              {t.testimonials.titleBefore}
              <span className="italic text-primary-600">{t.testimonials.titleEm}</span>
            </Heading>
            <p className="mt-6 text-lg text-slate-600">{t.testimonials.body}</p>
          </div>
          <div className="mt-14">
            <TestimonialSlider t={t.testimonials} />
          </div>
        </div>
      </section>

      {/* ═══ CALCULATOR ═════════════════════════════════════════════ */}
      <section id="calculator" className="border-y border-slate-200 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{t.impact.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.impact.title}</Heading>
            <p className="mt-6 text-lg text-slate-600">{t.impact.body}</p>
          </div>
          <div className="mt-14">
            <ImpactCalculator t={t.impact} numberLocale={t.numberLocale} />
          </div>
        </div>
      </section>

      {/* ═══ TRANSFORMATION ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <Eyebrow>{t.transformation.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.transformation.title}</Heading>
          </div>
          <div className="mt-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 bg-slate-50 text-xs font-semibold uppercase tracking-wider">
              <div className="px-5 py-4 text-slate-500 sm:px-8">{t.transformation.today}</div>
              <div className="border-l border-slate-200 px-5 py-4 text-primary-600 sm:px-8">{t.transformation.after}</div>
            </div>
            {t.transformation.rows.map(([before, after]) => (
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
            <Eyebrow dark>{t.program.eyebrow}</Eyebrow>
            <Heading dark className="mt-4">
              {t.program.title}
            </Heading>
            <p className="mt-6 text-lg text-slate-400">
              {t.program.bodyBefore}
              <span className="text-white">{t.program.bodyStrong}</span>
            </p>
          </div>
          <h3 className="mt-14 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">{t.program.businessLabel}</h3>
          <div className="mt-5">
            <PillarGrid pillars={t.program.business} images={PILLAR_IMAGES.business} />
          </div>
          <h3 className="mt-14 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">{t.program.leadershipLabel}</h3>
          <div className="mt-5">
            <PillarGrid pillars={t.program.leadership} images={PILLAR_IMAGES.leadership} />
          </div>
        </div>
      </section>

      {/* ═══ TOOLKIT ════════════════════════════════════════════════ */}
      <section id="toolkit" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>{t.toolkit.eyebrow}</Eyebrow>
              <Heading className="mt-4">{t.toolkit.title}</Heading>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                {t.toolkit.bodyBefore}
                <strong className="text-slate-900">{t.toolkit.bodyStrong}</strong>
                {t.toolkit.bodyAfter}
              </p>
            </div>
            <div className="grid content-start gap-4 lg:col-span-7">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                  <Image src="/tools/claude.png" alt="Claude Cowork logo" fill sizes="44px" className="object-contain p-1.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Claude Cowork</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{t.toolkit.claude}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                  {/* wide wordmark: show only the jet icon from the left of the image */}
                  <Image src="/instructjet_logo.png" alt="InstructJet Premium logo" width={155} height={84} className="absolute max-w-none" style={{ left: -15, top: -20 }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">InstructJet Premium</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{t.toolkit.instructjet}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5">
                <div className="flex -space-x-2">
                  {['/tools/google.png', '/tools/coursera.png', '/tools/linkedin.png'].map((src) => (
                    <div key={src} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-white">
                      <Image src={src} alt="" fill sizes="36px" className="object-contain p-1" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{t.toolkit.coursesStrong}</span>
                  {t.toolkit.coursesBody}
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
            <Eyebrow>{t.roadmap.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.roadmap.title}</Heading>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {t.roadmap.months.map((m, i) => (
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
                <Image src="/jethro-graduation.jpeg" alt={t.mentor.photoAlt} fill sizes="(max-width: 1024px) 384px, 420px" className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-2 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-xl sm:-right-8">
                <p className="font-(family-name:--font-display) text-xl font-semibold">Jethro Lim</p>
                <p className="text-xs text-slate-400">{t.mentor.badge}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>{t.mentor.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.mentor.title}</Heading>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
              <p>
                {t.mentor.p1Before}
                <strong className="text-slate-900">{t.mentor.p1Strong}</strong>
                {t.mentor.p1After}
              </p>
              <p>
                {t.mentor.p2Before}
                <strong className="text-slate-900">{t.mentor.p2Strong}</strong>
                {t.mentor.p2After}
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
            <Eyebrow>{t.fit.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.fit.title}</Heading>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-100 bg-white p-8">
              <p className="font-semibold text-emerald-700">{t.fit.yesLabel}</p>
              <ul className="mt-6 space-y-4">
                {t.fit.yes.map((f) => (
                  <li key={f} className="flex gap-3 text-slate-700">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="font-semibold text-slate-500">{t.fit.noLabel}</p>
              <ul className="mt-6 space-y-4">
                {t.fit.no.map((f) => (
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
            <Eyebrow>{t.pricing.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.pricing.title}</Heading>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{t.pricing.body}</p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl lg:grid lg:grid-cols-5">
            <div className="p-8 sm:p-12 lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">{t.pricing.name}</p>
              <p className="mt-2 text-slate-400">{t.pricing.tagline}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {t.pricing.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-200">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 bg-white/[0.03] p-8 sm:p-12 lg:col-span-2 lg:border-l lg:border-t-0">
              <p className="text-sm text-slate-400">{t.pricing.fullProgramme}</p>
              <p className="mt-2 font-(family-name:--font-display) text-5xl font-semibold text-white">{rupiah(PRICE)}</p>
              <p className="mt-2 text-slate-400">{t.pricing.oneTime(rupiah(PRICE / PROGRAM_DAYS))}</p>
              <PrimaryCTA label={t.cta} className="mt-8 w-full" />
              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <p className="flex gap-2">
                  <ShieldCheckIcon className="h-5 w-5 shrink-0 text-amber-300" /> {t.pricing.noPayment}
                </p>
                <p className="flex gap-2">
                  <ClockIcon className="h-5 w-5 shrink-0 text-amber-300" /> {t.pricing.seats(COHORT_SEATS)}
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
            <Eyebrow>{t.faq.eyebrow}</Eyebrow>
            <Heading className="mt-4">{t.faq.title}</Heading>
            <p className="mt-6 text-slate-600">{t.faq.body}</p>
            <QuestionMarkCircleIcon className="mt-8 hidden h-16 w-16 text-slate-200 lg:block" />
          </div>
          <div className="lg:col-span-8">
            {t.faq.items.map((f) => (
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
            <Eyebrow dark>{t.apply.eyebrow}</Eyebrow>
            <Heading dark className="mt-4">
              {t.apply.title}
            </Heading>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">{t.apply.body}</p>
            <ol className="mt-10 space-y-5">
              {[...t.apply.steps, { title: t.apply.startTitle, body: t.apply.startBody(rupiah(PRICE)) }].map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300/40 text-sm font-semibold text-amber-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="text-sm text-slate-400">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <ApplicationForm t={t.form} locale={locale} />
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
            <p className="text-xs text-slate-500">{t.sticky.label}</p>
            <p className="font-(family-name:--font-display) text-xl font-semibold text-slate-900">{rupiah(PRICE)}</p>
          </div>
          <a href="#apply" className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25">
            {t.sticky.cta}
          </a>
        </div>
      </div>
    </main>
  );
}
