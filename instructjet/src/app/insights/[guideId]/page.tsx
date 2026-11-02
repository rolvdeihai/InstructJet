// src/app/insights/[guideId]/page.tsx
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamInsightsClient from '@/components/TeamInsightsClient';

export default async function InsightsPage({ params }: { params: Promise<{ guideId: string }> }) {
  const { guideId } = await params;
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get('instructjet_session')?.value);
  if (!user) redirect('/login');

  const { data: guide } = await supabaseAdmin
    .from('guides')
    .select('id, user_id')
    .eq('id', guideId)
    .single();
  if (!guide) notFound();
  if (guide.user_id !== user.id) redirect('/guides');

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <TeamInsightsClient guideId={guide.id} />
      <Footer />
    </main>
  );
}
