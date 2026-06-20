// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('All fields are required.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  // Mailto fallback with pre-filled fields
  const mailtoLink = `mailto:jethro.lim@resilio-partners.com?subject=InstructJet%20Support%20Request&body=Name:%20${encodeURIComponent(name)}%0D%0AEmail:%20${encodeURIComponent(email)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Contact & Support</h1>
            <p className="text-lg text-gray-600">
              We’re here to help. Fill in the form below, or use the deep‑link to send us an email directly.
            </p>
            <div className="h-1 w-20 bg-primary-600 rounded-full mt-4" />
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              ✅ Your message has been sent. We’ll get back to you within 24 hours.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              ❌ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="How can we help you?"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              <span className="text-gray-400">or</span>

              <Link
                href={mailtoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:underline"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Open in your email app
              </Link>
            </div>
          </form>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800">📬 Other ways to reach us</h3>
            <p className="text-gray-600 mt-1">
              You can also email us directly at{' '}
              <a href="mailto:jethro.lim@resilio-partners.com" className="text-primary-600 hover:underline">
                jethro.lim@resilio-partners.com
              </a>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              We aim to respond within 1 business day.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-primary-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}