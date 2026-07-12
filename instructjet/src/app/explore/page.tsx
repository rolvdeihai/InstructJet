'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  UserIcon,
  TagIcon,
  ClockIcon,
  FireIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

type ExploreItem = {
  type: 'guide' | 'listing';
  id: string;
  listingId?: string;
  slug: string;
  title: string;
  content: string;
  description?: string;
  category?: string;
  price?: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    full_name: string;
  };
};

export default function ExplorePage() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'sale' | 'public'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchExploreItems();
  }, []);

  const fetchExploreItems = async () => {
    try {
      const res = await fetch('/api/explore');
      if (!res.ok) {
        throw new Error('Failed to fetch explore items');
      }
      const data = await res.json();
      const fetchedItems: ExploreItem[] = data.items || [];
      setItems(fetchedItems);

      // Extract unique categories from listings
      const cats = fetchedItems
        .filter(item => item.type === 'listing' && item.category)
        .map(item => item.category as string);
      const uniqueCats = Array.from(new Set(cats));
      setCategories(uniqueCats);
    } catch (err: any) {
      console.error('Explore error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Tab filter
    if (activeTab === 'sale') {
      filtered = filtered.filter(item => item.type === 'listing');
    } else if (activeTab === 'public') {
      filtered = filtered.filter(item => item.type === 'guide');
    }
    // 'recent' shows all, sorted by date

    // Category filter (only for listings)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.type === 'listing' && item.category === selectedCategory
      );
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.content && item.content.toLowerCase().includes(term)) ||
        item.user.full_name.toLowerCase().includes(term) ||
        item.user.username.toLowerCase().includes(term)
      );
    }

    // Sort by created_at (newest first)
    filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return filtered;
  }, [items, activeTab, selectedCategory, searchTerm]);

  // Clear search
  const clearSearch = () => setSearchTerm('');

  // Loading skeletons
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-200 rounded-lg mb-8" />
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="h-10 w-32 bg-gray-200 rounded-full" />
              <div className="h-10 w-32 bg-gray-200 rounded-full" />
              <div className="h-10 w-32 bg-gray-200 rounded-full" />
              <div className="h-10 w-48 bg-gray-200 rounded-full ml-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 h-64">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero / Header Section with gradient */}
      <section className="relative pt-24 pb-8 px-6 overflow-hidden bg-gradient-to-br from-primary-600 via-blue-700 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-300 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Explore Guides
          </h1>
          <p className="text-blue-100 text-lg">
            Discover community‑created guides and premium listings
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-20 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search guides, authors, categories..."
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Category Filter (only if categories exist) */}
            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ClockIcon className="h-4 w-4" />
              Recent
            </button>
            <button
              onClick={() => setActiveTab('sale')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'sale'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBagIcon className="h-4 w-4" />
              For Sale
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'public'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <DocumentTextIcon className="h-4 w-4" />
              Public Guides
            </button>

            {/* Stats */}
            <div className="ml-auto text-sm text-gray-500 flex items-center gap-2">
              <span className="font-medium">{filteredItems.length}</span>
              <span>result{filteredItems.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <FunnelIcon className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No guides or listings match your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setActiveTab('recent');
                }}
                className="mt-2 text-primary-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.type === 'guide' ? `g-${item.id}` : `l-${item.listingId}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  {/* Card content */}
                  <div className="p-6 flex flex-col h-full">
                    {/* Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.type === 'listing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type === 'listing' ? 'For Sale' : 'Public Guide'}
                      </span>
                      {item.category && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <Link href={item.type === 'guide' ? `/guides/${item.slug}` : `/listing/${item.listingId}`} className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {item.type === 'listing' ? item.description : item.content?.slice(0, 150)}
                      </p>
                      {item.type === 'listing' && item.price && (
                        <p className="text-lg font-bold text-primary-600">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                    </Link>

                    {/* Author & Date */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/profile/${item.user.username}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>{item.user.full_name || item.user.username}</span>
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}