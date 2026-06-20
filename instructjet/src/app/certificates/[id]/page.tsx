// app/certificates/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import domtoimage from 'dom-to-image-more';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CertificateData {
  id: string;
  userName: string;
  guideTitle: string;
  submittedDate: string;
  guideUrl: string;
}

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/certificates/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Certificate not found');
          } else {
            throw new Error('Failed to fetch certificate');
          }
          return;
        }
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `🎉 Certificate for ${data?.userName}`,
        text: `Check out ${data?.userName}'s participation certificate for the InstructJet Guide Challenge!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

    const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
        const dataUrl = await domtoimage.toPng(certificateRef.current, {
        quality: 1,
        bgcolor: '#ffffff', // ✅ lowercase 'bgcolor'
        scale: 2
        });

        const link = document.createElement('a');
        link.download = `Certificate_${data?.userName || 'Participant'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Download error:', err);
        alert('Failed to download certificate. Please try again.');
    } finally {
        setDownloading(false);
    }
    };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading certificate...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 flex items-center justify-center p-6">
          <div className="text-center text-red-600">
            <p className="text-xl">{error || 'Certificate not found'}</p>
            <Link href="/certificates" className="mt-4 inline-block text-amber-600 underline">
              ← Back to Certificates
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { userName, guideTitle, submittedDate, guideUrl } = data;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 flex items-center justify-center p-6 pt-20">
        <div className="max-w-4xl w-full">
          {/* Certificate Card */}
          <div
            ref={certificateRef}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-amber-200"
          >
            <div className="h-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

            <div className="p-8 md:p-12 lg:p-16">
              <div className="flex justify-center mb-6">
                <div className="bg-amber-100 text-amber-800 px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase border-2 border-amber-300 shadow-inner">
                  🏆 Certificate of Participation
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold text-center text-gray-800 mb-2">
                Certificate
              </h1>
              <p className="text-center text-gray-500 text-sm mb-8">— proudly presented to —</p>

              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 px-12 py-4 rounded-2xl shadow-md border border-amber-200">
                  <p className="text-3xl md:text-5xl font-bold text-gray-800 font-serif">
                    {userName}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <p className="text-lg text-gray-700">
                  has successfully participated in the
                </p>
                <p className="text-2xl font-bold text-amber-800">
                  Weekly Guide Challenge
                </p>
                <p className="text-gray-600">
                  by creating a stunning guide titled
                </p>
                <p className="text-xl font-semibold text-orange-700 underline decoration-wavy decoration-amber-400 underline-offset-4">
                  {guideTitle}
                </p>
                <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                  <span>📅</span>
                  <span>{format(new Date(submittedDate), 'MMMM do, yyyy')}</span>
                </div>
              </div>

              <div className="flex justify-center items-center gap-3 my-8">
                <div className="h-px w-16 bg-amber-300" />
                <span className="text-amber-400 text-xl">✦ ✦ ✦</span>
                <div className="h-px w-16 bg-amber-300" />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">View the guide:</p>
                <a
                  href={guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-800 underline font-medium"
                >
                  {guideTitle}
                </a>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-amber-200 pt-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>🏅</span>
                  <span>InstructJet Challenge</span>
                </div>
                <div>
                  Certificate ID: <span className="font-mono">{data.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-400/30 rounded-tl-2xl" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-400/30 rounded-tr-2xl" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-400/30 rounded-bl-2xl" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-400/30 rounded-br-2xl" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-8xl font-bold text-gray-900 rotate-[-15deg]">★</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={handleShare}
              className="px-6 py-2 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition"
            >
              📋 Share Certificate
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? 'Generating...' : '📥 Download PNG'}
            </button>
            <a
              href={guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-amber-600 text-white rounded-full text-sm hover:bg-amber-700 transition"
            >
              👀 View Guide
            </a>
            <Link
              href="/certificates"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
            >
              ← All Certificates
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}