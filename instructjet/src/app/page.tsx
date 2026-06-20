// app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubscription = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/paddle/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID,
        }),
      });
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
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-primary-600 via-blue-700 to-primary-800">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-300 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-6">
              ⚡ AI-Powered Guide Creation
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-white mb-6">
              Stop guessing.
              <span className="block text-amber-200">Start guiding.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Turn vague instructions into clear, step‑by‑step guides with AI. 
              Eliminate rework, improve team alignment, and get work done faster.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="bg-white text-primary-700 px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
              >
                🚀 Start Free Trial
              </Link>
              <Link
                href="#pain-points"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/30 transition"
              >
                See How It Works
              </Link>
            </div>
            <p className="mt-6 text-sm text-blue-200 opacity-80">
              No credit card required · Free tier available · 14‑day premium trial
            </p>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L60 46.7C120 53.3 240 66.7 360 66.7C480 66.7 600 53.3 720 46.7C840 40 960 40 1080 46.7C1200 53.3 1320 66.7 1380 73.3L1440 80V120H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── PAIN POINTS ────────────────────────────────────────────── */}
      <section id="pain-points" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Why instructions always fail
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miscommunication between managers and workers costs time, money, and morale.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100 hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="text-4xl mb-4">😵</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Vague Instructions</h3>
              <p className="text-gray-600">“Make it better” – but what does ‘better’ mean? Workers spend hours guessing.</p>
              <div className="mt-4 text-sm text-red-600 font-semibold">↓ 40% productivity loss</div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Endless Rework</h3>
              <p className="text-gray-600">Mismatched expectations lead to multiple revisions, killing momentum.</p>
              <div className="mt-4 text-sm text-amber-600 font-semibold">3x more time than needed</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🤷</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Feedback Loop</h3>
              <p className="text-gray-600">Managers don’t see progress until it's too late – and workers feel left in the dark.</p>
              <div className="mt-4 text-sm text-blue-600 font-semibold">47% of projects miss deadlines</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTION ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              How InstructJet bridges the gap
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From confusion to clarity – in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">1. Describe Your Task</h3>
              <p className="text-gray-600">Just tell the AI what you need – it asks clarifying questions to get the full picture.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">2. AI Generates a Guide</h3>
              <p className="text-gray-600">Instant, structured, step‑by‑step guide with sections, tips, and even flowcharts.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3. Share & Verify</h3>
              <p className="text-gray-600">Workers follow the guide, submit evidence, and get AI‑powered feedback instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES (enhanced) ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Built for real‑world teams
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Guide Generation',
                desc: 'Generate comprehensive, structured guides in minutes – not hours.',
                highlight: 'Saves 80% of drafting time',
              },
              {
                icon: '💬',
                title: 'Worker Chat & AI Help',
                desc: 'Workers can ask questions and get instant AI support without interrupting you.',
                highlight: 'Reduces support tickets by 60%',
              },
              {
                icon: '📊',
                title: 'AI Scoring & Feedback',
                desc: 'Automatically evaluate submissions against your criteria – consistent and fair.',
                highlight: '70% faster review cycles',
              },
              {
                icon: '🔗',
                title: 'Shareable Links',
                desc: 'Every guide gets a unique, permanent link – perfect for emails, LMS, or Slack.',
                highlight: 'Zero friction sharing',
              },
              {
                icon: '🎯',
                title: 'Editable & Iterative',
                desc: 'Refine the guide as you learn – the AI adapts to your feedback.',
                highlight: 'Continuous improvement',
              },
              {
                icon: '💰',
                title: 'Fair Token System',
                desc: 'Pay only what you use with monthly subscriptions or one‑time token packs.',
                highlight: 'No hidden fees',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gray-50 hover:bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-200"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
                <div className="mt-4 text-xs font-semibold text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-full">
                  ⚡ {feature.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATISTICS ────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-primary-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold">500+</div>
              <div className="text-sm opacity-80 mt-1">Active Teams</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">2,400+</div>
              <div className="text-sm opacity-80 mt-1">Guides Created</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">94%</div>
              <div className="text-sm opacity-80 mt-1">Worker Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">4.9★</div>
              <div className="text-sm opacity-80 mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              What our users say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">JD</div>
                <div>
                  <div className="font-bold text-gray-800">Jessica Diaz</div>
                  <div className="text-sm text-gray-500">Team Lead, DesignOps</div>
                </div>
              </div>
              <p className="text-gray-600 italic">“InstructJet cut our onboarding time by half. New hires now follow clear guides without constantly interrupting senior staff – a game changer.”</p>
              <div className="mt-4 text-amber-400 text-sm">★★★★★</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">MC</div>
                <div>
                  <div className="font-bold text-gray-800">Mark Chen</div>
                  <div className="text-sm text-gray-500">Product Manager, SaaS</div>
                </div>
              </div>
              <p className="text-gray-600 italic">“I used to spend hours clarifying requirements. Now I just generate a guide and share it. The AI feedback on worker submissions is incredible.”</p>
              <div className="mt-4 text-amber-400 text-sm">★★★★★</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">AT</div>
                <div>
                  <div className="font-bold text-gray-800">Aisha Thompson</div>
                  <div className="text-sm text-gray-500">Education Program Manager</div>
                </div>
              </div>
              <p className="text-gray-600 italic">“Students love the clarity of the guides. The token system means I only pay for what I use – perfect for our variable class sizes.”</p>
              <div className="mt-4 text-amber-400 text-sm">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER / JETHRO ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl mx-auto md:mx-0">
              JL
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">About the Founder</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Jethro Lim</h2>
            <p className="text-gray-600 leading-relaxed">
              Jethro is a software engineer and digital marketer who saw the same communication breakdowns 
              happen in every team he worked with. After countless hours spent clarifying instructions 
              and fixing misaligned work, he built <strong>InstructJet</strong> to empower managers and 
              workers with clear, AI‑generated guides. His mission: <strong>turn confusion into clarity</strong>.
            </p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <Link href="/about" className="text-primary-600 hover:underline font-medium">Read Full Story →</Link>
              <a href="https://linkedin.com/in/jethrolim" target="_blank" rel="noopener" className="text-gray-500 hover:text-gray-700">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to create your first guide?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of managers and educators who already use InstructJet.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Start Free Trial
          </Link>
          <p className="mt-4 text-sm opacity-75">No credit card required · Free forever tier</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}