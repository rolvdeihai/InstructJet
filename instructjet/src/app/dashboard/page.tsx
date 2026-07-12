// src/app/dashboard/page.tsx

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  PlusCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  Cog6ToothIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

interface TokenBalance {
  subscription_tokens: number;
  package_tokens: number;
  month_year: string | null;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    // Trigger entrance animation
    setIsVisible(true);
  }, [user, authLoading, router]);

  // Fetch token balance
  useEffect(() => {
    if (user) {
      fetchTokenBalance();
    }
  }, [user]);

  const fetchTokenBalance = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setTokenBalance(data.tokenBalance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const totalTokens = (tokenBalance?.subscription_tokens || 0) + (tokenBalance?.package_tokens || 0);

  // Stats based on real token data
  const stats = [
    {
      label: 'Subscription Tokens',
      value: tokenBalance?.subscription_tokens?.toLocaleString() || '0',
      sub: tokenBalance?.month_year
        ? `Resets: ${new Date(tokenBalance.month_year + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
        : 'Monthly reset',
      icon: SparklesIcon,
      color: 'text-blue-600',
      bg: 'from-blue-50 to-indigo-50',
    },
    {
      label: 'Package Tokens',
      value: tokenBalance?.package_tokens?.toLocaleString() || '0',
      sub: 'One‑time purchase, never expire',
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bg: 'from-green-50 to-emerald-50',
    },
    {
      label: 'Total Available',
      value: totalTokens.toLocaleString(),
      sub: 'Ready to use',
      icon: SparklesIcon,
      color: 'text-amber-600',
      bg: 'from-amber-50 to-orange-50',
    },
  ];

  const actions = [
    {
      title: 'Create New Guide',
      description: 'Start a new task guide using AI assistance.',
      href: '/create',
      icon: PlusCircleIcon,
      bgGradient: 'from-primary-500 to-primary-700',
      textColor: 'text-white',
    },
    {
      title: 'My Guides',
      description: 'View and manage your existing guides.',
      href: '/guides',
      icon: DocumentTextIcon,
      bgGradient: 'from-blue-500 to-blue-700',
      textColor: 'text-white',
    },
    {
      title: 'Explore',
      description: 'Discover guides created by the community.',
      href: '/explore',
      icon: GlobeAltIcon,
      bgGradient: 'from-teal-500 to-cyan-700',
      textColor: 'text-white',
    },
    {
      title: 'Sell a Guide',
      description: 'List your private guide for sale.',
      href: '/sell',
      icon: ShoppingCartIcon,
      bgGradient: 'from-amber-500 to-orange-700',
      textColor: 'text-white',
    },
    {
      title: 'Work Submissions',
      description: 'See photos and videos from workers who followed your guides.',
      href: '/submissions',
      icon: PhotoIcon,
      bgGradient: 'from-green-500 to-green-700',
      textColor: 'text-white',
    },
    {
      title: 'Settings',
      description: 'Manage your account and preferences.',
      href: '/settings',
      icon: Cog6ToothIcon,
      bgGradient: 'from-purple-500 to-purple-700',
      textColor: 'text-white',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero / Header Section with gradient and wave */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden bg-gradient-to-br from-primary-600 via-blue-700 to-primary-800">
        {/* Animated background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-300 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-4">
                  👋 Welcome back
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                  {user.full_name || user.email}!
                </h1>
                <p className="text-blue-100 mt-1 text-lg">
                  Your dashboard is ready. Let’s make today productive.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/create"
                  className="bg-white text-primary-700 px-6 py-2.5 rounded-full font-bold hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  New Guide
                </Link>
              </div>
            </div>

            {/* Token Stats Cards (matching settings style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-white/30 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick buy tokens link */}
            <div className="mt-4 text-right">
              <Link
                href="/token-packs"
                className="text-sm text-blue-200 hover:text-white transition-colors underline underline-offset-2"
              >
                Buy more tokens →
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 40L60 46.7C120 53.3 240 66.7 360 66.7C480 66.7 600 53.3 720 46.7C840 40 960 40 1080 46.7C1200 53.3 1320 66.7 1380 73.3L1440 80V80H0V40Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Action Cards */}
      <div className="max-w-6xl mx-auto px-6 -mt-6 relative z-20 pb-16">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-90 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative p-6 text-white">
                  <div className="mb-4 inline-block p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <action.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{action.title}</h2>
                  <p className="text-sm text-white/80">{action.description}</p>
                  <div className="mt-4 flex items-center text-sm font-semibold">
                    <span>Get started</span>
                    <svg
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick tip placeholder */}
        <div
          className={`mt-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold">Quick Tip</h3>
            </div>
            <p className="text-gray-600 text-sm">
              💡 You can generate a guide from any task description. Just click <strong>“Create New Guide”</strong> and let AI do the heavy lifting.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}