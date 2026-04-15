// app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan_tier: string;
  subscription_id: string | null;
  subscribed_plan_id: string | null;
  plan_status: string | null;
}

interface TokenBalance {
  subscription_tokens: number;
  package_tokens: number;
  month_year: string | null;
}

interface TokenTransaction {
  id: string;
  amount: number;
  source: string;
  feature: string;
  metadata: any;
  created_at: string;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TokenTransaction[]>([]);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, [user, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setProfile(data.user);
      setTokenBalance(data.tokenBalance);
      setRecentTransactions(data.recentTransactions || []);
      setFullName(data.user.full_name || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setUpdatingPassword(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to change password');

      setMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalTokens = (tokenBalance?.subscription_tokens || 0) + (tokenBalance?.package_tokens || 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition"
                  >
                    {updatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition"
                  >
                    {updatingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Subscription & Tokens Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Subscription & Tokens</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Current Plan */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize mt-1">
                      {profile?.plan_tier || 'free'}
                    </p>
                  </div>
                  {profile?.plan_tier === 'free' && (
                    <a
                      href="/pricing"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                    >
                      Upgrade Plan
                    </a>
                  )}
                </div>

                {/* Token Balance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Subscription Tokens</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {tokenBalance?.subscription_tokens?.toLocaleString() || 0}
                    </p>
                    {tokenBalance?.month_year && (
                      <p className="text-xs text-gray-500 mt-1">
                        Resets: {new Date(tokenBalance.month_year + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">Package Tokens</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {tokenBalance?.package_tokens?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">One-time purchase, never expire</p>
                  </div>
                </div>

                <div className="bg-primary-50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-primary-700 font-medium">Total Available Tokens</p>
                    <p className="text-3xl font-bold text-primary-900 mt-1">{totalTokens.toLocaleString()}</p>
                  </div>
                  <a
                    href="/token-packs"
                    className="px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-medium border border-primary-200 hover:bg-primary-50 transition"
                  >
                    Buy Tokens
                  </a>
                </div>

                {/* Recent Transactions */}
                {recentTransactions.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Token Activity</h3>
                    <div className="space-y-2">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100">
                          <div>
                            <span className="font-medium text-gray-800">{transaction.feature}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} tokens
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-red-200">
              <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                <h2 className="text-xl font-semibold text-red-800">Danger Zone</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        // Implement account deletion API call
                        alert('Account deletion not yet implemented in this example');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}