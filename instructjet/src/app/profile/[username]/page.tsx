// src/app/profile/[username]/page.tsx
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = await params;

  // Find user by username (derived from email or custom field)
  // Since we don't have a username column in users, we'll derive from email or use a custom field
  // For now, we'll query by email prefix or just fetch user by id? Better to have a username column.
  // We'll assume we added a username column to users or we use profiles. Given the complexity, we'll switch to using profiles again but with user_id.
  // But you haven't updated the schema. Let's keep using profiles if you have them.

  // Actually, you have a profiles table with username, but it's failing to insert. Let's fix the insert first.
  // For now, I'll assume you have profiles with user_id.
  // We'll query profiles by username.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('user_id, username, full_name, avatar_url, bio')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch user's public guides
  const { data: guides } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, content, created_at, total_token_budget, token_budget_remaining')
    .eq('user_id', profile.user_id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
              {profile.full_name?.[0] || profile.username[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.full_name || profile.username}</h1>
              <p className="text-gray-500">@{profile.username}</p>
              {profile.bio && <p className="mt-2 text-gray-700">{profile.bio}</p>}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides by {profile.full_name || profile.username}</h2>
        {!guides || guides.length === 0 ? (
          <p className="text-gray-500">No public guides yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">
                <Link href={`/guides/${guide.slug}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{guide.content?.slice(0, 150)}...</p>
                  <p className="text-xs text-gray-400 mt-2">Created {new Date(guide.created_at).toLocaleDateString()}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}