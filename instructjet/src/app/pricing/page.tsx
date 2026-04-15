// app/pricing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Plan {
  name: string;
  tier: 'free' | 'basic' | 'premium';
  price: string;
  priceMonthly: number;
  tokens: string;
  guides: string;
  aiFeedback: string;
  support: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    tier: 'free',
    price: '$0',
    priceMonthly: 0,
    tokens: '5,000 tokens/month',
    guides: '3 active guides',
    aiFeedback: 'Basic AI feedback',
    support: 'Community support',
    features: [
      'AI-powered guide generation',
      'Worker chat with AI',
      'Basic AI scoring',
      'Shareable links',
    ],
    ctaText: 'Get Started',
    ctaLink: '/signup',
  },
  {
    name: 'Basic',
    tier: 'basic',
    price: '$29',
    priceMonthly: 29,
    tokens: '50,000 tokens/month',
    guides: 'Unlimited guides',
    aiFeedback: 'Advanced AI feedback',
    support: 'Email support',
    features: [
      'Everything in Free',
      'Priority AI processing',
      'Custom guide templates',
      'Team member access (up to 5)',
      'Export to PDF/Word',
    ],
    popular: true,
    ctaText: 'Choose Plan',
    ctaLink: '/checkout?plan=basic',
  },
  {
    name: 'Premium',
    tier: 'premium',
    price: '$99',
    priceMonthly: 99,
    tokens: '200,000 tokens/month',
    guides: 'Unlimited guides',
    aiFeedback: 'Priority AI feedback',
    support: 'Priority support & onboarding',
    features: [
      'Everything in Basic',
      'Unlimited team members',
      'API access',
      'Custom AI training',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    ctaText: 'Choose Plan',
    ctaLink: '/checkout?plan=premium',
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If you support yearly billing, you can multiply by 10 or 12 etc.
  const getPlanPrice = (plan: Plan) => {
    if (billingInterval === 'yearly') {
      const yearlyPrice = plan.priceMonthly * 10; // 2 months free
      return `$${yearlyPrice}`;
    }
    return plan.price;
  };

  const getPlanPeriod = () => {
    return billingInterval === 'monthly' ? '/month' : '/year';
  };

  // For authenticated users, if they already have a plan, maybe change CTA
  const getPlanCta = (plan: Plan) => {
    if (user && user.plan_tier === plan.tier) {
      return { text: 'Current Plan', link: '/settings', disabled: true };
    }
    if (user && plan.tier === 'free') {
      return { text: 'Downgrade to Free', link: '/settings?plan=free', disabled: false };
    }
    return { text: plan.ctaText, link: plan.ctaLink, disabled: false };
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

            {/* Billing Toggle (optional) */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  billingInterval === 'monthly'
                    ? 'bg-white text-primary-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  billingInterval === 'yearly'
                    ? 'bg-white text-primary-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Yearly <span className="text-xs opacity-80">(Save 17%)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const cta = getPlanCta(plan);
                return (
                  <div
                    key={plan.tier}
                    className={`relative bg-gray-50 rounded-2xl p-8 shadow-md transition-transform hover:scale-105 ${
                      plan.popular ? 'border-2 border-primary-600 shadow-lg' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                        Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mt-4 mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {getPlanPrice(plan)}
                      </span>
                      <span className="text-lg font-normal text-gray-500">
                        {getPlanPeriod()}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {plan.tokens}
                      </li>
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {plan.guides}
                      </li>
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {plan.aiFeedback}
                      </li>
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {plan.support}
                      </li>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={cta.link}
                      className={`block text-center py-3 rounded-xl font-bold transition ${
                        cta.disabled
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : plan.tier === 'free'
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                      onClick={(e) => {
                        if (cta.disabled) e.preventDefault();
                      }}
                    >
                      {cta.text}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Token packs upsell */}
            <div className="mt-16 text-center">
              <p className="text-gray-600">
                Need more tokens?{' '}
                <Link href="/token-packs" className="text-primary-600 hover:underline font-medium">
                  Buy token packs
                </Link>{' '}
                – one-time purchase, never expire.
              </p>
            </div>

            {/* FAQ teaser */}
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
              href="/signup"
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