// components/TeamProfileQuestionnaire.tsx
//
// Optional questions asked before creating a guide so the AI can tailor it to
// the team. Every field is optional and the whole form can be skipped.

'use client';

import { useState } from 'react';
import {
  TeamProfile,
  EXPERTISE_OPTIONS,
  LEARNING_STYLE_OPTIONS,
  DETAIL_LEVEL_OPTIONS,
  TONE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  isTeamProfileEmpty,
} from '@/lib/team-profile';

type Option = { value: string; label: string };

function ChoiceChips({
  options,
  selected,
  onToggle,
}: {
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              active
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function TeamProfileQuestionnaire({
  initialProfile,
  onSave,
  onSkip,
}: {
  initialProfile: TeamProfile | null;
  onSave: (profile: TeamProfile | null) => void;
  onSkip: () => void;
}) {
  const [profile, setProfile] = useState<TeamProfile>(initialProfile || {});

  const set = <K extends keyof TeamProfile>(key: K, value: TeamProfile[K]) =>
    setProfile(prev => ({ ...prev, [key]: value }));
  // Single-choice chips: clicking the selected chip clears it.
  const toggleSingle = (key: 'expertise' | 'detailLevel' | 'tone' | 'teamSize') => (value: string) =>
    set(key, profile[key] === value ? undefined : value);
  const toggleStyle = (value: string) => {
    const styles = profile.learningStyles || [];
    set('learningStyles', styles.includes(value) ? styles.filter(s => s !== value) : [...styles, value]);
  };

  const fieldClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">👥 Tell us about your team</h2>
          <p className="text-sm text-gray-600 mt-1">
            Optional — answer whatever you like and the AI will tailor the guide to your team.
            You can skip this and change it later.
          </p>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Who is this guide for? (team / role)</label>
            <input
              type="text"
              value={profile.role || ''}
              onChange={(e) => set('role', e.target.value)}
              placeholder="e.g. Warehouse packers, customer support agents, interns"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team expertise</label>
            <ChoiceChips options={EXPERTISE_OPTIONS} selected={profile.expertise ? [profile.expertise] : []} onToggle={toggleSingle('expertise')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How does your team learn best? <span className="text-gray-400 font-normal">(pick any)</span>
            </label>
            <ChoiceChips options={LEARNING_STYLE_OPTIONS} selected={profile.learningStyles || []} onToggle={toggleStyle} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level of detail</label>
              <ChoiceChips options={DETAIL_LEVEL_OPTIONS} selected={profile.detailLevel ? [profile.detailLevel] : []} onToggle={toggleSingle('detailLevel')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <ChoiceChips options={TONE_OPTIONS} selected={profile.tone ? [profile.tone] : []} onToggle={toggleSingle('tone')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team size</label>
              <ChoiceChips options={TEAM_SIZE_OPTIONS} selected={profile.teamSize ? [profile.teamSize] : []} onToggle={toggleSingle('teamSize')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team&apos;s main language</label>
              <input
                type="text"
                value={profile.language || ''}
                onChange={(e) => set('language', e.target.value)}
                placeholder="e.g. English, Bahasa Indonesia"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Common mistakes or pain points</label>
            <textarea
              value={profile.painPoints || ''}
              onChange={(e) => set('painPoints', e.target.value)}
              placeholder="e.g. They often skip the quality check, or forget to log the order number"
              className={fieldClass}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anything else the AI should know?</label>
            <textarea
              value={profile.notes || ''}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="e.g. Most of them read on their phone during shifts"
              className={fieldClass}
              rows={2}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button type="button" onClick={onSkip} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            Skip
          </button>
          <button
            type="button"
            onClick={() => onSave(isTeamProfileEmpty(profile) ? null : profile)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
          >
            Save &amp; start
          </button>
        </div>
      </div>
    </div>
  );
}
