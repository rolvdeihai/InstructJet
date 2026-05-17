'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import GuidePreview from './GuidePreview';
import { useAuth } from '@/contexts/AuthContext';

interface EditGuideFormProps {
  guideId: string;
  initialTitle: string;
  initialContent: string;
  initialTokenBudget: number;
}

export default function EditGuideForm({
  guideId,
  initialTitle,
  initialContent,
  initialTokenBudget,
}: EditGuideFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tokenBudget, setTokenBudget] = useState(initialTokenBudget);
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

    setSaving(true);
    setError(null);

    try {
      // Directly update the guide with the new budget as the remaining budget
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          title,
          content,
          total_token_budget: tokenBudget,        // optional: keep total same as remaining
          token_budget_remaining: tokenBudget,    // ← directly set to new value
          updated_at: new Date().toISOString(),
        })
        .eq('id', guideId);

      if (updateError) throw updateError;

      // Redirect to the guide page using the updated title
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${guideId.slice(0, 8)}`;
      router.push(`/guides/${slug}`);
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Guide Content (Markdown)</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          <GuidePreview content={content} onChange={setContent} />
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