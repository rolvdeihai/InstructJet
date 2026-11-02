// src/lib/team-insights.ts
//
// Turns team questions/feedback on a guide into a comprehension profile and
// SOP change suggestions. There is no cron: analysis runs lazily when the
// guide owner opens the dashboard or the insights page, and only once enough
// new signals have accumulated since the last run.

import { supabaseAdmin } from '@/lib/supabase-admin';
import { teamProfileToPrompt, TeamProfile } from '@/lib/team-profile';

export const MIN_NEW_SIGNALS = 5;
const MAX_CONTEXT_SIGNALS = 80;
const MAX_GUIDES_PER_REFRESH = 3;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

export interface MemberPattern {
  member: string;
  questions: number;
  feedback: number;
  submissions?: number;
  covered_in_sop: number;
  reliance: 'normal' | 'high';
  note: string;
}

export interface TeamInsightProfile {
  comprehension_score: number;
  summary: string;
  communication_style: string;
  question_breakdown: {
    covered_in_sop: number;
    unclear_in_sop: number;
    missing_from_sop: number;
    off_topic: number;
  };
  knowledge_gaps: { topic: string; count: number }[];
  strengths: string[];
  member_patterns: MemberPattern[];
  ignored: { reason: string; count: number }[];
}

interface GuideRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  team_profile: TeamProfile | null;
}

// ─── Recording ───────────────────────────────────────────────────────────────
export async function recordTeamSignal(params: {
  guideId: string;
  sessionId?: string | null;
  kind: 'question' | 'feedback' | 'submission';
  content: string;
  answerExcerpt?: string | null;
}) {
  const { error } = await supabaseAdmin.from('guide_team_signals').insert({
    guide_id: params.guideId,
    session_id: params.sessionId || null,
    kind: params.kind,
    content: params.content.slice(0, 2000),
    answer_excerpt: params.answerExcerpt ? params.answerExcerpt.slice(0, 1000) : null,
  });
  if (error) console.error('Failed to record team signal:', error);
}

// ─── Analysis ────────────────────────────────────────────────────────────────
const ANALYSIS_SYSTEM_PROMPT = `You are an operations analyst who reviews how a team uses an SOP (standard operating procedure).
You receive the SOP, an optional team profile, the team's conversations with the SOP's AI assistant (each question with the AI's answer), feedback they sent, the AI evaluation of work they submitted, and the suggestions that already exist.

Your job:
1. Build a comprehension / communication profile of the team.
2. Propose ONLY the SOP changes that would genuinely help the team.

Use judgement — do NOT turn every question into a suggestion:
- First classify every question: "covered_in_sop" (the SOP already answers it clearly), "unclear_in_sop" (the SOP covers it but the wording, order or format is confusing), "missing_from_sop" (a real gap), or "off_topic" (unrelated, small talk, testing the bot).
- Compare each AI answer with the SOP. If the AI had to answer with facts, steps, values or rules that are NOT in the SOP, that is strong evidence of "missing_from_sop" — the SOP should contain what the AI had to make up or look elsewhere for.
- Submissions: a low score or repeated mistake in the evaluation shows where workers misunderstood or the SOP failed them. Several members making the same mistake points to an unclear or missing step; one careless submission does not.
- "covered_in_sop" questions are NOT a reason to change the SOP. Many people ask the AI instead of reading. If one member repeatedly asks things the SOP already answers, flag that member with reliance "high" in member_patterns and do not create suggestions from those questions.
- A suggestion needs real evidence: the same confusion from 2+ different members, OR a single gap that is clearly important (safety, compliance, money, blocking the task), OR explicit feedback that points to a real problem.
- Ignore one-off curiosity, personal preferences of a single person, jokes, spam and questions about things outside the SOP's scope. Record what you ignored in "ignored" with a short reason.
- Respect the team profile: e.g. visual learners → suggest a diagram/table; beginners → define jargon. But never suggest changes just to restate what is already clear.
- Do not repeat an existing pending suggestion; if new evidence supports one, list its id in "reinforced_suggestion_ids" instead. Never re-propose a dismissed suggestion unless the new evidence is much stronger.
- 0 to 5 suggestions. Returning zero suggestions is a perfectly good answer.

Each suggestion's "proposed_change" must be a concrete, specific instruction an editor can apply to the SOP (what to add/rewrite and where), not a vague goal.

Return ONLY a JSON object with this exact shape:
{
  "comprehension_score": <0-100, how well the team understands the SOP>,
  "summary": "<2-3 sentences for the SOP owner>",
  "communication_style": "<1-2 sentences on how the team asks questions>",
  "question_breakdown": { "covered_in_sop": <n>, "unclear_in_sop": <n>, "missing_from_sop": <n>, "off_topic": <n> },
  "knowledge_gaps": [ { "topic": "<short topic>", "count": <questions about it> } ],
  "strengths": [ "<what the team clearly understands>" ],
  "member_patterns": [ { "member": "<label exactly as given>", "covered_in_sop": <n>, "reliance": "normal" | "high", "note": "<short observation>" } ],
  "ignored": [ { "reason": "<why these signals did not lead to a suggestion>", "count": <n> } ],
  "suggestions": [ { "title": "<short imperative title>", "rationale": "<evidence: what was asked, by how many members>", "proposed_change": "<concrete edit>", "section": "<SOP section it affects, or null>", "priority": "low" | "medium" | "high", "evidence_count": <number of signals supporting it> } ],
  "reinforced_suggestion_ids": [ "<id of an existing pending suggestion>" ]
}`;

