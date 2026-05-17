import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import EditGuideForm from '@/components/EditGuideForm';

interface EditGuidePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditGuidePage({ params }: EditGuidePageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  const user = await getUserFromSession(sessionToken);
  if (!user) redirect('/login');

  // ✅ Include user_id in the select to check ownership
  const { data: guide, error } = await supabaseAdmin
    .from('guides')
    .select('id, title, content, total_token_budget, token_budget_remaining, user_id')
    .eq('slug', slug)
    .single();

  if (error || !guide) {
    console.error('Error fetching guide:', error);
    notFound();
  }

  // Now guide.user_id exists
  if (guide.user_id !== user.id) {
    redirect('/guides');
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Guide</h1>
          <EditGuideForm
            guideId={guide.id}
            initialTitle={guide.title}
            initialContent={guide.content}
            initialTokenBudget={guide.total_token_budget || 0}
          />
        </div>
      </div>
    </main>
  );
}