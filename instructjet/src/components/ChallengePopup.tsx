'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
          setStatus({ canSubmit: false, alreadySubmitted: false, hasDeposit: false });
        }
      } catch (err) {
        console.error(err);
        setStatus({ canSubmit: false, alreadySubmitted: false, hasDeposit: false });
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
        alert(`✅ Guide submitted! Your certificate: ${data.certificateUrl}. Winners will be announced every Sunday!`);
        setGuideUrl('');
        onClose();
        window.open(data.certificateUrl, '_blank');
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">📝</div>
            <h2 className="text-2xl font-bold text-slate-800 font-syne">Weekly Guide Challenge</h2>
            <p className="text-slate-500 text-sm mt-1">Create a guide that makes complex tasks simple. Win cash prizes every Sunday.</p>
          </div>

          <div className="space-y-4">
            {/* Prizes */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="font-bold text-amber-800">🎁 Prizes (Weekly)</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-700">
                <li>🥇 <strong>1st place: $50</strong></li>
                <li>🥈 <strong>2nd place: $25</strong></li>
                <li>🥉 <strong>3rd place: $10</strong></li>
              </ul>
            </div>

            {/* How to participate */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 mb-2">📋 How to Participate</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>
                  <strong>Deposit $5 (withdrawable)</strong> – this ensures commitment.
                  <p className="text-xs text-slate-500 mt-1 ml-6">Your submission is valid only if you keep the deposit for the full 7‑day challenge period. If you withdraw early, your submission is disqualified.</p>
                </li>
                <li>
                  <strong>Create a guide</strong> using our AI Guide Creator. Focus on a complex topic and make it exceptionally easy to follow.
                </li>
                <li>
                  <strong>Submit your guide URL</strong> using the form below.
                </li>
                <li>
                  Winners are chosen every <strong>Sunday</strong> based on:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-xs">
                    <li>How complex the original topic is</li>
                    <li>How simple and clear your guide makes it</li>
                    <li>Use of analogies, examples, and no unnecessary jargon</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-blue-800 mb-2">💡 Tips for Winning</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Break down complex steps into tiny, actionable pieces</li>
                <li>Add real‑world analogies (e.g., "Think of it like making coffee...")</li>
                <li>Include screenshots or diagrams (Mermaid flowcharts)</li>
                <li>Keep sentences short and avoid technical terms unless explained</li>
                <li>Test your guide with someone who knows nothing about the topic</li>
              </ul>
            </div>

            {!user ? (
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-gray-700">Please <a href={LOGIN_LINK} className="text-orange-600 font-medium underline">log in</a> to participate.</p>
              </div>
            ) : loadingStatus ? (
              <div className="text-center py-4 text-gray-500">Checking eligibility...</div>
            ) : status?.alreadySubmitted ? (
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-green-700">✅ You've already submitted a guide for this week!</p>
                <p className="text-xs text-green-600 mt-1">Winners announced every Sunday. Good luck!</p>
              </div>
            ) : !status?.hasDeposit ? (
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <p className="text-yellow-700">You need a <strong>$5 deposit</strong> to participate.</p>
                <button
                  onClick={handleDeposit}
                  className="inline-block mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700"
                >
                  Deposit $5 (withdrawable)
                </button>
                <p className="text-xs text-yellow-600 mt-2">Your deposit must remain for the 7‑day challenge period.</p>
              </div>
            ) : status?.canSubmit ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Published Guide URL</label>
                <input
                  type="url"
                  value={guideUrl}
                  onChange={(e) => setGuideUrl(e.target.value)}
                  placeholder="https://yourdomain.com/guides/your-guide-slug"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
                <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Guide"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}