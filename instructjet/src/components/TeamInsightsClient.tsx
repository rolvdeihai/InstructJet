// components/TeamInsightsClient.tsx
//
// Team comprehension analytics for one guide, plus AI suggestions the owner
// reviews like pull requests: select → preview the diff → merge into the guide.

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import GuideView from './GuideView';
import { summarizeTeamProfile, TeamProfile } from '@/lib/team-profile';
import type { TeamInsightProfile } from '@/lib/team-insights';

interface Suggestion {
  id: string;
  title: string;
  rationale: string;
  proposed_change: string;
  section: string | null;
  priority: 'low' | 'medium' | 'high';
  evidence_count: number;
  status: 'pending' | 'dismissed' | 'applied';
  created_at: string;
  resolved_at: string | null;
}

interface InsightsResponse {
  guide: { id: string; slug: string; title: string; content: string; team_profile: TeamProfile | null };
  insight: { profile: TeamInsightProfile; signals_analyzed: number; updated_at: string } | null;
  suggestions: Suggestion[];
  stats: { questions: number; feedback: number; submissions: number; newSignals: number };
  threshold: number;
}

// ─── Line diff (LCS) for the merge preview ───────────────────────────────────
type DiffLine = { type: 'same' | 'add' | 'remove'; text: string };

function diffLines(before: string, after: string): DiffLine[] | null {
  const a = before.split('\n');
  const b = after.split('\n');
  if (a.length * b.length > 4_000_000) return null;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ type: 'remove', text: a[i++] });
    else out.push({ type: 'add', text: b[j++] });
  }
  while (i < a.length) out.push({ type: 'remove', text: a[i++] });
  while (j < b.length) out.push({ type: 'add', text: b[j++] });
  return out;
}

// Collapses long runs of unchanged lines so the reviewer sees the changes.
function DiffView({ lines }: { lines: DiffLine[] }) {
  const CONTEXT = 2;
  const keep = lines.map((l, idx) =>
    l.type !== 'same' ||
    lines.slice(Math.max(0, idx - CONTEXT), idx + CONTEXT + 1).some(n => n.type !== 'same')
  );
  const rows: React.ReactNode[] = [];
  let skipped = 0;
  lines.forEach((l, idx) => {
    if (!keep[idx]) { skipped++; return; }
    if (skipped) {
      rows.push(<div key={`skip-${idx}`} className="px-3 py-1 text-xs text-gray-400 bg-gray-50">⋯ {skipped} unchanged line{skipped > 1 ? 's' : ''}</div>);
      skipped = 0;
    }
    const style = l.type === 'add' ? 'bg-green-50 text-green-900' : l.type === 'remove' ? 'bg-red-50 text-red-900 line-through decoration-red-300' : 'text-gray-600';
    const sign = l.type === 'add' ? '+' : l.type === 'remove' ? '−' : ' ';
    rows.push(
      <div key={idx} className={`px-3 whitespace-pre-wrap break-words ${style}`}>
        <span className="select-none inline-block w-4 text-gray-400">{sign}</span>{l.text || ' '}
      </div>
    );
  });
  if (skipped) rows.push(<div key="skip-end" className="px-3 py-1 text-xs text-gray-400 bg-gray-50">⋯ {skipped} unchanged line{skipped > 1 ? 's' : ''}</div>);
  return <div className="font-mono text-xs leading-5 border border-gray-200 rounded-lg overflow-hidden">{rows}</div>;
}

// ─── Small presentational pieces ─────────────────────────────────────────────
function StatTile({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

function scoreStatus(score: number) {
  if (score >= 75) return { label: 'Strong', icon: '✓', className: 'bg-green-100 text-green-800' };
  if (score >= 50) return { label: 'Fair', icon: '!', className: 'bg-amber-100 text-amber-800' };
  return { label: 'Needs attention', icon: '✕', className: 'bg-red-100 text-red-800' };
}

// Single-series horizontal bars; one hue, values labelled in text ink.
function BarList({ items, total }: { items: { label: string; value: number; hint?: string }[]; total: number }) {
  const max = Math.max(1, ...items.map(i => i.value));
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.label} className="group" title={`${item.label}: ${item.value}${total ? ` (${Math.round((item.value / total) * 100)}%)` : ''}`}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">{item.label}</span>
            <span className="text-gray-900 font-medium tabular-nums">
              {item.value}{total ? <span className="text-gray-500 font-normal"> · {Math.round((item.value / total) * 100)}%</span> : null}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded">
            <div className="h-2 bg-blue-500 group-hover:bg-blue-600 rounded transition-all" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          {item.hint && <div className="text-xs text-gray-500 mt-0.5">{item.hint}</div>}
        </div>
      ))}
    </div>
  );
}

