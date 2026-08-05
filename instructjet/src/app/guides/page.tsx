'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  DocumentTextIcon,
  ShoppingBagIcon,
  EyeIcon,
  TrashIcon,
  PlusCircleIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function GuidesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [guides, setGuides] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guides' | 'listings'>('guides');
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [password, setPassword] = useState('');
  const [copiedGuideId, setCopiedGuideId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchGuides();
      fetchListings();
    }
  }, [user, authLoading, router]);

  const fetchGuides = async () => {
    try {
      const res = await fetch('/api/user/guides');
      if (res.ok) {
        const data = await res.json();
        setGuides(data.guides);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/user/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (guide: any) => {
    setEditingGuideId(guide.id);
    setIsPublic(guide.is_public);
    setPassword('');
  };

  const closeEdit = () => {
    setEditingGuideId(null);
    setPassword('');
  };

  const savePrivacy = async (guideId: string) => {
    if (!isPublic && !password) {
      alert('Please enter a password for private guide');
      return;
    }
    try {
      const res = await fetch('/api/guide/update-privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guideId, 
          isPublic, 
          password: isPublic ? undefined : password 
        }),
      });
      if (res.ok) {
        await fetchGuides();
        closeEdit();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update');
      }
    } catch (err) {
      alert('Error updating privacy');
    }
  };

  const removeListing = async (listingId: string) => {
    if (!confirm('Remove this listing? It will no longer appear in Explore.')) return;
    try {
      const res = await fetch('/api/listing/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        setListings(listings.filter(l => l.id !== listingId));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to remove listing');
      }
    } catch (err) {
      alert('Error removing listing');
    }
  };

  const copyGuideLink = async (slug: string, guideId: string) => {
    const url = `${window.location.origin}/guides/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedGuideId(guideId);
      setTimeout(() => setCopiedGuideId(null), 2000);
    } catch (err) {
      // Fallback: prompt user to copy manually
      prompt('Copy this link to share:', url);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Guides</h1>
          <Link href="/create" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Create New Guide
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'guides'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5" />
            My Guides ({guides.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'listings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBagIcon className="h-5 w-5" />
            My Listings ({listings.length})
          </button>
        </div>

        {activeTab === 'guides' && (
          <>
            {guides.length === 0 ? (
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
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <EyeIcon className="h-3 w-3" />
                          {guide.views || 0} views
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded ${guide.is_public ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {guide.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link href={`/guides/${guide.slug}/edit`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Edit
                      </Link>
                      {!guide.is_public && (
                        <Link href={`/sell?guide=${guide.id}`} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                          Sell
                        </Link>
                      )}
                      <button
                        onClick={() => openEdit(guide)}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Privacy
                      </button>
                      {/* Share button */}
                      <button
                        onClick={() => copyGuideLink(guide.slug, guide.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        title="Copy share link"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {copiedGuideId === guide.id ? (
                          <span className="text-green-600">Copied!</span>
                        ) : (
                          'Share'
                        )}
                      </button>
                    </div>

                    {editingGuideId === guide.id && (
                      <div className="mt-4 border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Public:</label>
                          <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                          />
                        </div>
                        {!isPublic && (
                          <div>
                            <label className="text-sm font-medium">Password:</label>
                            <input
                              type="text"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="ml-2 px-2 py-1 border rounded"
                              placeholder="Enter password"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => savePrivacy(guide.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={closeEdit}
                            className="px-3 py-1 bg-gray-300 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'listings' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                {listings.length} active listing{listings.length !== 1 ? 's' : ''}
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Sell More Guides
              </Link>
            </div>
            {listings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-gray-500 text-lg">You haven't listed any guides for sale yet.</p>
                <Link href="/sell" className="text-primary-600 hover:underline mt-2 inline-block">
                  Create a listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
                    <Link href={`/listing/${listing.id}`} className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{listing.guide_title}</h2>
                      <p className="text-sm text-gray-500 line-clamp-2">{listing.description || 'No description'}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <EyeIcon className="h-3 w-3" />
                          {listing.views || 0} views
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          ${listing.price}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${
                          new Date(listing.active_until) > new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {new Date(listing.active_until) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </div>
                    </Link>
                    <div className="mt-4 flex justify-between items-center">
                      <Link href={`/listing/${listing.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View Listing
                      </Link>
                      <button
                        onClick={() => removeListing(listing.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Remove Listing"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}