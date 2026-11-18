// app/leadership-info/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadershipInfoClient from '@/components/program/LeadershipInfoClient';

export const metadata: Metadata = {
  title: 'Leadership Info – Business Support Program',
  robots: { index: false, follow: false },
};

export default function LeadershipInfoPage() {
  return (
    <>
      <Navbar />
      <LeadershipInfoClient />
      <Footer />
    </>
  );
}
