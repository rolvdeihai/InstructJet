'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import GuidePreview from './GuidePreview';
import bcrypt from 'bcryptjs';

interface EditGuideFormProps {
  guideId: string;
  initialTitle: string;
  initialContent: string;
  initialTokenBudget: number;
  initialIsPublic: boolean;
  initialHasPassword: boolean;
}

export default function EditGuideForm({
  guideId,
  initialTitle,
  initialContent,
  initialTokenBudget,
  initialIsPublic,
  initialHasPassword,
}: EditGuideFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tokenBudget, setTokenBudget] = useState(initialTokenBudget);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBudgetHelp, setShowBudgetHelp] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    if (tokenBudget < 0) {
      setError('Token budget cannot be negative');
      return;
    }

    // Validate privacy
    let passwordHash = null;
    if (!isPublic) {
      // If switching from public to private or changing password
      if (!newPassword && !initialHasPassword) {
        setError('Please set a password for the private guide');
        return;
      }
      if (newPassword) {
        if (newPassword.length < 4) {
          setError('Password must be at least 4 characters');
          return;
        }
        passwordHash = await bcrypt.hash(newPassword, 10);
      } else {
        // Keep existing password (no change) – we don't need to send anything
        // but we must not set password_hash to null.
        // We'll handle by not updating password_hash if newPassword is empty.
        // But we need to keep the existing hash; we'll not include it in the update.
        // We'll set a flag to skip updating password_hash.
      }
    } else {
      // Public guide: remove password hash
      passwordHash = null;
    }

    setSaving(true);
    setError(null);

    try {
      const updateData: any = {
        title,
        content,
        total_token_budget: tokenBudget,
        token_budget_remaining: tokenBudget,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      };

      // Only update password_hash if:
      // - we have a new password (private with new password)
      // - we are making it public (set to null)
      // - we are keeping private with no new password → do nothing (skip)
      if (passwordHash !== undefined) {
        updateData.password_hash = passwordHash;
      }

      // If we are setting private and newPassword is empty, but we already have a hash, we don't need to change it.
      // So we don't include password_hash in updateData.

      const { error: updateError } = await supabase
        .from('guides')
        .update(updateData)
        .eq('id', guideId);

      if (updateError) throw updateError;

      router.push('/guides');
      router.refresh();
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save guide');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-sm font-medium text-gray-700">Worker Chat Token Budget</label>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowBudgetHelp(!showBudgetHelp)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Help"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showBudgetHelp && (
              <div className="absolute z-10 w-80 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 -left-32">
                <h4 className="font-semibold text-gray-800 mb-1">What is token budget?</h4>
                <p>Workers who ask questions about this guide will consume tokens from this budget (1000 tokens per message).</p>
                <p className="mt-1">Set a budget to control how many questions workers can ask. Increasing budget will deduct tokens from your main balance.</p>
                <p className="mt-1 text-xs text-gray-500">Decreasing budget will reduce remaining tokens accordingly.</p>
                <button onClick={() => setShowBudgetHelp(false)} className="mt-2 text-xs text-primary-600">Close</button>
              </div>
            )}
          </div>
          <input
            type="number"
            value={tokenBudget}
            onChange={(e) => setTokenBudget(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            step="1000"
            className="w-32 px-2 py-1 border rounded-lg text-sm"
          />
          <span className="text-xs text-gray-500">tokens</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Workers consume 1000 tokens per chat message. If you increase the budget, tokens will be deducted from your main account.
        </p>
      </div>

      {/* Privacy Toggle */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Privacy</span>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              isPublic ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                isPublic ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm text-gray-600">
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {!isPublic && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {initialHasPassword ? 'Change Password (leave blank to keep current)' : 'Set Password'}
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={initialHasPassword ? 'New password (optional)' : 'Enter a password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            {!initialHasPassword && (
              <p className="text-xs text-gray-500 mt-1">Password must be at least 4 characters.</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Guide Content (Markdown)</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          <GuidePreview content={content} onChange={setContent} userId="" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting</p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}