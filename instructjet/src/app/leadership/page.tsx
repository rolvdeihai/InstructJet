// app/leadership/page.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fraunces, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadershipLanding from '@/components/LeadershipLanding';
import type { LeadershipLocale } from '@/lib/leadership-copy';
import { PROGRAM_PRICE_ID, type ProgramCheckout } from '@/lib/program/config';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

type PageProps = { searchParams: Promise<{ lang?: string | string[] }> };

// Only Indonesian visitors may switch languages (?lang=); everyone else always
// gets the English page. No country header means local dev, so allow switching.
async function canSwitchLocale() {
  const country = (await headers()).get('x-vercel-ip-country');
  return !country || country === 'ID';
}

async function resolveLocale(searchParams: PageProps['searchParams']): Promise<LeadershipLocale> {
  if (!(await canSwitchLocale())) return 'en';
  const { lang } = await searchParams;
  if (lang === 'id' || lang === 'en') return lang;
  const country = (await headers()).get('x-vercel-ip-country');
  return country === 'ID' ? 'id' : 'en';
}

// The English page always sells the $10/week subscription through Paddle, even
// to Indonesian visitors who switched to it. Rp150.000 / 3 months is only on
// the Indonesian page.
const FALLBACK_CHECKOUT: ProgramCheckout = { priceLabel: '$10', intervalLabel: '/week', currency: 'USD', yearlyCost: 520 };

// Price shown on the page comes straight from Paddle so it never drifts
async function getProgramCheckout(): Promise<ProgramCheckout> {
  const apiKey = process.env.PADDLE_API_KEY?.trim();
  const base = process.env.PADDLE_ENVIRONMENT === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';
  if (!apiKey) return FALLBACK_CHECKOUT;
  try {
    const res = await fetch(`${base}/prices/${PROGRAM_PRICE_ID}`, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Paddle-Version': '1' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Paddle ${res.status}`);
    const price = (await res.json()).data;
    const currency: string = price.unit_price.currency_code;
    const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 });
    const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
    const amount = Number(price.unit_price.amount) / 10 ** digits;
    const cycle = price.billing_cycle;
    const intervalLabel = cycle
      ? cycle.frequency === 1
        ? `/${cycle.interval}`
        : ` every ${cycle.frequency} ${cycle.interval}s`
      : null;
    const perYear: Record<string, number> = { day: 365, week: 52, month: 12, year: 1 };
    const yearlyCost = cycle ? (amount * (perYear[cycle.interval] ?? 12)) / (cycle.frequency || 1) : amount;
    return { priceLabel: fmt.format(amount).replace(/\.00$/, ''), intervalLabel, currency, yearlyCost };
  } catch (e) {
    console.error('[leadership] Could not load program price from Paddle:', e);
    return FALLBACK_CHECKOUT;
  }
}

const METADATA: Record<LeadershipLocale, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: 'Leadership Support Program – Business Support for Growing Teams',
    description:
      'InstructJet business support: trained job seekers and helpers, networking, investment and bazaar events, crowdfunding help, a mutual promotion community and a basic website, plus leadership courses, SOP redesign, Claude Cowork and InstructJet Premium. Only $10/week.',
    ogTitle: 'Leadership Support Program – InstructJet',
    ogDescription:
      'People to lead, events, investment help, community promotion and a website, plus tailored leadership support, for $10/week.',
  },
  id: {
    title: 'Leadership Support Program – Dukungan Bisnis untuk UMKM yang Ingin Tumbuh',
    description:
      'Dukungan bisnis InstructJet: pencari kerja terlatih dan helper, acara networking, investasi, dan bazar, bantuan crowdfunding, komunitas saling promosi, dan website dasar, ditambah kursus kepemimpinan, perbaikan SOP, Claude Cowork, dan InstructJet Premium. Hanya Rp150.000.',
    ogTitle: 'Leadership Support Program – InstructJet',
    ogDescription:
      'Orang untuk dipimpin, acara, bantuan investasi, promosi komunitas, dan website, ditambah dukungan kepemimpinan selama 3 bulan, seharga Rp150.000.',
  },
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const m = METADATA[await resolveLocale(searchParams)];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: 'https://instructjet.com/leadership',
      languages: {
        en: 'https://instructjet.com/leadership?lang=en',
        id: 'https://instructjet.com/leadership?lang=id',
      },
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: 'https://instructjet.com/leadership',
    },
  };
}

export default async function LeadershipPage({ searchParams }: PageProps) {
  const locale = await resolveLocale(searchParams);
  const checkout = locale === 'en' ? await getProgramCheckout() : null;
  const canSwitch = await canSwitchLocale();
  return (
    <div className={`${display.variable} ${body.variable} font-(family-name:--font-body)`}>
      <Navbar />
      <LeadershipLanding key={locale} locale={locale} checkout={checkout} canSwitch={canSwitch} />
      <Footer />
    </div>
  );
}
