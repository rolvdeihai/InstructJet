// src/app/guides/[slug]/page.tsx
import { notFound } from 'next/navigation';
import GuideView from '@/components/GuideView';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkerChat from '@/components/WorkerChat';
import PasswordGate from '@/components/PasswordGate';
import { ViewTracker } from '@/components/ViewTracker';

// Server‑side data fetching via internal API
async function getGuide(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/guide/slug/${slug}`, {
    cache: 'no-store', // use 'force-cache' if you want to cache the result
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.guide;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    notFound();
  }

  const isPrivate = guide.is_public === false;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* View Tracker – increments view count on client side */}
      <ViewTracker type="guide" id={guide.id} />

      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{guide.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            👁️ {guide.views || 0} views
          </div>
          {isPrivate ? (
            <PasswordGate guideId={guide.id} guideSlug={guide.slug}>
              <GuideView content={guide.content} />
            </PasswordGate>
          ) : (
            <div className="prose max-w-none">
              <GuideView content={guide.content} />
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions or clarifications?</h2>
          <WorkerChat guideId={guide.id} guideTitle={guide.title} />
        </div>
      </div>
      <Footer />
    </main>
  );
}