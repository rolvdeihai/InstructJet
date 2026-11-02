// components/GuideReminders.tsx
//
// Daily email reminders for workers assigned to a guide.
// - <ReminderDraftFields>: used while creating a guide (saved after publish).
// - <GuideRemindersPanel>: manages reminders of an existing guide live.

'use client';

import { useCallback, useEffect, useState } from 'react';

export interface ReminderWorker {
  email: string;
  name?: string;
  deadline: string; // YYYY-MM-DD
}

export interface ReminderDraft {
  enabled: boolean;
  message: string;
  workers: ReminderWorker[];
}

export const EMPTY_REMINDER_DRAFT: ReminderDraft = { enabled: false, message: '', workers: [] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dateOnly = (d: Date) => d.toISOString().slice(0, 10);
const inDays = (n: number) => dateOnly(new Date(Date.now() + n * 86_400_000));

/** Accepts "email", "Name <email>" or "Name, email" — one per line or separated by ";". */
function parseWorkers(input: string, deadline: string): { workers: ReminderWorker[]; invalid: string[] } {
  const workers: ReminderWorker[] = [];
  const invalid: string[] = [];
  input
    .split(/[\n;]+/)
    .map(l => l.trim())
    .filter(Boolean)
    .forEach(line => {
      const angle = line.match(/^(.*)<([^>]+)>$/);
      let name = '';
      let email = line;
      if (angle) {
        name = angle[1].trim().replace(/,$/, '');
        email = angle[2].trim();
      } else if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim());
        email = parts.find(p => EMAIL_RE.test(p)) || line;
        name = parts.filter(p => p !== email).join(' ');
      }
      email = email.toLowerCase();
      if (EMAIL_RE.test(email)) workers.push({ email, name: name || undefined, deadline });
      else invalid.push(line);
    });
  return { workers, invalid };
}

function mergeWorkers(existing: ReminderWorker[], added: ReminderWorker[]) {
  const byEmail = new Map(existing.map(w => [w.email, w]));
  added.forEach(w => byEmail.set(w.email, { ...byEmail.get(w.email), ...w }));
  return [...byEmail.values()];
}

