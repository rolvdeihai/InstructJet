// components/CreateGuideClient.tsx

'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import ChatInterface from './ChatInterface';
import GuidePreview from './GuidePreview';
import { supabase } from '@/lib/supabase-client';
import { useGuideChat } from '@/hooks/useGuideChat';
import bcrypt from 'bcryptjs';
import { franc } from 'franc-min';
import TeamProfileQuestionnaire from './TeamProfileQuestionnaire';
import { TeamProfile, summarizeTeamProfile } from '@/lib/team-profile';
import { ReminderDraft, ReminderDraftFields, EMPTY_REMINDER_DRAFT, saveReminderDraft } from './GuideReminders';

// ─── Tutorial Component ──────────────────────────────────────────────────────
const GuideTutorial = ({ compact = false }: { compact?: boolean }) => (
  <div className={compact ? "text-sm" : ""}>
    <h3 className="text-xl font-semibold mb-2">📘 Welcome to the Guide Creator</h3>
    <p className="mb-2">
      Start by sending a message describing the guide you want. The AI will help you structure it step by step.
    </p>
    <ul className="list-disc list-inside space-y-1 text-sm">
      <li>Be specific about your topic and audience.</li>
      <li>Enable <strong>Web Search</strong> for current facts.</li>
      <li>For free users: you'll get a section‑by‑section generation.</li>
      <li>Premium users: receive a complete guide in one go.</li>
      <li>Edit the preview, add a title, and publish.</li>
      <li>Attach files for AI analysis to enrich your guide.</li>
      <li>Tips: For tasks that can't be checked with OCR, simply create the guide to instruct the workers to document their work in detail so we can check their report instead. 😁</li>
    </ul>
    <p className="mt-3 text-xs text-blue-600">
      💡 Need more help? Click the <strong>?</strong> button next to the title.
    </p>
  </div>
);

