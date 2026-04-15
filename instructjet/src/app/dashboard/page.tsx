// src/app/dashboard/page.tsx

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name || user.email}!</h1>
          <p className="text-gray-600 mb-8">Your dashboard is ready.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/create" className="block p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition">
              <h2 className="text-xl font-bold text-primary-800 mb-2">Create New Guide</h2>
              <p className="text-primary-600">Start a new task guide using AI assistance.</p>
            </Link>
            <Link href="/guides" className="block p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <h2 className="text-xl font-bold text-blue-800 mb-2">My Guides</h2>
              <p className="text-blue-600">View and manage your existing guides.</p>
            </Link>
            <Link href="/submissions" className="block p-6 bg-green-50 rounded-xl hover:bg-green-100 transition">
              <h2 className="text-xl font-bold text-green-800 mb-2">Work Submissions</h2>
              <p className="text-green-600">See photos and videos from workers who followed your guides.</p>
            </Link>
            <Link href="/settings" className="block p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
              <h2 className="text-xl font-bold text-purple-800 mb-2">Settings</h2>
              <p className="text-purple-600">Manage your account and preferences.</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}