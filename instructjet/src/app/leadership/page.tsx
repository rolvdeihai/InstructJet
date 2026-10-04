// app/leadership/page.tsx
import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadershipLanding from '@/components/LeadershipLanding';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Leadership Support Program – Lead Your Team with Clarity & AI',
  description:
    'A 3-month tailored leadership programme: 1:1 consultation, certified courses, daily communication & psychology lessons, SOP redesign, AI employees and a full management tool stack. Rp150.000 only.',
  alternates: { canonical: 'https://instructjet.com/leadership' },
  openGraph: {
    title: 'Leadership Support Program – InstructJet',
    description:
      'Become a confident, AI-ready team lead in 3 months. Tailored coaching, certified courses, tools and SOP redesign for Rp150.000.',
    url: 'https://instructjet.com/leadership',
  },
};

export default function LeadershipPage() {
  return (
    <div className={`${display.variable} ${body.variable} font-(family-name:--font-body)`}>
      <Navbar />
      <LeadershipLanding />
      <Footer />
    </div>
  );
}
