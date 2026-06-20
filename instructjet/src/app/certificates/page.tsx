// app/certificates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  guideTitle: string;
  guideUrl: string;
  submittedAt: string;
  certificateUrl: string;
  weekStart: string;
}

export default function CertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchCertificates();
    }
  }, [user, authLoading, router]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      setCertificates(data.certificates || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading certificates...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <button onClick={fetchCertificates} className="mt-4 text-primary-600 underline">Retry</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="mt-2 text-gray-600">
              All your participation certificates from the Weekly Guide Challenge.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No certificates yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't participated in any challenge weeks yet.
                <br />
                Create a guide and submit it to the Weekly Guide Challenge to earn a certificate!
              </p>
              <Link
                href="/create-guide"
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Create a Guide
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">🏅</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {format(new Date(cert.submittedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">
                      {cert.guideTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Week starting {format(new Date(cert.weekStart), 'MMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href={cert.certificateUrl}
                        className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition"
                      >
                        View Certificate
                      </Link>
                      <a
                        href={cert.guideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 text-sm underline"
                      >
                        Guide
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Share your certificates on social media to show your participation!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}