async function callDeepSeekJson(system: string, user: string): Promise<any> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
    signal: AbortSignal.timeout(55_000),
  });
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
  }
  const data = await response.json();
  const raw: string = data.choices[0]?.message?.content || '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object in analysis response');
  return JSON.parse(match[0]);
}

const num = (v: unknown) => (typeof v === 'number' && isFinite(v) ? Math.max(0, Math.round(v)) : 0);
const text = (v: unknown, max = 600) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Analyzes a guide if at least MIN_NEW_SIGNALS unanalyzed signals exist.
 * Signals are claimed before the AI call so concurrent dashboard loads don't
 * analyze the same batch twice; they are released again if the call fails.
 */
export async function analyzeGuideIfDue(guide: GuideRow): Promise<boolean> {
  const { data: pending } = await supabaseAdmin
    .from('guide_team_signals')
    .select('id')
    .eq('guide_id', guide.id)
    .is('analyzed_at', null)
    .limit(200);
  if (!pending || pending.length < MIN_NEW_SIGNALS) return false;

  const { data: claimed } = await supabaseAdmin
    .from('guide_team_signals')
    .update({ analyzed_at: new Date().toISOString() })
    .eq('guide_id', guide.id)
    .is('analyzed_at', null)
    .in('id', pending.map(p => p.id))
    .select('id');
  if (!claimed || claimed.length < MIN_NEW_SIGNALS) {
    // Someone else claimed this batch (e.g. two tabs). Release what we got.
    if (claimed?.length) await releaseSignals(claimed.map(c => c.id));
    return false;
  }
  const claimedIds = claimed.map(c => c.id);

  try {
    const { data: signals } = await supabaseAdmin
      .from('guide_team_signals')
      .select('id, session_id, kind, content, answer_excerpt, created_at')
      .eq('guide_id', guide.id)
      .order('created_at', { ascending: false })
      .limit(MAX_CONTEXT_SIGNALS);
    const recent = (signals || []).reverse();

    // Label members by worker name when known, otherwise "Member N".
    const sessionIds = [...new Set(recent.map(s => s.session_id).filter(Boolean))] as string[];
    const names: Record<string, string> = {};
    if (sessionIds.length) {
      const { data: sessions } = await supabaseAdmin
        .from('worker_chat_sessions')
        .select('id, worker_name')
        .in('id', sessionIds);
      sessions?.forEach(s => { if (s.worker_name) names[s.id] = s.worker_name; });
    }
    const labels: Record<string, string> = {};
    let memberIndex = 0;
    const labelFor = (sessionId: string | null) => {
      const key = sessionId || 'unknown';
      if (!labels[key]) labels[key] = (sessionId && names[sessionId]) || `Member ${++memberIndex}`;
      return labels[key];
    };

    const counts: Record<string, { questions: number; feedback: number; submissions: number }> = {};
    const signalLines = recent.map((s, i) => {
      const member = labelFor(s.session_id);
      counts[member] ||= { questions: 0, feedback: 0, submissions: 0 };
      counts[member][s.kind === 'feedback' ? 'feedback' : s.kind === 'submission' ? 'submissions' : 'questions']++;
      const isNew = claimedIds.includes(s.id) ? ' [NEW]' : '';
      const answerLabel = s.kind === 'submission' ? 'AI evaluation' : 'AI answered';
      const answer = s.answer_excerpt ? `\n   ${answerLabel}: ${s.answer_excerpt.replace(/\s+/g, ' ').slice(0, 500)}` : '';
      return `${i + 1}. (${member}, ${s.kind})${isNew} ${s.content.replace(/\s+/g, ' ')}${answer}`;
    });

    const { data: existing } = await supabaseAdmin
      .from('guide_suggestions')
      .select('id, title, status')
      .eq('guide_id', guide.id)
      .in('status', ['pending', 'dismissed'])
      .order('created_at', { ascending: false })
      .limit(30);
    const existingLines = (existing || []).map(s => `- [${s.status}] id=${s.id}: ${s.title}`);

    const userPrompt = `SOP title: ${guide.title}

<<<SOP
${guide.content.slice(0, 24_000)}
SOP>>>

${teamProfileToPrompt(guide.team_profile) || 'Team profile: not provided.'}

Team activity (oldest first, [NEW] = since last analysis):
${signalLines.join('\n')}

Existing suggestions:
${existingLines.length ? existingLines.join('\n') : '(none)'}`;

    const result = await callDeepSeekJson(ANALYSIS_SYSTEM_PROMPT, userPrompt);

    const aiMembers: any[] = Array.isArray(result.member_patterns) ? result.member_patterns : [];
    const profile: TeamInsightProfile = {
      comprehension_score: Math.min(100, num(result.comprehension_score)),
      summary: text(result.summary, 1000),
      communication_style: text(result.communication_style, 600),
      question_breakdown: {
        covered_in_sop: num(result.question_breakdown?.covered_in_sop),
        unclear_in_sop: num(result.question_breakdown?.unclear_in_sop),
        missing_from_sop: num(result.question_breakdown?.missing_from_sop),
        off_topic: num(result.question_breakdown?.off_topic),
      },
      knowledge_gaps: (Array.isArray(result.knowledge_gaps) ? result.knowledge_gaps : [])
        .map((g: any) => ({ topic: text(g?.topic, 80), count: num(g?.count) }))
        .filter((g: { topic: string }) => g.topic)
        .slice(0, 8),
      strengths: (Array.isArray(result.strengths) ? result.strengths : []).map((s: unknown) => text(s, 200)).filter(Boolean).slice(0, 6),
      // Counts come from the data, the judgement (reliance, note) from the AI.
      member_patterns: Object.entries(counts).map(([member, c]) => {
        const ai = aiMembers.find(m => m?.member === member);
        return {
          member,
          questions: c.questions,
          feedback: c.feedback,
          submissions: c.submissions,
          covered_in_sop: Math.min(c.questions, num(ai?.covered_in_sop)),
          reliance: ai?.reliance === 'high' ? 'high' : 'normal',
          note: text(ai?.note, 300),
        };
      }),
      ignored: (Array.isArray(result.ignored) ? result.ignored : [])
        .map((g: any) => ({ reason: text(g?.reason, 300), count: num(g?.count) }))
        .filter((g: { reason: string }) => g.reason)
        .slice(0, 6),
    };

    const { count: totalSignals } = await supabaseAdmin
      .from('guide_team_signals')
      .select('id', { count: 'exact', head: true })
      .eq('guide_id', guide.id)
      .not('analyzed_at', 'is', null);

    await supabaseAdmin.from('guide_team_insights').upsert({
      guide_id: guide.id,
      profile,
      signals_analyzed: totalSignals || claimedIds.length,
      updated_at: new Date().toISOString(),
    });

    const suggestions = (Array.isArray(result.suggestions) ? result.suggestions : [])
      .slice(0, 5)
      .map((s: any) => ({
        guide_id: guide.id,
        title: text(s?.title, 160),
        rationale: text(s?.rationale, 1000),
        proposed_change: text(s?.proposed_change, 2000),
        section: text(s?.section, 120) || null,
        priority: ['low', 'medium', 'high'].includes(s?.priority) ? s.priority : 'medium',
        evidence_count: Math.max(1, num(s?.evidence_count)),
      }))
      .filter((s: { title: string; proposed_change: string }) => s.title && s.proposed_change);
    if (suggestions.length) {
      const { error } = await supabaseAdmin.from('guide_suggestions').insert(suggestions);
      if (error) console.error('Failed to insert suggestions:', error);
    }

    const pendingIds = new Set((existing || []).filter(s => s.status === 'pending').map(s => s.id));
    const reinforced: string[] = (Array.isArray(result.reinforced_suggestion_ids) ? result.reinforced_suggestion_ids : [])
      .filter((id: unknown): id is string => typeof id === 'string' && pendingIds.has(id));
    for (const id of reinforced) {
      const { data: row } = await supabaseAdmin.from('guide_suggestions').select('evidence_count').eq('id', id).single();
      if (row) {
        await supabaseAdmin.from('guide_suggestions').update({ evidence_count: (row.evidence_count || 1) + 1 }).eq('id', id);
      }
    }

    return true;
  } catch (err) {
    console.error(`Team insight analysis failed for guide ${guide.id}:`, err);
    await releaseSignals(claimedIds);
    return false;
  }
}

