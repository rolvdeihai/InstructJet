// src/lib/team-profile.ts
//
// The optional team questionnaire asked before a guide is generated. Shared by
// the client (questionnaire UI) and the server (prompt building).

export interface TeamProfile {
  expertise?: string;
  role?: string;
  learningStyles?: string[];
  detailLevel?: string;
  tone?: string;
  teamSize?: string;
  language?: string;
  painPoints?: string;
  notes?: string;
}

type Option = { value: string; label: string };

export const EXPERTISE_OPTIONS: Option[] = [
  { value: 'beginner', label: 'Beginners / new hires' },
  { value: 'intermediate', label: 'Some experience' },
  { value: 'expert', label: 'Experienced experts' },
  { value: 'mixed', label: 'Mixed levels' },
];

export const LEARNING_STYLE_OPTIONS: Option[] = [
  { value: 'step_by_step', label: 'Step-by-step text' },
  { value: 'visual', label: 'Visual (diagrams, screenshots)' },
  { value: 'checklist', label: 'Checklists' },
  { value: 'examples', label: 'Examples & scenarios' },
  { value: 'reference', label: 'Quick reference / tables' },
];

export const DETAIL_LEVEL_OPTIONS: Option[] = [
  { value: 'quick', label: 'Short & to the point' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'detailed', label: 'Very detailed' },
];

export const TONE_OPTIONS: Option[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
];

export const TEAM_SIZE_OPTIONS: Option[] = [
  { value: '1-5', label: '1–5' },
  { value: '6-20', label: '6–20' },
  { value: '21-50', label: '21–50' },
  { value: '50+', label: '50+' },
];

const labelOf = (options: Option[], value?: string) =>
  options.find(o => o.value === value)?.label || value;

export function isTeamProfileEmpty(profile?: TeamProfile | null): boolean {
  if (!profile) return true;
  return !Object.values(profile).some(v => (Array.isArray(v) ? v.length > 0 : !!String(v ?? '').trim()));
}

/** Short one-line summary for chips, e.g. "Beginners · Visual · Detailed". */
export function summarizeTeamProfile(profile?: TeamProfile | null): string {
  if (isTeamProfileEmpty(profile)) return '';
  const p = profile!;
  return [
    p.role,
    labelOf(EXPERTISE_OPTIONS, p.expertise),
    ...(p.learningStyles || []).map(s => labelOf(LEARNING_STYLE_OPTIONS, s)),
    labelOf(DETAIL_LEVEL_OPTIONS, p.detailLevel),
  ].filter(Boolean).join(' · ');
}

/** Block of text injected into AI prompts. Empty string when nothing was answered. */
export function teamProfileToPrompt(profile?: TeamProfile | null): string {
  if (isTeamProfileEmpty(profile)) return '';
  const p = profile!;
  const lines = [
    p.role && `- Team / role: ${p.role}`,
    p.expertise && `- Expertise level: ${labelOf(EXPERTISE_OPTIONS, p.expertise)}`,
    p.teamSize && `- Team size: ${labelOf(TEAM_SIZE_OPTIONS, p.teamSize)}`,
    p.learningStyles?.length && `- Preferred learning style: ${p.learningStyles.map(s => labelOf(LEARNING_STYLE_OPTIONS, s)).join(', ')}`,
    p.detailLevel && `- Preferred level of detail: ${labelOf(DETAIL_LEVEL_OPTIONS, p.detailLevel)}`,
    p.tone && `- Tone: ${labelOf(TONE_OPTIONS, p.tone)}`,
    p.language && `- Preferred language: ${p.language}`,
    p.painPoints && `- Common mistakes / pain points: ${p.painPoints}`,
    p.notes && `- Other notes: ${p.notes}`,
  ].filter(Boolean);
  return `Team profile (tailor wording, depth and format to this audience):\n${lines.join('\n')}`;
}

/** Keeps only known string fields and trims lengths, for anything coming from a request body. */
export function sanitizeTeamProfile(input: unknown): TeamProfile | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const str = (v: unknown, max = 300) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);
  const profile: TeamProfile = {
    expertise: str(raw.expertise, 40),
    role: str(raw.role, 120),
    learningStyles: Array.isArray(raw.learningStyles)
      ? raw.learningStyles.filter((s): s is string => typeof s === 'string').slice(0, 6)
      : undefined,
    detailLevel: str(raw.detailLevel, 40),
    tone: str(raw.tone, 40),
    teamSize: str(raw.teamSize, 20),
    language: str(raw.language, 60),
    painPoints: str(raw.painPoints, 600),
    notes: str(raw.notes, 600),
  };
  return isTeamProfileEmpty(profile) ? null : profile;
}
