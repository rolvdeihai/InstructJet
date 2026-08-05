// src/components/ChallengePopup.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LOGIN_LINK = "/login";

interface ChallengePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Bonus reward types – management/leadership/training themed
const BONUS_REWARDS: Record<string, { emoji: string; label: string; description: string }> = {
  ebook: {
    emoji: '📘',
    label: 'Exclusive Leadership E‑Book',
    description: '“The Art of Managing Remote Teams” – a 60‑page digital book with proven frameworks, case studies, and actionable strategies to lead high‑performance distributed teams.',
  },
  webinar: {
    emoji: '🎥',
    label: 'Live Webinar: “Coaching for Results”',
    description: 'Join our 90‑minute interactive session with industry experts on modern coaching techniques, feedback loops, and fostering a culture of continuous improvement.',
  },
  tokens: {
    emoji: '🪙',
    label: '250,000 Extra Tokens',
    description: 'Boost your account with a massive token bonus – perfect for creating more guides, AI‑powered analysis, and advanced features. Never expire!',
  },
  voucher: {
    emoji: '🎟️',
    label: 'Shopee Voucher (IDR 50K)',
    description: 'Redeemable for anything on Shopee – a little treat for your hard work. Valid for 3 months.',
  },
};

export default function ChallengePopup({ isOpen, onClose }: ChallengePopupProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [guideUrl, setGuideUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [status, setStatus] = useState<{
    canSubmit: boolean;
    alreadySubmitted: boolean;
    hasDeposit: boolean;
    hasListing?: boolean;
    depositDate?: string;
    weekStart?: string;
    submittedAt?: string;
    canClaim?: boolean;
    claimed?: boolean;
    bonusRewardType?: string | null;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Fetch status when popup opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/challenge/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        } else {
          setStatus({
            canSubmit: false,
            alreadySubmitted: false,
            hasDeposit: false,
            hasListing: false,
            canClaim: false,
            claimed: false,
            bonusRewardType: null,
          });
        }
      } catch (err) {
        console.error(err);
        setStatus({
          canSubmit: false,
          alreadySubmitted: false,
          hasDeposit: false,
          hasListing: false,
          canClaim: false,
          claimed: false,
          bonusRewardType: null,
        });
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, [isOpen]);

  // Deposit via Paddle token pack – same as pricing page
  const handleDeposit = async () => {
    if (!user) {
      router.push(LOGIN_LINK);
      return;
    }
    setDepositing(true);
    try {
      const res = await fetch('/api/paddle/create-token-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_PADDLE_TOKEN_PRICE_ID,
        }),
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Could not start deposit. Please try again.');
        console.error('No checkout URL', data);
      }
    } catch (error) {
      alert('Failed to start deposit. Please try again.');
      console.error(error);
    } finally {
      setDepositing(false);
    }
  };

  const handleCreateGuide = () => {
    if (!user) {
      router.push(LOGIN_LINK);
      return;
    }
    router.push('/create');
  };

  const handleSellGuide = () => {
    if (!user) {
      router.push(LOGIN_LINK);
      return;
    }
    router.push('/sell');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideUrl.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/challenge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guide_url: guideUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Guide submitted! Your certificate will be generated after the 7‑day holding period.`);
        setGuideUrl('');
        // Refresh status
        const statusRes = await fetch('/api/challenge/status');
        if (statusRes.ok) setStatus(await statusRes.json());
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaim = () => {
    const bonus = status?.bonusRewardType ? BONUS_REWARDS[status.bonusRewardType] : null;
    const subject = encodeURIComponent("🏆 I completed the Guide Creator Challenge – claim my rewards!");
    const body = encodeURIComponent(
      `Hello Jethro! 👋\n\n` +
      `I successfully completed all 5 steps of the Guide Creator Challenge:\n` +
      `✅ Deposited $5\n` +
      `✅ Created and sold a guide\n` +
      `✅ Submitted my guide URL\n` +
      `✅ Waited 7 days without withdrawing\n` +
      `✅ I'm ready to claim my GUARANTEED rewards:\n` +
      `   📜 Certificate of Achievement\n` +
      `   🪙 250,000 tokens\n\n` +
      (bonus
        ? `PLUS my BONUS reward: ${bonus.emoji} ${bonus.label} – ${bonus.description}\n\n`
        : `(Bonus reward will be assigned upon verification.)\n\n`) +
      `Here is my guide URL: ${guideUrl || "[insert your guide URL]"}\n` +
      `My user ID: ${user?.id || "[user ID]"}\n\n` +
      `Looking forward to receiving my prizes! 🚀\n\n` +
      `Best regards,\n` +
      `${user?.email || "[your name]"}`
    );
    window.location.href = `mailto:jethro.lim@resilio-partners.com?subject=${subject}&body=${body}`;
  };

  if (!isOpen) return null;

  // Steps for progress display
  const steps = [
    { id: 'deposit', label: 'Deposit', done: status?.hasDeposit || false },
    { id: 'guide', label: 'Create & Sell', done: status?.hasListing || false },
    { id: 'submit', label: 'Submit', done: status?.alreadySubmitted || false },
    { id: 'wait', label: 'Wait 7 Days', done: status?.canClaim || false },
    { id: 'claim', label: 'Claim Rewards', done: status?.claimed || false },
  ];

  // Helper to render a step button
  const renderStepButton = (
    label: string,
    action: () => void,
    isDone: boolean,
    isDisabled: boolean = false,
    extra?: string
  ) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${isDone ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-3">
        <span className={`text-xl ${isDone ? '' : 'opacity-50'}`}>
          {isDone ? '✅' : '⏳'}
        </span>
        <span className={`font-medium ${isDone ? 'text-green-700' : 'text-gray-700'}`}>
          {label}
        </span>
        {extra && <span className="text-xs text-gray-400">{extra}</span>}
      </div>
      {!isDone && (
        <button
          onClick={action}
          disabled={isDisabled}
          className="px-4 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
        >
          {isDisabled ? 'Loading...' : 'Do it →'}
        </button>
      )}
    </div>
  );

  // Determine the submit section separately (since it's a form)
  const renderSubmitStep = () => {
    if (status?.alreadySubmitted) {
      return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-green-300 bg-green-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <span className="font-medium text-green-700">Guide Submitted</span>
          </div>
        </div>
      );
    }
    if (status?.canSubmit) {
      return (
        <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏳</span>
            <label className="font-medium text-gray-700">Submit your guide URL</label>
          </div>
          <input
            type="url"
            value={guideUrl}
            onChange={(e) => setGuideUrl(e.target.value)}
            placeholder="https://yourdomain.com/guides/your-guide-slug"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 transition"
          >
            {submitting ? "Submitting..." : "🚀 Submit My Guide"}
          </button>
        </form>
      );
    }
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <span className="font-medium text-gray-500">Submit – complete previous steps first</span>
        </div>
      </div>
    );
  };

  const renderClaimStep = () => {
    if (status?.claimed) {
      return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-green-300 bg-green-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <span className="font-medium text-green-700">Rewards Claimed!</span>
          </div>
        </div>
      );
    }
    if (status?.canClaim) {
      const bonus = status.bonusRewardType ? BONUS_REWARDS[status.bonusRewardType] : null;
      return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-bold text-purple-800">Ready to Claim!</p>
                <p className="text-xs text-purple-600">
                  Guaranteed: Certificate + 50k tokens
                  {bonus && ` + Bonus: ${bonus.emoji} ${bonus.label}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClaim}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition text-sm"
            >
              Claim Now 📧
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <span className="font-medium text-gray-500">Wait 7 days after submitting</span>
        </div>
      </div>
    );
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Vincent Spandy",
      role: "First-time creator",
      text: "I was nervous about creating my first guide, but the step-by-step process made it so easy. I ended up publishing a guide I'm really proud of – and the rewards gave me a huge confidence boost.",
      emoji: "🌱"
    },
    {
      name: "MicDrop",
      role: "Freelancer",
      text: "The challenge pushed me to finally finish something I'd been procrastinating on for months. Having a clear structure and a deadline made all the difference – and the extra tokens were a nice bonus!",
      emoji: "🚀"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col">
        {/* ─── MOBILE TRUST BAR (visible only on small screens) ─── */}
        <div className="sm:hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-t-2xl px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60 flex-shrink-0">
            <Image
              src="/jethro-tesla.jpeg"
              alt="Jethro Lim – founder"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Hi, I'm Jethro – Founder</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span>🛡️ 100% refund</span>
              <span>🔒 Secure</span>
              <span>💬 24h support</span>
              <span className="hidden xs:inline">•</span>
              <a
                href="mailto:jethro.lim@resilio-partners.com?subject=Challenge%20Support"
                className="text-white/90 hover:text-white underline underline-offset-2"
              >
                Contact
              </a>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>

        {/* ─── DESKTOP SIDEBAR + MAIN CONTENT ─── */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">
          {/* ─── LEFT SIDEBAR – desktop only ─── */}
          <div className="hidden sm:flex sm:flex-col items-center p-6 w-48 bg-gradient-to-b from-primary-600 to-primary-800 text-white rounded-l-2xl flex-shrink-0">
            <button onClick={onClose} className="self-end text-white/80 hover:text-white mb-2">
              ✕
            </button>

            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/60 shadow-lg mb-4">
              <Image
                src="/jethro-tesla.jpeg"
                alt="Jethro Lim – founder"
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>
            <p className="text-sm font-semibold text-center leading-tight">Hi, I'm Jethro</p>
            <p className="text-[10px] text-center text-white/80 mt-1">Founder of InstructJet</p>

            <div className="w-full border-t border-white/20 my-4" />

            {/* Trust badges */}
            <div className="space-y-3 w-full text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span className="leading-tight">100% refundable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="leading-tight">Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="leading-tight">Support in 24h</span>
                <a
                  href="mailto:jethro.lim@resilio-partners.com?subject=Challenge%20Support"
                  className="text-xs underline hover:text-white/90 ml-1"
                >
                  contact
                </a>
              </div>
            </div>

            {/* Contact email (clickable) */}
            <div className="mt-2 text-center text-[10px] text-white/70">
              <a
                href="mailto:jethro.lim@resilio-partners.com?subject=Challenge%20Help"
                className="hover:text-white transition"
              >
                📧 jethro.lim@resilio-partners.com
              </a>
            </div>

            <div className="mt-4 text-center text-[10px] text-white/70 italic">
              “I’m personally committed<br />to your success.”
            </div>
          </div>

          {/* ─── MAIN CONTENT ─── */}
          <div className="flex-1 p-6 overflow-y-auto">
            <button onClick={onClose} className="hidden sm:block absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-3xl font-bold text-slate-800 font-syne">Guide Creator Challenge</h2>
              <p className="text-slate-500 text-sm mt-1">Complete the steps below to earn rewards!</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-6 px-2">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">{step.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* ----- INTERACTIVE STEPS ----- */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2 mb-3">
                  <span>📋</span> Your Challenge Steps
                </h3>
                <div className="space-y-2">
                  {/* Step 1: Deposit */}
                  {renderStepButton(
                    'Deposit $5 (fully withdrawable)',
                    handleDeposit,
                    !!status?.hasDeposit,
                    depositing || loadingStatus,
                    depositing ? 'Processing…' : ''
                  )}

                  {/* Step 2: Create guide */}
                  {renderStepButton(
                    'Create a guide (AI Guide Creator)',
                    handleCreateGuide,
                    false,
                    loadingStatus,
                    status?.hasListing ? '(listing found)' : ''
                  )}

                  {/* Step 3: Sell guide */}
                  {renderStepButton(
                    'List your guide for sale',
                    handleSellGuide,
                    !!status?.hasListing,
                    loadingStatus,
                    status?.hasListing ? '✅' : ''
                  )}

                  {/* Step 4: Submit */}
                  <div>
                    {renderSubmitStep()}
                  </div>

                  {/* Step 5: Claim */}
                  <div>
                    {renderClaimStep()}
                  </div>
                </div>
              </div>

              {/* Reward Section - Guaranteed + Bonus */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg flex items-center gap-2">
                  <span>🎁</span> Your Rewards
                </h3>
                <div className="mt-3 space-y-3">
                  {/* Guaranteed */}
                  <div>
                    <p className="text-sm font-semibold text-green-800">Guaranteed (for every completer):</p>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <span className="flex items-center gap-1 text-sm text-green-700 bg-white/60 px-2 py-1 rounded-full">
                        <span className="text-lg">📜</span> Certificate of Achievement
                      </span>
                      <span className="flex items-center gap-1 text-sm text-green-700 bg-white/60 px-2 py-1 rounded-full">
                        <span className="text-lg">🪙</span> 250,000 Tokens
                      </span>
                    </div>
                  </div>

                  {/* Bonus (randomized) – now with engaging icon grid */}
                  <div>
                    <p className="text-sm font-semibold text-green-800">Bonus (random prize):</p>
                    {status?.bonusRewardType ? (
                      <div className="flex items-center gap-3 mt-1 bg-white/60 p-2 rounded-lg">
                        <span className="text-3xl">{BONUS_REWARDS[status.bonusRewardType].emoji}</span>
                        <div>
                          <p className="font-semibold text-green-800">{BONUS_REWARDS[status.bonusRewardType].label}</p>
                          <p className="text-xs text-green-700">{BONUS_REWARDS[status.bonusRewardType].description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(BONUS_REWARDS).map((reward) => (
                            <div key={reward.label} className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                              <span className="text-2xl">{reward.emoji}</span>
                              <span className="text-xs font-medium text-green-700">{reward.label}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-green-700 mt-3 flex items-center gap-1">
                          <span className="text-lg">🎲</span>
                          Complete all steps – one of these will be yours!
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-green-700 mt-1">
                      * Bonus is assigned randomly upon eligibility. Claim your rewards after the 7‑day holding period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Selling Benefits - Highlight how selling guides can be profitable */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h4 className="font-bold text-blue-800 flex items-center gap-2">
                  <span>💰</span> Why Sell Guides?
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-lg">📈</span>
                    <span><strong>Passive income</strong> – each guide you sell keeps earning you tokens every time a buyer purchases it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🏅</span>
                    <span><strong>Build authority</strong> – become a recognized expert in your niche and attract more followers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🔄</span>
                    <span><strong>Evergreen value</strong> – your guides remain available indefinitely, generating consistent returns.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🎯</span>
                    <span><strong>Zero risk</strong> – you pay nothing to list; you only earn when someone buys.</span>
                  </li>
                </ul>
                <p className="text-xs text-blue-600 mt-3">
                  The more guides you sell, the more tokens you earn – which you can reinvest or even withdraw as real money.
                </p>
              </div>

              {/* ─── TESTIMONIALS SECTION ─── */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                <h4 className="font-bold text-indigo-800 flex items-center gap-2">
                  <span>💬</span> What participants say
                </h4>
                <div className="mt-3 space-y-4">
                  {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-white/70 rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{t.emoji}</span>
                        <div>
                          <p className="text-sm text-gray-700 italic">“{t.text}”</p>
                          <p className="text-xs font-medium text-indigo-700 mt-1">– {t.name}, {t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ----- ALWAYS VISIBLE DEPOSIT EXPLANATION ----- */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border-2 border-yellow-300 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🛡️</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                      Refundable Deposit
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-normal">
                        100% Money Back
                      </span>
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Pay <strong>$5</strong> and receive <strong>250,000 tokens</strong> instantly.
                      Your deposit is <span className="underline decoration-2 decoration-green-500 font-semibold">fully refundable</span> – 
                      you can withdraw the full amount <strong>anytime</strong>, even after spending all tokens.
                    </p>
                    <ul className="mt-2 text-xs text-amber-700 space-y-1 list-disc list-inside">
                      <li>No lock‑in, no hidden fees.</li>
                      <li>Withdrawals are processed within 24 hours.</li>
                      <li>Your tokens are yours to use – the money stays yours.</li>
                    </ul>
                    <p className="text-[10px] text-amber-600 mt-2">
                      🔒 Secure payment via Paddle. Your refund is guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}