async function releaseSignals(ids: string[]) {
  await supabaseAdmin.from('guide_team_signals').update({ analyzed_at: null }).in('id', ids);
}

// ─── Dashboard summary ───────────────────────────────────────────────────────
export interface GuideInsightSummary {
  guideId: string;
  slug: string;
  title: string;
  totalSignals: number;
  newSignals: number;
  pendingSuggestions: number;
  comprehensionScore: number | null;
  updatedAt: string | null;
}

/** Analyzes the owner's guides that are due, then returns a summary per guide with team activity. */
export async function refreshInsightsForUser(userId: string): Promise<{ analyzed: number; guides: GuideInsightSummary[] }> {
  const { data: guides } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, content, team_profile')
    .eq('user_id', userId);
  if (!guides?.length) return { analyzed: 0, guides: [] };
  const guideIds = guides.map(g => g.id);

  const countSignals = async () => {
    const { data } = await supabaseAdmin
      .from('guide_team_signals')
      .select('guide_id, analyzed_at')
      .in('guide_id', guideIds);
    const counts: Record<string, { total: number; fresh: number }> = {};
    data?.forEach(s => {
      counts[s.guide_id] ||= { total: 0, fresh: 0 };
      counts[s.guide_id].total++;
      if (!s.analyzed_at) counts[s.guide_id].fresh++;
    });
    return counts;
  };

  let counts = await countSignals();
  const due = guides
    .filter(g => (counts[g.id]?.fresh || 0) >= MIN_NEW_SIGNALS)
    .sort((a, b) => counts[b.id].fresh - counts[a.id].fresh)
    .slice(0, MAX_GUIDES_PER_REFRESH);
  const results = await Promise.all(due.map(g => analyzeGuideIfDue(g as GuideRow)));
  const analyzed = results.filter(Boolean).length;
  if (analyzed) counts = await countSignals();

  const [{ data: insights }, { data: suggestions }] = await Promise.all([
    supabaseAdmin.from('guide_team_insights').select('guide_id, profile, updated_at').in('guide_id', guideIds),
    supabaseAdmin.from('guide_suggestions').select('guide_id').eq('status', 'pending').in('guide_id', guideIds),
  ]);

  const summaries = guides
    .filter(g => counts[g.id]?.total)
    .map(g => {
      const insight = insights?.find(i => i.guide_id === g.id);
      return {
        guideId: g.id,
        slug: g.slug,
        title: g.title,
        totalSignals: counts[g.id].total,
        newSignals: counts[g.id].fresh,
        pendingSuggestions: suggestions?.filter(s => s.guide_id === g.id).length || 0,
        comprehensionScore: insight ? (insight.profile as TeamInsightProfile).comprehension_score : null,
        updatedAt: insight?.updated_at || null,
      };
    })
    .sort((a, b) => b.pendingSuggestions - a.pendingSuggestions || b.totalSignals - a.totalSignals);

  return { analyzed, guides: summaries };
}

