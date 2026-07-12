'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const PRICING_LINK = "/pricing";
const LOGIN_LINK = "/login";

interface ChallengePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChallengePopup({ isOpen, onClose }: ChallengePopupProps) {
  const { user } = useAuth();
  const [guideUrl, setGuideUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    canSubmit: boolean;
    alreadySubmitted: boolean;
    hasDeposit: boolean;
    hasListing?: boolean;
    depositDate?: string;
    weekStart?: string;
    submittedAt?: string;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/challenge/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        } else {
          setStatus({ canSubmit: false, alreadySubmitted: false, hasDeposit: false, hasListing: false });
        }
      } catch (err) {
        console.error(err);
        setStatus({ canSubmit: false, alreadySubmitted: false, hasDeposit: false, hasListing: false });
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, [isOpen]);

  const handleDeposit = () => {
    // Redirect to a deposit flow (e.g., Paddle checkout for $5)
    window.location.href = '/api/challenge/deposit';
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
        onClose();
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

  if (!isOpen) return null;

  // Determine steps
  const steps = [
    { id: 'deposit', label: 'Deposit', done: status?.hasDeposit || false },
    { id: 'guide', label: 'Create & Sell', done: status?.hasListing || false },
    { id: 'submit', label: 'Submit', done: status?.alreadySubmitted || false },
    { id: 'wait', label: 'Wait 7 Days', done: false },
    { id: 'reward', label: 'Claim Rewards', done: false },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-3xl font-bold text-slate-800 font-syne">Guide Creator Challenge</h2>
            <p className="text-slate-500 text-sm mt-1">Deposit, create, sell, and earn rewards — all while learning!</p>
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
            {/* Rules */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                <span>📋</span> Challenge Rules
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span><strong>Deposit $5</strong> (fully withdrawable) – this ensures commitment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span><strong>Create a guide</strong> using our AI Guide Creator. Make it clear, simple, and valuable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span><strong>Sell the guide</strong> – list it as a private guide for sale on our platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span><strong>Do not withdraw</strong> your deposit for 7 full days after submitting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">5.</span>
                  <span><strong>Submit</strong> your guide URL below to enter the challenge.</span>
                </li>
              </ul>
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-bold text-green-800 text-lg flex items-center gap-2">
                <span>🎁</span> Your Reward
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <span><strong>Sharable Certificate</strong> – showcase your achievement.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <span><strong>+50,000 Tokens</strong> – boost your account for future guides.</span>
                </li>
              </ul>
              <p className="text-xs text-green-700 mt-3">
                * Rewards are credited after the 7‑day holding period ends, provided you haven't withdrawn your deposit.
              </p>
            </div>

            {/* Quick tips */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 flex items-center gap-2">
                <span>💡</span> How to Win
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 mt-1">
                <li>Make your guide exceptionally clear and easy to follow.</li>
                <li>Use analogies, examples, and visuals (Mermaid diagrams).</li>
                <li>Price your guide competitively to attract buyers.</li>
                <li>Share your guide on social media for more visibility.</li>
              </ul>
            </div>

            {!user ? (
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-gray-700">Please <Link href={LOGIN_LINK} className="text-orange-600 font-medium underline">log in</Link> to participate.</p>
              </div>
            ) : loadingStatus ? (
              <div className="text-center py-4 text-gray-500">Checking eligibility...</div>
            ) : status?.alreadySubmitted ? (
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-green-700 text-lg font-semibold">✅ You're in the challenge!</p>
                <p className="text-sm text-green-600 mt-1">Your guide is submitted. Keep your deposit for 7 days to claim rewards.</p>
                <p className="text-xs text-green-500 mt-2">Winners will be announced after the holding period.</p>
              </div>
            ) : !status?.hasDeposit ? (
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <p className="text-yellow-700 text-sm">You need a <strong>$5 deposit</strong> to join the challenge.</p>
                <button
                  onClick={handleDeposit}
                  className="inline-block mt-2 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 shadow-md transition-all hover:scale-105"
                >
                  Deposit $5 (withdrawable)
                </button>
                <p className="text-xs text-yellow-600 mt-2">Your deposit stays with you – it's refundable after the 7‑day period.</p>
              </div>
            ) : !status?.hasListing ? (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-blue-700 text-sm">✅ Deposit complete! Now you need to <strong>sell a guide</strong>.</p>
                <Link href="/sell" className="inline-block mt-2 text-blue-600 font-medium hover:underline">
                  Create a Listing →
                </Link>
              </div>
            ) : status?.canSubmit ? (
              <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Guide URL</label>
                  <input
                    type="url"
                    value={guideUrl}
                    onChange={(e) => setGuideUrl(e.target.value)}
                    placeholder="https://yourdomain.com/guides/your-guide-slug"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Make sure your guide is published and listed for sale.</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                >
                  {submitting ? "Submitting..." : "🚀 Submit My Guide"}
                </button>
              </form>
            ) : (
              <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-700">
                <p>Something's missing. Please make sure you have deposited $5 and created a listing.</p>
                <Link href="/sell" className="inline-block mt-2 text-orange-600 font-medium hover:underline">
                  Go to Sell Page →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}