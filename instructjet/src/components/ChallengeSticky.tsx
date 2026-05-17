"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

const PRICING_LINK = "/pricing";
const LOGIN_LINK = "/login";

export default function ChallengeSticky() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [guideUrl, setGuideUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    canSubmit: boolean;
    alreadySubmitted: boolean;
    isPremium: boolean;
    weekStart?: string;
    submittedAt?: string;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const dragStart = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/challenge/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        } else {
          setStatus({ canSubmit: false, alreadySubmitted: false, isPremium: false });
        }
      } catch (err) {
        console.error(err);
        setStatus({ canSubmit: false, alreadySubmitted: false, isPremium: false });
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("challengeStickyPos");
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        setPosition({ x, y });
      } catch (e) {}
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".popup-content")) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    const boundedX = Math.min(Math.max(0, newX), window.innerWidth - 80);
    const boundedY = Math.min(Math.max(0, newY), window.innerHeight - 80);
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    localStorage.setItem("challengeStickyPos", JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleStickyClick = (e: React.MouseEvent) => {
    if (!isDragging) setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

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
        alert("Guide submitted! Good luck. Winners announced every Sunday.");
        setGuideUrl("");
        setShowPopup(false);
        const statusRes = await fetch("/api/challenge/status");
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

  if (loadingStatus) return null;

  return (
    <>
      <div
        ref={elementRef}
        onMouseDown={handleMouseDown}
        onClick={handleStickyClick}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 9999,
        }}
        className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg p-4 flex items-center gap-3 hover:shadow-xl transition-all transform hover:scale-105 select-none animate-pulse ring-2 ring-yellow-400/50 ring-offset-2"
      >
        <span className="text-2xl">🏆</span>
        <span className="font-syne font-bold text-base md:text-lg tracking-wide">
          Weekly Guide Challenge: Win $50!
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative popup-content">
            <button onClick={handleClosePopup} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
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
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="font-bold text-amber-800">🎁 Prizes (Weekly)</h3>
                  <ul className="mt-2 space-y-1 text-sm text-amber-700">
                    <li>🥇 <strong>1st place: $50</strong></li>
                    <li>🥈 <strong>2nd place: $25</strong></li>
                    <li>🥉 <strong>3rd place: $10</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-2">📋 How to Participate</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                    <li>
                      <strong>Claim your free Premium trial</strong> (if not already Premium)
                      <a href={PRICING_LINK} target="_blank" rel="noopener noreferrer" className="block mt-1 text-orange-600 underline text-xs">→ Go to Pricing</a>
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
                    <p className="text-gray-700">Please <a href={LOGIN_LINK} className="text-orange-600 font-medium underline">log in</a> to submit your guide.</p>
                  </div>
                ) : status?.alreadySubmitted ? (
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-green-700">✅ You've already submitted a guide for this week!</p>
                    <p className="text-xs text-green-600 mt-1">Winners announced every Sunday. Good luck!</p>
                  </div>
                ) : status?.isPremium === false ? (
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-yellow-700">This challenge is for <strong>Premium</strong> users only.</p>
                    <a href={PRICING_LINK} className="inline-block mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">Upgrade to Premium</a>
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
      )}
    </>
  );
}