// ─── Applying approved suggestions ───────────────────────────────────────────
const APPLY_SYSTEM_PROMPT = `You are InstructJet AI, an expert SOP editor.
You will receive a complete SOP in Markdown and a list of changes the SOP owner approved.
Rewrite the document so that it applies every approved change.

Rules:
- Output the COMPLETE revised document, from the first line to the last, in Markdown.
- Apply ONLY the approved changes. Keep every other part exactly as it is (wording, images, links, tables, mermaid diagrams).
- Keep the existing structure unless a change asks to restructure.
- Keep Mermaid diagrams valid and inside \`\`\`mermaid code blocks.
- Do NOT add commentary, explanations or a preamble, and do NOT wrap the whole document in a code block.`;

export async function generateOptimizedGuide(
  guide: { title: string; content: string; team_profile: TeamProfile | null },
  changes: { title: string; proposed_change: string; section: string | null }[]
): Promise<{ content: string; truncated: boolean }> {
  const changeList = changes
    .map((c, i) => `${i + 1}. ${c.title}${c.section ? ` (section: ${c.section})` : ''}\n   ${c.proposed_change}`)
    .join('\n');
  const profile = teamProfileToPrompt(guide.team_profile);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: APPLY_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Current SOP:
<<<DOCUMENT
${guide.content}
DOCUMENT>>>

${profile ? `${profile}\n\n` : ''}Approved changes:
${changeList}

Return the complete revised document now.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 8000,
    }),
    signal: AbortSignal.timeout(110_000),
  });
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
  }
  const data = await response.json();
  let revised: string = (data.choices[0]?.message?.content || '').trim();
  const fenced = revised.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fenced) revised = fenced[1].trim();
  revised = revised.replace(/^<<<DOCUMENT\s*/, '').replace(/\s*DOCUMENT>>>$/, '').trim();
  if (!revised) throw new Error('Empty revision');
  return { content: revised, truncated: data.choices[0]?.finish_reason === 'length' };
}