// ─── Add-workers form (shared) ───────────────────────────────────────────────
function AddWorkersForm({ onAdd, busy }: { onAdd: (workers: ReminderWorker[]) => Promise<void> | void; busy?: boolean }) {
  const [input, setInput] = useState('');
  const [deadline, setDeadline] = useState(inDays(7));
  const [error, setError] = useState<string | null>(null);

  const add = async () => {
    const { workers, invalid } = parseWorkers(input, deadline);
    if (invalid.length) {
      setError(`Not a valid email: ${invalid.slice(0, 3).join(', ')}${invalid.length > 3 ? '…' : ''}`);
      return;
    }
    if (!workers.length) {
      setError('Enter at least one email.');
      return;
    }
    if (deadline < dateOnly(new Date())) {
      setError('The deadline must be today or later.');
      return;
    }
    setError(null);
    await onAdd(workers);
    setInput('');
  };

  return (
    <div className="space-y-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={'One worker per line, e.g.\nbudi@company.com\nSiti <siti@company.com>'}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        rows={3}
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-gray-700">Deadline</label>
        <input
          type="date"
          value={deadline}
          min={dateOnly(new Date())}
          onChange={(e) => setDeadline(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
        />
        <button
          type="button"
          onClick={add}
          disabled={busy}
          className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {busy ? 'Adding…' : 'Add workers'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ReminderHelp() {
  return (
    <p className="text-xs text-gray-500">
      Each worker gets an email now and a reminder every morning until their deadline (plus a few overdue days).
      Reminders stop automatically when they submit work with the same email.
    </p>
  );
}

// ─── Draft mode (create page) ────────────────────────────────────────────────
export function ReminderDraftFields({ value, onChange }: { value: ReminderDraft; onChange: (v: ReminderDraft) => void }) {
  return (
    <div className="space-y-3">
      <ReminderHelp />
      <AddWorkersForm onAdd={(workers) => onChange({ ...value, workers: mergeWorkers(value.workers, workers) })} />
      {value.workers.length > 0 && (
        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg max-h-56 overflow-y-auto">
          {value.workers.map(w => (
            <li key={w.email} className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
              <span className="flex-1 min-w-0 truncate">{w.name ? `${w.name} · ` : ''}{w.email}</span>
              <input
                type="date"
                value={w.deadline}
                min={dateOnly(new Date())}
                onChange={(e) => onChange({ ...value, workers: value.workers.map(x => x.email === w.email ? { ...x, deadline: e.target.value } : x) })}
                className="px-2 py-0.5 border border-gray-300 rounded text-xs"
              />
              <button
                type="button"
                onClick={() => onChange({ ...value, workers: value.workers.filter(x => x.email !== w.email) })}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message to include (optional)</label>
        <textarea
          value={value.message}
          onChange={(e) => onChange({ ...value, message: e.target.value })}
          placeholder="e.g. Please finish this before the audit on Friday."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          rows={2}
          maxLength={1000}
        />
      </div>
    </div>
  );
}

/** Saves a draft's workers for a freshly published guide. Returns an error message or null. */
export async function saveReminderDraft(guideId: string, draft: ReminderDraft): Promise<string | null> {
  if (!draft.enabled || !draft.workers.length) return null;
  const res = await fetch(`/api/guides/${guideId}/reminders`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reminders: draft.workers }),
  });
  if (res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data.error || 'Failed to save reminders';
}

// ─── Live mode (edit page) ───────────────────────────────────────────────────
interface ReminderRow {
  id: string;
  worker_email: string;
  worker_name: string | null;
  deadline: string;
  status: 'active' | 'completed' | 'stopped' | 'expired';
  last_sent_on: string | null;
  send_count: number;
}

const STATUS_STYLES: Record<ReminderRow['status'], { label: string; className: string }> = {
  active: { label: '● Reminding', className: 'bg-blue-50 text-blue-700' },
  completed: { label: '✓ Submitted', className: 'bg-green-100 text-green-800' },
  stopped: { label: '■ Unsubscribed', className: 'bg-gray-100 text-gray-700' },
  expired: { label: '! Expired', className: 'bg-amber-100 text-amber-800' },
};

export function GuideRemindersPanel({ guideId }: { guideId: string }) {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [rows, setRows] = useState<ReminderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const api = useCallback(async (method: string, body?: unknown) => {
    const res = await fetch(`/api/guides/${guideId}/reminders`, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }, [guideId]);

  useEffect(() => {
    api('GET')
      .then(data => {
        setEnabled(data.enabled);
        setMessage(data.message);
        setSavedMessage(data.message);
        setRows(data.reminders);
      })
      .catch(err => setNotice(err.message))
      .finally(() => setLoading(false));
  }, [api]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setNotice(null);
    try {
      await fn();
    } catch (err: any) {
      setNotice(`❌ ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const toggleEnabled = () => run(async () => {
    await api('PUT', { enabled: !enabled });
    setEnabled(!enabled);
  });

  const addWorkers = (workers: ReminderWorker[]) => run(async () => {
    const data = await api('POST', { reminders: workers });
    setRows(data.reminders);
    setNotice(data.sent ? `✅ Added. ${data.sent} email${data.sent > 1 ? 's' : ''} sent.` : '✅ Added.');
  });

  const updateDeadline = (row: ReminderRow, deadline: string) => run(async () => {
    const data = await api('POST', { reminders: [{ email: row.worker_email, name: row.worker_name, deadline }] });
    setRows(data.reminders);
  });

  const remove = (row: ReminderRow) => run(async () => {
    const data = await api('DELETE', { ids: [row.id] });
    setRows(data.reminders);
  });

  const saveMessage = () => run(async () => {
    await api('PUT', { message });
    setSavedMessage(message);
  });

  if (loading) return <div className="text-sm text-gray-500">Loading reminders…</div>;

  const pending = rows.filter(r => r.status === 'active').length;
  const done = rows.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input type="checkbox" checked={enabled} onChange={toggleEnabled} disabled={busy} className="h-4 w-4" />
        🔔 Send daily email reminders to workers
      </label>

      {enabled && (
        <>
          <ReminderHelp />
          <AddWorkersForm onAdd={addWorkers} busy={busy} />

          {rows.length > 0 && (
            <>
              <div className="text-xs text-gray-500">{done}/{rows.length} submitted · {pending} still being reminded</div>
              <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg max-h-72 overflow-y-auto">
                {rows.map(r => (
                  <li key={r.id} className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
                    <span className="flex-1 min-w-[160px] truncate" title={r.worker_email}>
                      {r.worker_name ? `${r.worker_name} · ` : ''}{r.worker_email}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[r.status].className}`}>{STATUS_STYLES[r.status].label}</span>
                    <span className="text-xs text-gray-400">{r.send_count} sent</span>
                    <input
                      type="date"
                      value={r.deadline}
                      min={dateOnly(new Date())}
                      onChange={(e) => e.target.value && updateDeadline(r, e.target.value)}
                      disabled={busy}
                      className="px-2 py-0.5 border border-gray-300 rounded text-xs"
                      title="Changing the deadline re-activates reminders"
                    />
                    <button type="button" onClick={() => remove(r)} disabled={busy} className="text-xs text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message to include (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Please finish this before the audit on Friday."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={2}
              maxLength={1000}
            />
            {message !== savedMessage && (
              <button type="button" onClick={saveMessage} disabled={busy} className="mt-1 px-3 py-1 border border-gray-300 rounded-lg text-xs">
                Save message
              </button>
            )}
          </div>
        </>
      )}
      {notice && <p className="text-sm">{notice}</p>}
    </div>
  );
}
