// src/components/admin/CapstonesTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { CAPSTONE_QUESTIONS, CAPSTONE_STATUS_LABEL, type CapstoneCertificate, type CapstoneProject, type ProgramProfile } from '@/lib/program/config';
import { api, Badge, btn, FieldRow, fmtDate, inputCls, Modal, safeHref, type Toast } from './ui';

interface Capstone {
  id: string;
  status: string;
  certificates: CapstoneCertificate[];
  answers: Record<string, string>;
  project: CapstoneProject;
  submitted_at: string | null;
  claimed_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  updated_at: string;
  users: { email: string; full_name: string | null } | null;
  program_participants: { subscribed_at: string; status: string; profile: ProgramProfile } | null;
}

const FILTERS = [
  { value: 'claimed', label: 'Eligible: claim requested' },
  { value: 'submitted', label: 'Submitted, not claimed' },
  { value: 'approved', label: 'Approved (to fulfil)' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'rejected', label: 'Needs revision' },
  { value: 'draft', label: 'Drafts' },
  { value: '', label: 'All' },
];

const TONE: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple'> = {
  claimed: 'blue',
  submitted: 'purple',
  approved: 'green',
  fulfilled: 'green',
  rejected: 'red',
  draft: 'gray',
};

export default function CapstonesTab({ toast }: { toast: Toast }) {
  const [filter, setFilter] = useState('claimed');
  const [list, setList] = useState<Capstone[] | null>(null);
  const [open, setOpen] = useState<Capstone | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ capstones: Capstone[] }>(`/api/admin/capstones${filter ? `?status=${filter}` : ''}`);
      setList(d.capstones);
    } catch (e) {
      toast('error', (e as Error).message);
    }
  }, [filter, toast]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filter === f.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list === null && <p className="text-gray-500">Loading…</p>}
        {list?.length === 0 && <p className="text-gray-500">Nothing here.</p>}
        {list?.map((c) => (
          <button key={c.id} onClick={() => setOpen(c)} className="rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-primary-300 hover:shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-gray-900">{c.users?.full_name || c.users?.email}</div>
                <div className="text-xs text-gray-500">{c.users?.email}</div>
              </div>
              <Badge tone={TONE[c.status]}>{CAPSTONE_STATUS_LABEL[c.status]}</Badge>
            </div>
            <div className="mt-3 text-sm text-gray-800">{c.project?.title || <span className="text-gray-400">No project title</span>}</div>
            <div className="mt-1 text-xs text-gray-500">
              {c.program_participants?.profile?.business_name || '—'} · {c.certificates?.length || 0} certificates
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {c.claimed_at ? `Claimed ${fmtDate(c.claimed_at)}` : c.submitted_at ? `Submitted ${fmtDate(c.submitted_at)}` : `Updated ${fmtDate(c.updated_at)}`}
            </div>
          </button>
        ))}
      </div>

      {open && <CapstoneModal c={open} toast={toast} onClose={() => setOpen(null)} onChanged={load} />}
    </div>
  );
}

function CapstoneModal({ c, toast, onClose, onChanged }: { c: Capstone; toast: Toast; onClose: () => void; onChanged: () => void }) {
  const [notes, setNotes] = useState(c.review_notes || '');
  const [busy, setBusy] = useState(false);

  const setStatus = async (status: string) => {
    if (status === 'rejected' && !notes.trim()) {
      toast('error', 'Write what needs to change in the notes first — the participant sees them.');
      return;
    }
    setBusy(true);
    try {
      await api('/api/admin/capstones', { method: 'PATCH', json: { id: c.id, status, review_notes: notes } });
      toast('success', `Marked as ${CAPSTONE_STATUS_LABEL[status]}`);
      onChanged();
      onClose();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={`Capstone · ${c.users?.email}`} onClose={onClose} wide>
      <div className="space-y-6 text-sm">
        <div className="flex flex-wrap gap-4 text-gray-600">
          <span>Status: <Badge tone={TONE[c.status]}>{CAPSTONE_STATUS_LABEL[c.status]}</Badge></span>
          <span>Program start: {fmtDate(c.program_participants?.subscribed_at)}</span>
          <span>Submitted: {fmtDate(c.submitted_at)}</span>
          <span>Claimed: {fmtDate(c.claimed_at)}</span>
        </div>

        <section>
          <h4 className="font-semibold text-gray-900">Certificates</h4>
          <ul className="mt-2 space-y-1">
            {(c.certificates || []).map((cert, i) => (
              <li key={i}>
                <a href={safeHref(cert.url)} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {cert.name || cert.url}
                </a>
                {cert.issuer && <span className="text-gray-500"> · {cert.issuer}</span>}
              </li>
            ))}
            {!c.certificates?.length && <li className="text-gray-500">None</li>}
          </ul>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900">Answers</h4>
          <div className="mt-2 space-y-4">
            {CAPSTONE_QUESTIONS.map((q, i) => (
              <div key={q.id}>
                <p className="font-medium text-gray-700">{i + 1}. {q.question}</p>
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-gray-800">{c.answers?.[q.id] || <span className="text-gray-400">No answer</span>}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900">Project: {c.project?.title || '—'}</h4>
          {(['problem', 'solution', 'outcome'] as const).map((k) => (
            <div key={k} className="mt-2">
              <p className="text-xs font-semibold uppercase text-gray-500">{k}</p>
              <p className="whitespace-pre-wrap text-gray-800">{c.project?.[k] || '—'}</p>
            </div>
          ))}
          {c.project?.link && (
            <a href={safeHref(c.project.link)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-primary-600 hover:underline">
              Evidence link
            </a>
          )}
        </section>

        <section className="border-t border-gray-100 pt-4">
          <FieldRow label="Review notes" hint="Shown to the participant when you ask for a revision">
            <textarea className={inputCls} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </FieldRow>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className={btn.primary} disabled={busy} onClick={() => setStatus('approved')}>Approve</button>
            <button className={btn.secondary} disabled={busy} onClick={() => setStatus('fulfilled')}>Mark Claude Cowork granted</button>
            <button className={btn.danger} disabled={busy} onClick={() => setStatus('rejected')}>Needs revision</button>
          </div>
        </section>
      </div>
    </Modal>
  );
}
