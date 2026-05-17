'use client';

import { useState, useEffect, useMemo } from 'react';
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

// NEW: interface for usage summary
interface UsageSummary {
  totalUsed: number;
  byFeature: Record<string, number>;
  totalPurchased: number;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'billing'>('account');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  
  // Profile update
  const [fullName, setFullName] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Cancel subscription
  const [cancelling, setCancelling] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // NEW: compute usage statistics from transactions
  const usageSummary = useMemo<UsageSummary>(() => {
    let totalUsed = 0;
    let totalPurchased = 0;
    const byFeature: Record<string, number> = {};
    
    transactions.forEach(tx => {
      if (tx.amount < 0) {
        const used = Math.abs(tx.amount);
        totalUsed += used;
        const feature = tx.feature || 'unknown';
        byFeature[feature] = (byFeature[feature] || 0) + used;
      } else if (tx.amount > 0) {
        totalPurchased += tx.amount;
      }
    });
    
    return { totalUsed, byFeature, totalPurchased };
  }, [transactions]);

  // NEW: filter only usage transactions (negative amount) for history table
  const usageTransactions = useMemo(() => {
    return transactions
      .filter(tx => tx.amount < 0)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [transactions]);

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
      setTransactions(data.recentTransactions || []);
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
    if (!profilePassword) {
      setMessage({ type: 'error', text: 'Current password required to update name' });
      return;
    }
    setUpdatingProfile(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, currentPassword: profilePassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.user);
      setProfilePassword('');
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!newEmail) {
      setMessage({ type: 'error', text: 'New email is required' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage({ type: 'error', text: 'Invalid email format' });
      return;
    }
    setSendingEmailOtp(true);
    setMessage(null);
    try {
      const response = await fetch('/api/user/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEmailOtpSent(true);
      setMessage({ type: 'success', text: 'Verification code sent to new email' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp || !emailChangePassword) {
      setMessage({ type: 'error', text: 'Verification code and current password are required' });
      return;
    }
    setChangingEmail(true);
    setMessage(null);
    try {
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, otp: emailOtp, currentPassword: emailChangePassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setMessage({ type: 'success', text: 'Email changed successfully. Please log in again.' });
      setNewEmail('');
      setEmailOtp('');
      setEmailChangePassword('');
      setEmailOtpSent(false);
      setTimeout(() => logout(), 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setChangingEmail(false);
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
      if (!response.ok) throw new Error(data.error);
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

  const handleCancelSubscription = async () => {
    const confirmed = confirm(
      'Are you sure you want to cancel your subscription?\n\n' +
      'You will be downgraded to the Free plan immediately.\n' +
      'Your subscription tokens will reset to 0, but any purchased token packs will remain.\n\n' +
      'This action cannot be undone.'
    );
    if (!confirmed) return;

    setCancelling(true);
    setMessage(null);
    try {
      const res = await fetch('/api/paypal/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed');
      setMessage({ type: 'success', text: data.message });
      await fetchUserData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setCancelling(false);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account and billing</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('account')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'account'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'billing'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Billing & Tokens
              </button>
            </nav>
          </div>

          {/* Account Tab - unchanged */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Profile Information Section */}
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
                    <p className="mt-1 text-xs text-gray-500">Want to change email? Use the section below.</p>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password (required)
                    </label>
                    <input
                      type="password"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition"
                    >
                      {updatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Email Section */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Change Email Address</h2>
                  <p className="text-sm text-gray-500 mt-1">A verification code will be sent to your new email address</p>
                </div>
                <form onSubmit={handleChangeEmail} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Email Address</label>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        disabled={emailOtpSent}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="new@example.com"
                      />
                      {!emailOtpSent ? (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={sendingEmailOtp || !newEmail}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
                        >
                          {sendingEmailOtp ? 'Sending...' : 'Send Code'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEmailOtpSent(false)}
                          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Change Email
                        </button>
                      )}
                    </div>
                  </div>

                  {emailOtpSent && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                        <input
                          type="text"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter 6-digit code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={emailChangePassword}
                          onChange={(e) => setEmailChangePassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </>
                  )}

                  {emailOtpSent && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={changingEmail}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition"
                      >
                        {changingEmail ? 'Changing...' : 'Change Email'}
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Change Password Section */}
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
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition"
                    >
                      {updatingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Billing Tab - MODIFIED with usage statistics and history table */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Subscription & Tokens Section */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Subscription & Tokens</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Current Plan</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize mt-1">
                        {profile?.plan_tier || 'free'}
                      </p>
                    </div>
                    {profile?.plan_tier === 'free' ? (
                      <a
                        href="/pricing"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                      >
                        Upgrade Plan
                      </a>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                  {profile?.plan_tier === 'premium' && (
                    <p className="text-xs text-gray-500 -mt-3">
                      Your premium features will remain until the end of your current billing cycle if you cancel.
                    </p>
                  )}

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
                </div>
              </div>

              {/* NEW: Token Usage Statistics Cards */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Token Usage Statistics</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Total Tokens Used (All Time)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{usageSummary.totalUsed.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Total Tokens Purchased</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{usageSummary.totalPurchased.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {Object.keys(usageSummary.byFeature).length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Breakdown by Feature</h3>
                      <div className="space-y-2">
                        {Object.entries(usageSummary.byFeature).map(([feature, tokens]) => (
                          <div key={feature} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">{feature.replace(/_/g, ' ')}</span>
                            <span className="text-sm font-medium text-gray-900">{tokens.toLocaleString()} tokens</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* NEW: Token Usage History Table (replaces old Recent Transactions) */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Token Usage History</h2>
                  <p className="text-sm text-gray-500 mt-1">All token deductions from chat, web search, and publishing</p>
                </div>
                <div className="overflow-x-auto">
                  {usageTransactions.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usageTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                              {tx.feature?.replace(/_/g, ' ') || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              -{Math.abs(tx.amount).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {tx.metadata && Object.keys(tx.metadata).length > 0 ? (
                                <span title={JSON.stringify(tx.metadata, null, 2)}>
                                  {tx.metadata.title || tx.metadata.query || tx.metadata.message_length ? 
                                    (tx.metadata.title || tx.metadata.query || `${tx.metadata.message_length || ''} chars`) : 
                                    'View details'}
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No token usage recorded yet. Use the guide creator or web search to see activity here.
                    </div>
                  )}
                </div>
              </div>

              {/* Keep purchase transactions separate if desired, but not necessary now */}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}