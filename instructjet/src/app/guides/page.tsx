import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function GuidesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;
  const user = await getUserFromSession(sessionToken);
  if (!user) redirect('/login');

  const { data: guides, error } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, created_at, total_token_budget, token_budget_remaining')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guides:', error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Guides</h1>
          <Link
            href="/create"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Create New Guide
          </Link>
        </div>
        {!guides || guides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">You haven't created any guides yet.</p>
            <Link href="/create" className="text-primary-600 hover:underline mt-2 inline-block">
              Create your first guide
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
                <Link href={`/guides/${guide.slug}`} className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h2>
                  <p className="text-sm text-gray-500 mb-1">
                    Created {new Date(guide.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      🪙 Budget: {guide.token_budget_remaining || 0} / {guide.total_token_budget || 0} tokens
                    </span>
                  </div>
                </Link>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/guides/${guide.slug}/edit`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Edit Guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}