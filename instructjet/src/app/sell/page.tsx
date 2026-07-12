'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { validateGuideContent, validateListingDetails } from '@/lib/validation';

export default function SellPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [privateGuides, setPrivateGuides] = useState<any[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [guideDetails, setGuideDetails] = useState<{ title: string; content: string } | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guideValidationErrors, setGuideValidationErrors] = useState<string[]>([]);
  const [listingValidationErrors, setListingValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchPrivateGuides();
      setContactInfo(user.email || '');
    }
  }, [user, authLoading, router]);

  const fetchPrivateGuides = async () => {
    try {
      const res = await fetch('/api/user/guides?private=true');
      if (res.ok) {
        const data = await res.json();
        setPrivateGuides(data.guides);
        if (data.guides.length > 0) {
          setSelectedGuideId(data.guides[0].id);
          await fetchGuideDetails(data.guides[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGuideDetails = async (guideId: string) => {
    try {
      const res = await fetch(`/api/guide/${guideId}`);
      if (res.ok) {
        const data = await res.json();
        setGuideDetails({ title: data.title, content: data.content });
        // Validate guide content
        const errors = validateGuideContent(data.title, data.content);
        setGuideValidationErrors(errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedGuideId(id);
    const guide = privateGuides.find(g => g.id === id);
    if (guide) {
      fetchGuideDetails(id);
    }
  };

  // Re-validate listing details whenever description or category changes
  useEffect(() => {
    if (description || category) {
      const errors = validateListingDetails(description, category);
      setListingValidationErrors(errors);
    } else {
      setListingValidationErrors([]);
    }
  }, [description, category]);

  const allErrors = [...guideValidationErrors, ...listingValidationErrors];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Re-validate all
    if (guideDetails) {
      const contentErrors = validateGuideContent(guideDetails.title, guideDetails.content);
      setGuideValidationErrors(contentErrors);
    }
    const listingErrors = validateListingDetails(description, category);
    setListingValidationErrors(listingErrors);

    if (allErrors.length > 0) {
      return;
    }

    if (!selectedGuideId) {
      setError('Please select a private guide');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!contactInfo.trim()) {
      setError('Contact info is required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: selectedGuideId,
          description,
          category,
          contactInfo,
          price: parseFloat(price),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }
      alert('Listing created successfully! It will be active for 7 days.');
      router.push('/explore');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sell a Guide</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-4">
            List your <strong>private</strong> guide for sale. A one-time fee of <strong>5,000 tokens</strong> will be deducted. The listing will be active for 7 days.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Private Guide</label>
              <select
                value={selectedGuideId}
                onChange={handleGuideChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              >
                {privateGuides.length === 0 ? (
                  <option value="">No private guides available</option>
                ) : (
                  privateGuides.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))
                )}
              </select>
              {privateGuides.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  You don't have any private guides. <Link href="/create" className="text-primary-600">Create one</Link> and set it to private.
                </p>
              )}
              {guideValidationErrors.length > 0 && (
                <div className="mt-2 text-sm text-red-600 space-y-1">
                  {guideValidationErrors.map((err, i) => <p key={i}>⚠️ {err}</p>)}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe what your guide offers..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Cooking, Tech, Fitness"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Info (email or phone)</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Email or phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (in USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                required
              />
            </div>
            {listingValidationErrors.length > 0 && (
              <div className="text-sm text-red-600 space-y-1">
                {listingValidationErrors.map((err, i) => <p key={i}>⚠️ {err}</p>)}
              </div>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || privateGuides.length === 0 || allErrors.length > 0}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Listing (5,000 tokens)'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}