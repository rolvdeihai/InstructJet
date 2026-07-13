'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  UserIcon,
  ClockIcon,
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
  language?: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    full_name: string;
  };
};

const LANGUAGES = [
  { code: '', label: 'All Languages', flag: '🌍' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'id', label: 'Indonesian', flag: '🇮🇩' },
];

const getLanguageDisplay = (code: string) => {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang ? `${lang.flag} ${lang.label}` : '🌍 Unknown';
};

export default function ExplorePage() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'sale' | 'public'>('recent');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Reset and fetch first page when filters change
  const resetAndFetch = useCallback(async () => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    await fetchItems(1, true);
  }, [searchTerm, activeTab, selectedCategory, selectedLanguage]);

  const fetchItems = async (pageNum: number, replace = false) => {
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: '12',
        tab: activeTab,
        language: selectedLanguage,
        category: selectedCategory,
        search: searchTerm,
      });
      const res = await fetch(`/api/explore?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch');
      }
      const data = await res.json();
      const newItems = data.items || [];
      if (replace) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      setHasMore(data.hasMore || false);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  // Load more
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchItems(page + 1, false);
    setLoadingMore(false);
  };

  // Initial load and when filters change
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setError('');
      await fetchItems(1, true);
      setLoading(false);
    };
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeTab, selectedCategory, selectedLanguage]);

  // Fetch categories from all items (client‑side)
  useEffect(() => {
    // We'll fetch categories from the API on mount, or derive from items.
    // For simplicity, we can just collect from items.
    const cats = items
      .filter(item => item.type === 'listing' && item.category)
      .map(item => item.category as string);
    const uniqueCats = Array.from(new Set(cats));
    setCategories(uniqueCats);
  }, [items]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLanguage('');
    setActiveTab('recent');
  };

  if (loading && items.length === 0) {
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

      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-20 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none min-w-[180px]"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none min-w-[160px]"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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

            <div className="ml-auto text-sm text-gray-500 flex items-center gap-2">
              <span className="font-medium">{items.length}</span>
              <span>loaded</span>
              {selectedLanguage && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  {LANGUAGES.find(l => l.code === selectedLanguage)?.flag}
                </span>
              )}
            </div>
          </div>

          {/* Grid */}
          {items.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <FunnelIcon className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No guides or listings match your criteria</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-primary-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.type === 'guide' ? `g-${item.id}` : `l-${item.listingId}`}
                    className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                          item.type === 'listing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.type === 'listing' ? 'For Sale' : 'Public Guide'}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          {getLanguageDisplay(item.language || 'en')}
                        </span>
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

              {/* Load More */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}