const PRIORITY_STYLES: Record<Suggestion['priority'], string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-gray-100 text-gray-700',
};

// ─── Main ────────────────────────────────────────────────────────────────────
export default function TeamInsightsClient({ guideId }: { guideId: string }) {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'applied' | 'dismissed'>('pending');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<'dismiss' | 'generate' | 'merge' | null>(null);
  const [preview, setPreview] = useState<{ content: string; truncated: boolean; ids: string[] } | null>(null);
  const [previewMode, setPreviewMode] = useState<'diff' | 'rendered'>('diff');

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/guides/${guideId}/insights`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load insights');
      setData(json);
      setSelected(new Set());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [guideId]);

  useEffect(() => { load(); }, [load]);

  const byStatus = useMemo(() => {
    const groups = { pending: [] as Suggestion[], applied: [] as Suggestion[], dismissed: [] as Suggestion[] };
    data?.suggestions.forEach(s => groups[s.status].push(s));
    return groups;
  }, [data]);

  const diff = useMemo(
    () => (preview && data ? diffLines(data.guide.content, preview.content) : null),
    [preview, data]
  );

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  };

  const updateStatus = async (ids: string[], status: 'dismissed' | 'pending') => {
    setBusy('dismiss');
    try {
      const res = await fetch(`/api/guides/${guideId}/suggestions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      await load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const generatePreview = async () => {
    const ids = [...selected];
    if (!ids.length) return;
    setBusy('generate');
    try {
      const res = await fetch(`/api/guides/${guideId}/suggestions/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to optimize guide');
      setPreviewMode('diff');
      setPreview({ content: json.content, truncated: json.truncated, ids });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const mergePreview = async () => {
    if (!preview) return;
    setBusy('merge');
    try {
      const res = await fetch(`/api/guides/${guideId}/suggestions/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: preview.ids, content: preview.content, commit: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save guide');
      setPreview(null);
      setTab('applied');
      await load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 text-center text-gray-600">
        <div className="text-lg">Analyzing your team&apos;s activity…</div>
        <div className="text-sm text-gray-400 mt-1">This can take a few seconds when there are new questions.</div>
      </div>
    );
  }
  if (error || !data) {
    return <div className="pt-32 pb-16 text-center text-red-600">{error || 'Failed to load insights'}</div>;
  }

  const { guide, insight, stats, threshold } = data;
  const profile = insight?.profile;
  const breakdown = profile?.question_breakdown;
  const breakdownTotal = breakdown ? breakdown.covered_in_sop + breakdown.unclear_in_sop + breakdown.missing_from_sop + breakdown.off_topic : 0;
  const coveredPct = breakdownTotal ? Math.round((breakdown!.covered_in_sop / breakdownTotal) * 100) : null;
  const list = byStatus[tab];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">📊 Team insights: {guide.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {summarizeTeamProfile(guide.team_profile) ? `Team profile: ${summarizeTeamProfile(guide.team_profile)}` : 'No team profile was set for this guide.'}
            {insight && ` · Updated ${new Date(insight.updated_at).toLocaleString()}`}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/guides/${guide.slug}`} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white">View guide</Link>
          <Link href={`/guides/${guide.slug}/edit`} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white">Edit</Link>
        </div>
      </div>

      {/* ─── Progress towards next analysis ─────────────────────────────── */}
      {stats.newSignals > 0 && stats.newSignals < threshold && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          {stats.newSignals}/{threshold} new questions or feedback since the last analysis.
          The next analysis runs automatically once {threshold} have come in.
        </div>
      )}

      {!profile ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-2">⏳</div>
          <h2 className="text-lg font-semibold text-gray-900">Not enough team activity yet</h2>
          <p className="text-gray-600 text-sm mt-1 max-w-md mx-auto">
            Share the guide with your team. Once they send {threshold} questions or feedback, you&apos;ll see their
            comprehension profile and AI suggestions to improve the SOP here.
          </p>
          <div className="max-w-xs mx-auto mt-4">
            <div className="h-2 bg-gray-100 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${Math.min(100, (stats.newSignals / threshold) * 100)}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{stats.newSignals} / {threshold}</div>
          </div>
        </div>
      ) : (
        <>
          {/* ─── Stat tiles ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              label="Comprehension score"
              value={<>{profile.comprehension_score}<span className="text-base text-gray-400 font-normal">/100</span></>}
              sub={(() => {
                const s = scoreStatus(profile.comprehension_score);
                return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.className}`}><span aria-hidden>{s.icon}</span>{s.label}</span>;
              })()}
            />
            <StatTile label="Questions" value={stats.questions} sub={`${stats.feedback} feedback · ${stats.submissions} submissions`} />
            <StatTile label="Team members" value={profile.member_patterns.length} sub={`${insight!.signals_analyzed} signals analyzed`} />
            <StatTile
              label="Already answered in SOP"
              value={coveredPct === null ? '–' : `${coveredPct}%`}
              sub="Questions the guide already covers"
            />
          </div>

          {/* ─── Summary ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
              <h2 className="font-semibold text-gray-900">Summary</h2>
              <p className="text-sm text-gray-700">{profile.summary}</p>
              {profile.communication_style && (
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-700">Communication style:</span> {profile.communication_style}</p>
              )}
              {profile.strengths.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">What the team understands well</div>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                    {profile.strengths.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
            {breakdown && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Question types</h2>
                <BarList
                  total={breakdownTotal}
                  items={[
                    { label: 'Already in SOP', value: breakdown.covered_in_sop },
                    { label: 'Unclear in SOP', value: breakdown.unclear_in_sop },
                    { label: 'Missing from SOP', value: breakdown.missing_from_sop },
                    { label: 'Off-topic', value: breakdown.off_topic },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {profile.knowledge_gaps.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Topics the team asks about</h2>
                <BarList total={0} items={profile.knowledge_gaps.map(g => ({ label: g.topic, value: g.count }))} />
              </div>
            )}

            {profile.member_patterns.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-x-auto">
                <h2 className="font-semibold text-gray-900 mb-3">Team members</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="py-2 pr-2 font-medium">Member</th>
                      <th className="py-2 px-2 font-medium text-right">Questions</th>
                      <th className="py-2 px-2 font-medium text-right">Already in SOP</th>
                      <th className="py-2 pl-2 font-medium">Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.member_patterns.map(m => (
                      <tr key={m.member} className="border-b border-gray-50 align-top">
                        <td className="py-2 pr-2 text-gray-900">{m.member}</td>
                        <td className="py-2 px-2 text-right tabular-nums">{m.questions}{m.feedback ? <span className="text-gray-400"> +{m.feedback}fb</span> : null}{m.submissions ? <span className="text-gray-400"> +{m.submissions}sub</span> : null}</td>
                        <td className="py-2 px-2 text-right tabular-nums">{m.covered_in_sop}</td>
                        <td className="py-2 pl-2">
                          {m.reliance === 'high' && (
                            <span className="inline-block mb-0.5 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">! Asks before reading</span>
                          )}
                          {m.note && <div className="text-xs text-gray-500">{m.note}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-2">
                  Members flagged &quot;asks before reading&quot; mostly ask things the SOP already covers — the AI doesn&apos;t change the SOP for those questions.
                </p>
              </div>
            )}
          </div>

          {profile.ignored.length > 0 && (
            <details className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <summary className="font-semibold text-gray-900 cursor-pointer">Signals the AI chose not to act on</summary>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {profile.ignored.map((g, i) => (
                  <li key={i}>• {g.reason}{g.count ? <span className="text-gray-400"> ({g.count})</span> : null}</li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}

      {/* ─── Suggestions (PR-style review) ──────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">SOP optimization suggestions</h2>
            <p className="text-sm text-gray-500">Check the ones you approve, preview the changes, then merge them into the guide.</p>
          </div>
          <div className="flex gap-1 text-sm bg-gray-100 rounded-lg p-1 self-start">
            {(['pending', 'applied', 'dismissed'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSelected(new Set()); }}
                className={`px-3 py-1 rounded-md capitalize ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
              >
                {t === 'pending' ? 'Open' : t} ({byStatus[t].length})
              </button>
            ))}
          </div>
        </div>

        {tab === 'pending' && list.length > 0 && (
          <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3 bg-gray-50">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selected.size === list.length}
                onChange={() => setSelected(selected.size === list.length ? new Set() : new Set(list.map(s => s.id)))}
                className="h-4 w-4"
              />
              Select all
            </label>
            <span className="text-sm text-gray-500">{selected.size} selected</span>
            <div className="flex-1" />
            <button
              onClick={() => updateStatus([...selected], 'dismissed')}
              disabled={!selected.size || !!busy}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50"
            >
              Dismiss
            </button>
            <button
              onClick={generatePreview}
              disabled={!selected.size || !!busy}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {busy === 'generate' ? 'Optimizing guide…' : `Apply ${selected.size || ''} approved · 1,000 tokens`}
            </button>
          </div>
        )}

        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            {tab === 'pending'
              ? profile
                ? '🎉 No open suggestions. The AI only suggests changes when the team really needs them.'
                : 'Suggestions will appear after the first analysis.'
              : `No ${tab} suggestions.`}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {list.map(s => (
              <li key={s.id} className="p-5 flex gap-3">
                {tab === 'pending' && (
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => setSelected(prev => toggle(prev, s.id))}
                    className="h-4 w-4 mt-1 shrink-0"
                    aria-label={`Approve: ${s.title}`}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-gray-900">{s.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${PRIORITY_STYLES[s.priority]}`}>{s.priority}</span>
                    {s.section && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">§ {s.section}</span>}
                    <span className="text-xs text-gray-400">{s.evidence_count} signal{s.evidence_count > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{s.rationale}</p>
                  <button
                    onClick={() => setExpanded(prev => toggle(prev, s.id))}
                    className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                  >
                    {expanded.has(s.id) ? 'Hide proposed change' : 'Show proposed change'}
                  </button>
                  {expanded.has(s.id) && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                      {s.proposed_change}
                    </div>
                  )}
                  {tab === 'dismissed' && (
                    <button
                      onClick={() => updateStatus([s.id], 'pending')}
                      disabled={!!busy}
                      className="block text-xs text-gray-500 hover:text-gray-700 mt-2 underline"
                    >
                      Reopen
                    </button>
                  )}
                  {tab === 'applied' && s.resolved_at && (
                    <div className="text-xs text-green-700 mt-2">✓ Merged {new Date(s.resolved_at).toLocaleDateString()}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ─── Merge preview ──────────────────────────────────────────────── */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Review changes</h2>
                <p className="text-sm text-gray-500">{preview.ids.length} approved suggestion{preview.ids.length > 1 ? 's' : ''} applied by AI. Nothing is saved until you merge.</p>
              </div>
              <div className="flex gap-1 text-sm bg-gray-100 rounded-lg p-1 self-start">
                <button onClick={() => setPreviewMode('diff')} className={`px-3 py-1 rounded-md ${previewMode === 'diff' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>Changes</button>
                <button onClick={() => setPreviewMode('rendered')} className={`px-3 py-1 rounded-md ${previewMode === 'rendered' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>New guide</button>
              </div>
            </div>
            {preview.truncated && (
              <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                ⚠️ The guide is very long and the AI output may be cut off at the end. Check the last section before merging.
              </div>
            )}
            <div className="p-5 overflow-y-auto flex-1">
              {previewMode === 'diff' && diff ? <DiffView lines={diff} /> : <GuideView content={preview.content} />}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setPreview(null)} disabled={busy === 'merge'} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Discard
              </button>
              <button onClick={mergePreview} disabled={busy === 'merge'} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                {busy === 'merge' ? 'Merging…' : '✓ Merge into guide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
