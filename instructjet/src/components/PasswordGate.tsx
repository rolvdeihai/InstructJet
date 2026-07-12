// src/components/PasswordGate.tsx

'use client';

import { useState, useEffect } from 'react';

interface PasswordGateProps {
  guideId: string;
  guideSlug: string;
  children: React.ReactNode;
}

export default function PasswordGate({ guideId, guideSlug, children }: PasswordGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check localStorage
    const stored = localStorage.getItem(`guide_password_${guideSlug}`);
    if (stored === 'true') {
      setIsUnlocked(true);
    }
  }, [guideSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/guide/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid password');
      }
      // Save to localStorage
      localStorage.setItem(`guide_password_${guideSlug}`, 'true');
      setIsUnlocked(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">This guide is private</h2>
      <p className="text-gray-600 mb-6">Please enter the password to view the content.</p>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter password"
          required
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Unlock Guide'}
        </button>
      </form>
    </div>
  );
}