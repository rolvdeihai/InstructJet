// src/components/admin/ParticipantsTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { BUSINESS_CATEGORIES, CAPSTONE_STATUS_LABEL, capstoneUnlockDate, type ProgramProfile } from '@/lib/program/config';
import { api, Badge, btn, FieldRow, fmtDate, inputCls, Modal, toDateInput, type Toast } from './ui';

interface Participant {
  id: string;
  user_id: string;
  status: string;
  source: string;
  subscribed_at: string;
  capstone_unlocked: boolean;
  capstone_open: boolean;
  profile: ProgramProfile;
  profile_complete: boolean;
  emails_sent: number;
  last_email_on: string | null;
  email_opt_out: boolean;
  admin_notes: string | null;
  users: { email: string; full_name: string | null; plan_tier: string; is_active: boolean } | null;
  capstone: { id: string; status: string; submitted_at: string | null; claimed_at: string | null } | null;
}

const STATUS_TONE: Record<string, 'green' | 'amber' | 'red' | 'gray'> = { active: 'green', paused: 'amber', canceled: 'gray', deactivated: 'red' };
const categoryLabel = (v?: string) => BUSINESS_CATEGORIES.find((c) => c.value === v)?.label || v || '—';

export default function ParticipantsTab({ toast }: { toast: Toast }) {
  const [list, setList] = useState<Participant[] | null>(null);
  const [status, setStatus] = useState('active');
  const [q, setQ] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollDate, setEnrollDate] = useState('');
  const [open, setOpen] = useState<Participant | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ participants: Participant[] }>(`/api/admin/participants${status ? `?status=${status}` : ''}`);
      setList(d.participants);
    } catch (e) {
      toast('error', (e as Error).message);
    }
  }, [status, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const enroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/api/admin/participants', {
        method: 'POST',
        json: { email: enrollEmail, subscribed_at: enrollDate ? `${enrollDate}T00:00:00Z` : undefined },
      });
      toast('success', `${enrollEmail} enrolled (Premium granted for 3 months)`);
      setEnrollEmail('');
      setEnrollDate('');
      load();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  const filtered = (list || []).filter((p) => {
    if (!q.trim()) return true;
    const hay = `${p.users?.email} ${p.users?.full_name} ${p.profile?.business_name} ${p.profile?.city} ${p.profile?.country}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <div className="space-y-4">
      <form onSubmit={enroll} className="flex flex-wrap items-end gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="min-w-[240px] flex-1">
          <FieldRow label="Enroll an existing user manually" hint="For participants who paid outside Paddle (e.g. Rp150.000 by transfer). They must have an account.">
            <input className={inputCls} type="email" required placeholder="user@email.com" value={enrollEmail} onChange={(e) => setEnrollEmail(e.target.value)} />
          </FieldRow>
        </div>
        <div>
          <FieldRow label="Start date (optional)">
            <input className={inputCls} type="date" value={enrollDate} onChange={(e) => setEnrollDate(e.target.value)} />
          </FieldRow>
        </div>
        <button className={`${btn.primary} mb-5`}>Enroll</button>
      </form>

      <div className="flex flex-wrap gap-2">
        <input className={`${inputCls} max-w-xs`} placeholder="Filter by name, email, business, city" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="canceled">Canceled</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Capstone</th>
              <th className="px-4 py-3">Emails</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list === null && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-gray-500">Loading…</td>
              </tr>
            )}
            {list && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-gray-500">No participants.</td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{p.users?.full_name || '—'}</div>
                  <div className="text-gray-500">{p.users?.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-900">{p.profile?.business_name || <span className="text-gray-400">No profile yet</span>}</div>
                  <div className="text-xs text-gray-500">
                    {categoryLabel(p.profile?.business_category)}
                    {p.profile?.country ? ` · ${[p.profile.city, p.profile.country].filter(Boolean).join(', ')}` : ''}
                  </div>
                  {!p.profile_complete && <Badge tone="amber">profile incomplete</Badge>}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[p.status] || 'gray'}>{p.status}</Badge>
                  <div className="mt-1 text-xs text-gray-500">{p.source}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{fmtDate(p.subscribed_at)}</td>
                <td className="px-4 py-3">
                  {p.capstone ? (
                    <Badge tone={p.capstone.status === 'claimed' ? 'blue' : p.capstone.status === 'fulfilled' ? 'green' : 'gray'}>
                      {CAPSTONE_STATUS_LABEL[p.capstone.status]}
                    </Badge>
                  ) : p.capstone_open ? (
                    <Badge tone="blue">open</Badge>
                  ) : (
                    <span className="text-xs text-gray-500">opens {fmtDate(capstoneUnlockDate(p.subscribed_at).toISOString())}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.emails_sent}
                  {p.email_opt_out && <div><Badge tone="red">unsubscribed</Badge></div>}
                  <div className="text-xs text-gray-400">{p.last_email_on || ''}</div>
                </td>
                <td className="px-4 py-3">
                  <button className={btn.small} onClick={() => setOpen(p)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <ParticipantModal p={open} toast={toast} onClose={() => setOpen(null)} onChanged={load} />}
    </div>
  );
}

const PROFILE_LABELS: [keyof ProgramProfile, string][] = [
  ['business_name', 'Business'],
  ['business_category', 'Category'],
  ['sub_industry', 'Niche'],
  ['description', 'Description'],
  ['target_customers', 'Customers'],
  ['stage', 'Stage'],
  ['years_operating', 'Years operating'],
  ['team_size', 'Team size'],
  ['monthly_revenue', 'Monthly revenue'],
  ['growth_goals', 'Growth goals'],
  ['growth_metric', 'Key metric'],
  ['challenges', 'Challenges'],
  ['skills_to_learn', 'Skills to learn'],
  ['funding', 'Funding'],
  ['event_format', 'Event format'],
  ['city', 'City'],
  ['country', 'Country'],
  ['website', 'Website'],
  ['whatsapp', 'WhatsApp'],
  ['language', 'Email language'],
];

function ParticipantModal({ p, toast, onClose, onChanged }: { p: Participant; toast: Toast; onClose: () => void; onChanged: () => void }) {
  const [f, setF] = useState({
    status: p.status,
    capstone_unlocked: p.capstone_unlocked,
    subscribed_at: toDateInput(p.subscribed_at),
    email_opt_out: p.email_opt_out,
    admin_notes: p.admin_notes || '',
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<{ id: string; subject: string; status: string; kind: string; sent_at: string }[] | null>(null);
  const [preview, setPreview] = useState<{ subject: string; html: string } | null | 'none'>(null);

  useEffect(() => {
    api<{ log: any[] }>(`/api/admin/participants/send?id=${p.id}`)
      .then((d) => setLog(d.log))
      .catch(() => setLog([]));
  }, [p.id]);

  const save = async () => {
    setBusy('save');
    try {
      await api('/api/admin/participants', { method: 'PATCH', json: { id: p.id, ...f, subscribed_at: `${f.subscribed_at}T00:00:00Z` } });
      toast('success', 'Participant updated');
      onChanged();
      onClose();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const send = async (previewOnly: boolean) => {
    setBusy(previewOnly ? 'preview' : 'send');
    try {
      if (previewOnly) {
        const d = await api<{ email: { subject: string; html: string } | null }>('/api/admin/participants/send', { method: 'POST', json: { id: p.id, preview: true } });
        setPreview(d.email || 'none');
      } else {
        if (!window.confirm(`Send the next program email to ${p.users?.email} now?`)) return;
        const d = await api<{ result: string }>('/api/admin/participants/send', { method: 'POST', json: { id: p.id } });
        toast(d.result === 'sent' ? 'success' : 'error', d.result === 'sent' ? 'Email sent' : d.result === 'skipped' ? 'Nothing to send right now' : 'Sending failed');
        onChanged();
      }
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!window.confirm('Remove this participant from the program? Their profile and capstone are deleted. The user account stays.')) return;
    try {
      await api(`/api/admin/participants?id=${p.id}`, { method: 'DELETE' });
      toast('success', 'Participant removed');
      onChanged();
      onClose();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  return (
    <Modal title={p.users?.email || 'Participant'} onClose={onClose} wide>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Membership</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Status" hint="Only active participants receive emails">
              <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="canceled">Canceled</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </FieldRow>
            <FieldRow label="Program start" hint="Capstone opens 90 days after this">
              <input type="date" className={inputCls} value={f.subscribed_at} onChange={(e) => setF({ ...f, subscribed_at: e.target.value })} />
            </FieldRow>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={f.capstone_unlocked} onChange={(e) => setF({ ...f, capstone_unlocked: e.target.checked })} />
            Unlock the capstone now (before the 3-month mark)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={f.email_opt_out} onChange={(e) => setF({ ...f, email_opt_out: e.target.checked })} />
            Unsubscribed from program emails
          </label>
          <FieldRow label="Admin notes (private)">
            <textarea className={inputCls} rows={3} value={f.admin_notes} onChange={(e) => setF({ ...f, admin_notes: e.target.value })} />
          </FieldRow>
          <div className="flex flex-wrap gap-2">
            <button className={btn.primary} onClick={save} disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save'}</button>
            <button className={btn.secondary} onClick={() => send(true)} disabled={!!busy}>{busy === 'preview' ? 'Loading…' : 'Preview next email'}</button>
            <button className={btn.secondary} onClick={() => send(false)} disabled={!!busy}>{busy === 'send' ? 'Sending…' : 'Send now'}</button>
            <button className={btn.danger} onClick={remove} disabled={!!busy}>Remove</button>
          </div>

          <h4 className="pt-2 font-semibold text-gray-900">Email history</h4>
          <ul className="max-h-56 divide-y divide-gray-100 overflow-y-auto text-sm">
            {log === null && <li className="py-2 text-gray-500">Loading…</li>}
            {log?.length === 0 && <li className="py-2 text-gray-500">No emails yet.</li>}
            {log?.map((l) => (
              <li key={l.id} className="flex items-start justify-between gap-2 py-2">
                <span>
                  <span className="text-gray-900">{l.subject}</span>
                  <span className="block text-xs text-gray-500">{fmtDate(l.sent_at, true)} · {l.kind}</span>
                </span>
                <Badge tone={l.status === 'sent' ? 'green' : 'red'}>{l.status}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">Business profile</h4>
          <dl className="mt-3 space-y-2 text-sm">
            {PROFILE_LABELS.map(([k, label]) => {
              const v = p.profile?.[k];
              if (!v) return null;
              return (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase text-gray-500">{label}</dt>
                  <dd className="whitespace-pre-wrap text-gray-800">{k === 'business_category' ? categoryLabel(v as string) : String(v)}</dd>
                </div>
              );
            })}
            {p.profile?.opportunities?.length ? (
              <div>
                <dt className="text-xs font-semibold uppercase text-gray-500">Wants</dt>
                <dd className="text-gray-800">{p.profile.opportunities.join(', ')}</dd>
              </div>
            ) : null}
            {!p.profile?.business_name && <p className="text-gray-500">The participant has not filled in their profile yet.</p>}
          </dl>
        </div>
      </div>

      {preview && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          {preview === 'none' ? (
            <p className="text-sm text-gray-500">Nothing is due for this participant right now.</p>
          ) : (
            <>
              <p className="mb-2 text-sm"><span className="text-gray-500">Subject:</span> <strong>{preview.subject}</strong></p>
              <iframe title="Email preview" srcDoc={preview.html} sandbox="" className="h-[500px] w-full rounded-xl border border-gray-200" />
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
