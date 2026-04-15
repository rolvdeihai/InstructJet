// src/app/guides/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import GuideView from '@/components/GuideView';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkerChat from '@/components/WorkerChat';

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: guide, error } = await supabaseAdmin
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{guide.title}</h1>
          <div className="prose max-w-none">
            {/* The content is markdown; we'll render it in the client component */}
            <GuideView content={guide.content} />
          </div>
        </div>
        {/* Worker chat and upload area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions or clarifications?</h2>
          {/* We'll add a client component for worker interaction */}
          <WorkerChat guideId={guide.id} guideTitle={guide.title} />
        </div>
      </div>
      <Footer />
    </main>
  );
}