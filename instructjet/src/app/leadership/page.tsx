// app/leadership/page.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fraunces, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadershipLanding from '@/components/LeadershipLanding';
import type { LeadershipLocale } from '@/lib/leadership-copy';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

type PageProps = { searchParams: Promise<{ lang?: string | string[] }> };

// ?lang= wins so visitors can switch; otherwise use the country Vercel derives from the IP
async function resolveLocale(searchParams: PageProps['searchParams']): Promise<LeadershipLocale> {
  const { lang } = await searchParams;
  if (lang === 'id' || lang === 'en') return lang;
  const country = (await headers()).get('x-vercel-ip-country');
  return country === 'ID' ? 'id' : 'en';
}

const METADATA: Record<LeadershipLocale, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: 'Leadership Support Program – Business Support for Growing Teams',
    description:
      'InstructJet business support: job seekers pool, free helpers, networking and investment events, bazaars, a mutual promotion community and basic websites, plus leadership courses, SOP redesign, Claude Cowork and InstructJet Premium. Rp150.000 only.',
    ogTitle: 'Leadership Support Program – InstructJet',
    ogDescription:
      'People to lead, helpers, investors, events, community promotion and a website, plus tailored leadership support for 3 months, for Rp150.000.',
  },
  id: {
    title: 'Leadership Support Program – Dukungan Bisnis untuk UMKM yang Ingin Tumbuh',
    description:
      'Dukungan bisnis InstructJet: akses pencari kerja, helper gratis, acara networking dan investasi, bazar, komunitas saling promosi, dan website dasar, ditambah kursus kepemimpinan, perbaikan SOP, Claude Cowork, dan InstructJet Premium. Hanya Rp150.000.',
    ogTitle: 'Leadership Support Program – InstructJet',
    ogDescription:
      'Orang untuk dipimpin, helper, investor, acara, promosi komunitas, dan website, ditambah dukungan kepemimpinan selama 3 bulan, seharga Rp150.000.',
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
  return (
    <div className={`${display.variable} ${body.variable} font-(family-name:--font-body)`}>
      <Navbar />
      <LeadershipLanding key={locale} locale={locale} />
      <Footer />
    </div>
  );
}
