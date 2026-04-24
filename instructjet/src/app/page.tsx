// src/app/page.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';  // ✅ ADD THIS IMPORT
import PayPalSubscribeButton from '@/components/PaypalSubscribeButton'; // ✅ Ensure file name matches (or rename file to PayPalSubscribeButton.tsx)
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-linear-to-br from-primary-600 via-blue-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Create Clear Task Guides with AI
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            InstructJet helps managers and teachers generate step-by-step guides, share them with a link, and let workers upload evidence for AI feedback.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-bold hover:shadow-xl transition transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold hover:bg-white/30 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create and manage tasks
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered guide generation, worker interaction, and feedback in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Guide Generation',
                desc: 'Describe your task, and AI will create a clear, step-by-step guide with diagrams.'
              },
              {
                icon: '💬',
                title: 'Worker Chat',
                desc: 'Workers can ask AI for clarification or upload photos/videos to get feedback.'
              },
              {
                icon: '🔗',
                title: 'Shareable Links',
                desc: 'Each guide gets a unique slug. Share it instantly with your team or students.'
              },
              {
                icon: '📊',
                title: 'AI Scoring',
                desc: 'Upload work; AI checks for completeness and suggests improvements.'
              },
              {
                icon: '🎯',
                title: 'Editable Guides',
                desc: 'Refine the AI-generated guide to match your exact requirements.'
              },
              {
                icon: '💰',
                title: 'Token System',
                desc: 'Pay only for what you use. Subscription or one-time token packs available.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-500">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5,000 tokens/month</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 3 active guides</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic AI feedback</li>
                <li className="flex items-center text-gray-400"><span className="text-gray-400 mr-2">✗</span> Priority support</li>
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
            </div>
            {/* Basic Plan */}
            <div className="bg-white border-2 border-primary-600 rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$29<span className="text-lg font-normal text-gray-500">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 50,000 tokens/month</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited guides</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Advanced AI feedback</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Email support</li>
              </ul>
              <Link href="/pricing" className="block text-center bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition">
                Choose Plan
              </Link>
            </div>
            {/* Premium Plan */}
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$19<span className="text-lg font-normal text-gray-500">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 1,000,000 tokens/month</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited guides</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Priority AI feedback</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Priority support & onboarding</li>
              </ul>
              {loading ? (
                <div className="text-center py-3">Loading...</div>
              ) : user ? (
                user.plan_tier === 'premium' ? (
                  <button disabled className="w-full bg-gray-400 text-white py-3 rounded-xl">
                    Current Plan
                  </button>
                ) : (
                  <PayPalSubscribeButton
                    userId={user.id}
                    onSuccess={() => {
                      alert('Subscription successful! Refreshing...');
                      window.location.reload();
                    }}
                    onError={(err: any) => alert(err)}
                  />
                )
              ) : (
                <Link href="/signup" className="block text-center bg-primary-600 text-white py-3 rounded-xl">
                  Sign up to subscribe
                </Link>
              )}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            All plans include access to token packs. Need more tokens? <Link href="/token-packs" className="text-primary-600 hover:underline">Buy token packs</Link>.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to streamline your task management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of managers and teachers using InstructJet.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}