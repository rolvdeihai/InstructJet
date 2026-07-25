// app/pricing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<'subscription' | 'token' | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Paddle checkout handlers
  const handleSubscription = async () => {
    if (!user) return;
    setCheckoutLoading('subscription');
    try {
      const res = await fetch('/api/paddle/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID 
        }),
      });

      // 👇 Handle 401 Unauthorized
      if (res.status === 401) {
        // Optionally sign out the user (if you have a logout function)
        // await logout(); 
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      alert('Failed to start subscription. Please try again.');
      console.error(error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleTokenPurchase = async () => {
    if (!user) return;
    setCheckoutLoading('token');
    try {
      const res = await fetch('/api/paddle/create-token-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_PADDLE_TOKEN_PRICE_ID 
        }),
      });

      // 👇 Handle 401 Unauthorized
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      alert('Failed to start token purchase. Please try again.');
      console.error(error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6 bg-linear-to-br from-primary-600 via-blue-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              Choose the plan that fits your needs. Start free and upgrade anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-md transition-transform hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mt-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    5,000 tokens/month
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    3 active guides
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic AI feedback
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Limited AI model
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI-powered guide generation
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Worker chat with AI
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block text-center bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Get Started
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="relative bg-white border-2 border-primary-600 rounded-2xl p-8 shadow-lg transition-transform hover:scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  Recommended
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="mt-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1,000,000 tokens/month
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited guides
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority AI feedback
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Better & faster AI model
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Everything in Free
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Team member access
                  </li>
                </ul>
                {authLoading ? (
                  <div className="text-center py-3">Loading...</div>
                ) : user ? (
                  user.plan_tier === 'premium' ? (
                    <button disabled className="w-full bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscription}
                      disabled={checkoutLoading === 'subscription'}
                      className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkoutLoading === 'subscription' ? 'Redirecting...' : 'Subscribe Now'}
                    </button>
                  )
                ) : (
                  <Link href="/signup" className="block text-center bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition">
                    Sign up to subscribe
                  </Link>
                )}
              </div>
            </div>

            {/* Token Packs Section with Paddle button */}
            <div className="mt-20 border-t pt-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Need extra tokens?</h2>
                <p className="text-gray-600 mt-2">
                  One‑time purchase – never expire. Perfect for high‑volume usage.
                </p>
              </div>
              <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-8 shadow-md text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">250,000 Tokens</div>
                <div className="text-2xl font-bold text-gray-900 mb-6">$5 USD</div>
                <div className="mb-6 text-sm text-gray-500">
                  Use tokens for task creation, worker chat, AI model calls, and more.
                </div>

                {authLoading ? (
                  <div className="text-center py-3">Loading...</div>
                ) : user ? (
                  <button
                    onClick={handleTokenPurchase}
                    disabled={checkoutLoading === 'token'}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading === 'token' ? 'Redirecting...' : 'Buy 250,000 Tokens ($5)'}
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    className="block w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition"
                  >
                    Sign up to buy tokens
                  </Link>
                )}
              </div>
            </div>

            {/* Original link – keep for consistency */}
            <div className="mt-16 text-center">
              <p className="text-gray-600">
                Need more tokens?{' '}
                <Link href="/token-packs" className="text-primary-600 hover:underline font-medium">
                  Buy token packs
                </Link>{' '}
                – one-time purchase, never expire.
              </p>
            </div>

            {/* FAQ */}
            <div className="mt-20 text-center border-t pt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="max-w-2xl mx-auto text-left space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Can I switch plans later?</h4>
                  <p className="text-gray-600">Yes, you can upgrade or downgrade anytime from your account settings.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">What happens to my tokens if I downgrade?</h4>
                  <p className="text-gray-600">Subscription tokens reset monthly based on your plan. Any unused package tokens remain.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Do you offer refunds?</h4>
                  <p className="text-gray-600">We offer a 14-day money-back guarantee for monthly subscriptions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-primary-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your workflow?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of managers and teachers using InstructJet.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}