// ─── Memoized GuideControls Component ──────────────────────────────────────
const GuideControls = memo(function GuideControls({
  title,
  setTitle,
  saving,
  guideContent,
  publishGuide,
  createNewSession,
  showGuideTutorial,
  setShowGuideTutorial,
  tokenBudget,
  setTokenBudget,
  showBudgetHelp,
  setShowBudgetHelp,
  isPublic,
  setIsPublic,
  privatePassword,
  setPrivatePassword,
  teamProfile,
  onEditTeamProfile,
  reminders,
  onToggleReminders,
  onEditReminders,
}: {
  title: string;
  setTitle: (t: string) => void;
  saving: boolean;
  guideContent: string;
  publishGuide: () => void;
  createNewSession: () => void;
  showGuideTutorial: boolean;
  setShowGuideTutorial: (v: boolean) => void;
  tokenBudget: number;
  setTokenBudget: (v: number) => void;
  showBudgetHelp: boolean;
  setShowBudgetHelp: (v: boolean) => void;
  isPublic: boolean;
  setIsPublic: (v: boolean) => void;
  privatePassword: string;
  setPrivatePassword: (v: string) => void;
  teamProfile: TeamProfile | null;
  onEditTeamProfile: () => void;
  reminders: ReminderDraft;
  onToggleReminders: () => void;
  onEditReminders: () => void;
}) {
  return (
    <div className="p-4 border-b border-gray-200 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          key="guide-title-input"
          type="text"
          placeholder="Guide Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-[120px] px-3 py-2 border rounded-lg text-sm"
        />
        <button
          onClick={publishGuide}
          disabled={saving || !guideContent}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50 text-sm"
        >
          {saving ? 'Publishing...' : 'Publish'}
        </button>
        <button
          onClick={createNewSession}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          New Guide
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGuideTutorial(!showGuideTutorial)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Guide creation help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showGuideTutorial && (
            <div className="absolute right-0 mt-2 w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <GuideTutorial compact />
              <button onClick={() => setShowGuideTutorial(false)} className="mt-2 text-xs text-primary-600">
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Worker Chat Budget</label>
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
              <div className="absolute z-10 w-72 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 -left-20">
                <h4 className="font-semibold text-gray-800 mb-1">What is token budget?</h4>
                <p>Workers who ask questions about this guide will consume tokens from this budget (1000 tokens per message).</p>
                <p className="mt-1">Set a budget to control how many questions workers can ask. You can top it up later by editing the guide.</p>
                <p className="mt-1 text-xs text-gray-500">Recommended: 5000–20000 tokens for active guides.</p>
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
            className="w-20 px-2 py-1 border rounded-lg text-sm"
          />
          <span className="text-xs text-gray-500">tokens</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Privacy</span>
          <button
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
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-gray-700 whitespace-nowrap">👥 Team</span>
        <span className="flex-1 min-w-0 truncate text-gray-600" title={summarizeTeamProfile(teamProfile)}>
          {summarizeTeamProfile(teamProfile) || <span className="text-gray-400">No team profile (generic guide)</span>}
        </span>
        <button type="button" onClick={onEditTeamProfile} className="text-xs text-primary-600 hover:text-primary-700 whitespace-nowrap">
          {teamProfile ? 'Edit' : 'Add'}
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <label className="flex items-center gap-2 font-medium text-gray-700 whitespace-nowrap">
          <input type="checkbox" checked={reminders.enabled} onChange={onToggleReminders} className="h-4 w-4" />
          🔔 Daily reminders
        </label>
        {reminders.enabled && (
          <>
            <span className="flex-1 min-w-0 truncate text-gray-600">
              {reminders.workers.length
                ? `${reminders.workers.length} worker${reminders.workers.length > 1 ? 's' : ''} will be emailed after publishing`
                : <span className="text-amber-700">No workers added yet</span>}
            </span>
            <button type="button" onClick={onEditReminders} className="text-xs text-primary-600 hover:text-primary-700 whitespace-nowrap">
              Edit
            </button>
          </>
        )}
      </div>

      {!isPublic && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Access Password</label>
          <input
            type="text"
            value={privatePassword}
            onChange={(e) => setPrivatePassword(e.target.value)}
            placeholder="Set a password for this guide"
            className="flex-1 px-3 py-1 border rounded-lg text-sm"
          />
          <span className="text-xs text-gray-500">Min 4 chars</span>
        </div>
      )}
    </div>
  );
});

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CreateGuideClient({ userId }: { userId: string }) {
  // ─── Core State ──────────────────────────────────────────────────────────
  const [guideContent, setGuideContent] = useState<string>('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [showGuideTutorial, setShowGuideTutorial] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');

  // Token budget
  const [tokenBudget, setTokenBudget] = useState<number>(5000);
  const [showBudgetHelp, setShowBudgetHelp] = useState(false);

  // ─── Privacy State ──────────────────────────────────────────────────────
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [privatePassword, setPrivatePassword] = useState<string>('');

  // ─── Team Profile (optional questionnaire before creating) ──────────────
  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [lastTeamProfile, setLastTeamProfile] = useState<TeamProfile | null>(null);

  // ─── Worker Reminders (saved after publish) ──────────────────────────────
  const [reminders, setReminders] = useState<ReminderDraft>(EMPTY_REMINDER_DRAFT);
  const [showReminders, setShowReminders] = useState(false);

  // ─── Mobile Tab State ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'chat' | 'guide'>('chat');

  // ─── AI Chat ────────────────────────────────────────────────────────────
  const chat = useGuideChat({ userId, guideContent, onGuideChange: setGuideContent, teamProfile });

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const fetchWithCreds = useCallback((url: string, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
  }, []);

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await fetchWithCreds('/api/user/profile', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.user?.plan_tier || 'free');
        }
      } catch (err) {
        console.error('Error fetching user plan:', err);
      }
    };
    fetchUserPlan();
  }, [fetchWithCreds]);

  // Ask the team questions before the first message, prefilled from the last guide.
  useEffect(() => {
    const loadLastTeamProfile = async () => {
      try {
        const res = await fetchWithCreds('/api/user/team-profile', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setLastTeamProfile(data.teamProfile || null);
        }
      } catch (err) {
        console.error('Error fetching team profile:', err);
      } finally {
        setShowQuestionnaire(true);
      }
    };
    loadLastTeamProfile();
  }, [fetchWithCreds]);

  // ─── Session Management ──────────────────────────────────────────────────
  const { resetChat } = chat;
  const createNewSession = useCallback(async () => {
    setGuideContent('');
    setTitle('');
    setIsPublic(true);
    setPrivatePassword('');
    setReminders(EMPTY_REMINDER_DRAFT);
    setActiveTab('chat');
    await resetChat();
  }, [resetChat]);

  const detectLanguage = (text: string): string => {
    const lang = franc(text, { minLength: 3 });
    const langMap: Record<string, string> = {
      'eng': 'en',
      'spa': 'es',
      'fra': 'fr',
      'deu': 'de',
      'zho': 'zh',
      'jpn': 'ja',
      'rus': 'ru',
      'por': 'pt',
      'ita': 'it',
      'nld': 'nl',
      'pol': 'pl',
      'tur': 'tr',
      'kor': 'ko',
      'ara': 'ar',
      'hin': 'hi',
      'ind': 'id',
    };
    return langMap[lang] || 'en';
  };

  // ─── Publish Guide ────────────────────────────────────────────────────────
  const publishGuide = useCallback(async () => {
    if (!guideContent) {
      alert('No guide content to publish');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title for the guide');
      return;
    }

    if (!isPublic && !privatePassword.trim()) {
      alert('Please set a password for your private guide.');
      return;
    }
    if (!isPublic && privatePassword.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }

    const publishCost = userPlan === 'basic' ? 0 : 5000;
    setSaving(true);

    try {
      if (publishCost > 0) {
        const balanceRes = await fetchWithCreds('/api/tokens/balance', { method: 'GET' });
        if (!balanceRes.ok) {
          const err = await balanceRes.json();
          throw new Error(err.error || 'Failed to check token balance');
        }
        const { total_tokens } = await balanceRes.json();
        if (total_tokens < publishCost) {
          alert(`Insufficient tokens. Need ${publishCost} tokens to publish a guide. Please purchase more tokens or upgrade your plan.`);
          setSaving(false);
          return;
        }

        const deductRes = await fetchWithCreds('/api/tokens/deduct', {
          method: 'POST',
          body: JSON.stringify({
            amount: publishCost,
            feature: 'guide_publish',
            metadata: { title, wordCount: guideContent.length }
          }),
        });
        if (!deductRes.ok) {
          const errorData = await deductRes.json();
          throw new Error(errorData.error || 'Token deduction failed');
        }
      }

      let passwordHash = null;
      if (!isPublic && privatePassword) {
        passwordHash = await bcrypt.hash(privatePassword, 10);
      }

      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
      const language = detectLanguage(title + ' ' + guideContent);

      const { data, error } = await supabase
        .from('guides')
        .insert({
          user_id: userId,
          slug,
          title,
          content: guideContent,
          ai_generated: true,
          total_token_budget: tokenBudget,
          token_budget_remaining: tokenBudget,
          is_public: isPublic,
          password_hash: passwordHash,
          language,
          team_profile: teamProfile,
          reminders_enabled: reminders.enabled && reminders.workers.length > 0,
          reminder_message: reminders.message.trim() || null,
        })
        .select('id, slug')
        .single();

      if (error) throw error;
      const reminderError = await saveReminderDraft(data.id, reminders);
      if (reminderError) {
        alert(`Guide published, but reminders could not be set up: ${reminderError}. You can add workers from the Edit page.`);
      }
      window.location.href = `/guides/${data.slug}`;
    } catch (err: any) {
      console.error('Publish error:', err);
      alert(err.message || 'Failed to publish guide');
    } finally {
      setSaving(false);
    }
  }, [guideContent, title, isPublic, privatePassword, userPlan, fetchWithCreds, tokenBudget, userId, teamProfile, reminders]);

  const openQuestionnaire = useCallback(() => setShowQuestionnaire(true), []);
  const toggleReminders = useCallback(() => {
    const enabled = !reminders.enabled;
    setReminders({ ...reminders, enabled });
    if (enabled && !reminders.workers.length) setShowReminders(true);
  }, [reminders]);
  const openReminders = useCallback(() => setShowReminders(true), []);

  // ─── Handle Guide Preview Changes ──────────────────────────────────────
  const handleGuidePreviewChange = useCallback((newContent: string) => {
    setGuideContent(newContent);
  }, []);

  const chatPanel = (
    <>
      <ChatInterface
        messages={chat.messages}
        onSendMessage={chat.handleSendMessage}
        isGenerating={chat.isGenerating || chat.generatingSections}
        isSearching={chat.isSearching}
        webSearchEnabled={chat.webSearchEnabled}
        onToggleWebSearch={chat.toggleWebSearch}
        onStopGeneration={chat.stopGeneration}
        queuePosition={chat.queuePosition}
        showWelcome={chat.messages.length === 0}
        onAttachFile={chat.triggerFilePicker}
        uploading={chat.uploading}
        hasGuide={chat.hasGuide}
      />
      {chat.generatingSections && chat.guideSections.length > 0 && (
        <div className="border-t border-gray-200 p-2 text-sm text-gray-500 text-center">
          Generating section {chat.currentSectionIndex + 1}/{chat.guideSections.length}: {chat.guideSections[chat.currentSectionIndex]}
        </div>
      )}
    </>
  );

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen pt-16">
      {showQuestionnaire && (
        <TeamProfileQuestionnaire
          initialProfile={teamProfile || lastTeamProfile}
          onSave={(profile) => { setTeamProfile(profile); setShowQuestionnaire(false); }}
          onSkip={() => setShowQuestionnaire(false)}
        />
      )}
      {showReminders && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">🔔 Remind workers every day</h2>
              <p className="text-sm text-gray-600 mt-1">Add the workers who must complete this guide and their deadline.</p>
            </div>
            <div className="p-5 overflow-y-auto">
              <ReminderDraftFields value={reminders} onChange={setReminders} />
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowReminders(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── Hidden file input ────────────────────────────────────────────── */}
      <input
        type="file"
        ref={chat.fileInputRef}
        onChange={chat.handleFileSelected}
        accept="image/*,.pdf,.docx,.doc"
        className="hidden"
      />

      {/* ─── Desktop: two columns ─────────────────────────────────────────── */}
      <div className="hidden md:flex flex-row w-full h-full overflow-hidden">
        {/* Left: Chat */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col h-full">
          {chatPanel}
        </div>

        {/* Right: Guide Preview with Controls */}
        <div className="w-1/2 flex flex-col h-full">
          <GuideControls
            title={title}
            setTitle={setTitle}
            saving={saving}
            guideContent={guideContent}
            publishGuide={publishGuide}
            createNewSession={createNewSession}
            showGuideTutorial={showGuideTutorial}
            setShowGuideTutorial={setShowGuideTutorial}
            tokenBudget={tokenBudget}
            setTokenBudget={setTokenBudget}
            showBudgetHelp={showBudgetHelp}
            setShowBudgetHelp={setShowBudgetHelp}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            privatePassword={privatePassword}
            setPrivatePassword={setPrivatePassword}
            teamProfile={teamProfile}
            onEditTeamProfile={openQuestionnaire}
            reminders={reminders}
            onToggleReminders={toggleReminders}
            onEditReminders={openReminders}
          />
          <GuidePreview
            content={guideContent}
            onChange={handleGuidePreviewChange}
            userId={userId}
          />
        </div>
      </div>

      {/* ─── Mobile: tabbed layout ────────────────────────────────────────── */}
      <div className="flex md:hidden flex-col h-full w-full overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="flex flex-col h-full">
              {chatPanel}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <GuideControls
                title={title}
                setTitle={setTitle}
                saving={saving}
                guideContent={guideContent}
                publishGuide={publishGuide}
                createNewSession={createNewSession}
                showGuideTutorial={showGuideTutorial}
                setShowGuideTutorial={setShowGuideTutorial}
                tokenBudget={tokenBudget}
                setTokenBudget={setTokenBudget}
                showBudgetHelp={showBudgetHelp}
                setShowBudgetHelp={setShowBudgetHelp}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                privatePassword={privatePassword}
                setPrivatePassword={setPrivatePassword}
                teamProfile={teamProfile}
                onEditTeamProfile={openQuestionnaire}
                reminders={reminders}
                onToggleReminders={toggleReminders}
                onEditReminders={openReminders}
              />
              <div className="flex-1 overflow-auto">
                <GuidePreview
                  content={guideContent}
                  onChange={handleGuidePreviewChange}
                  userId={userId}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'chat'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'guide'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 Edit Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}