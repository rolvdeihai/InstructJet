// src/components/admin/RequestsTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ProgramProfile } from '@/lib/program/config';
import {
  DEFAULT_DECISION_MESSAGE,
  describeRequest,
  type DecisionMessages,
  REQUEST_STATUS_LABEL,
  REQUEST_TYPE_LABEL,
  requestTitle,
  type RequestStatus,
  type RequestType,
} from '@/lib/program/requests';
import { api, Badge, btn, FieldRow, fmtDate, inputCls, Modal, safeHref, type Toast } from './ui';

interface HelpRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  details: Record<string, string>;
  admin_message: string | null;
  reviewed_at: string | null;
  decision_email_sent: boolean | null;
  created_at: string;
  users: { email: string; full_name: string | null } | null;
  program_participants: { status: string; profile: ProgramProfile } | null;
}

const STATUS_FILTERS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Not approved' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: '', label: 'All' },
];
const TYPE_FILTERS = [
  { value: '', label: 'All types' },
  { value: 'helper', label: 'Helper / worker' },
  { value: 'funding', label: 'Funding / investment' },
];

const TONE: Record<RequestStatus, 'blue' | 'green' | 'red' | 'gray'> = {
  pending: 'blue',
  approved: 'green',
  rejected: 'red',
  withdrawn: 'gray',
};

export default function RequestsTab({ toast }: { toast: Toast }) {
  const [status, setStatus] = useState('pending');
  const [type, setType] = useState('');
  const [list, setList] = useState<HelpRequest[] | null>(null);
  const [open, setOpen] = useState<HelpRequest | null>(null);
  const [defaults, setDefaults] = useState<DecisionMessages>(DEFAULT_DECISION_MESSAGE);
  const [editingDefaults, setEditingDefaults] = useState(false);

  useEffect(() => {
    api<{ messages: DecisionMessages }>('/api/admin/requests/settings')
      .then((d) => setDefaults(d.messages))
      .catch((e) => toast('error', (e as Error).message));
  }, [toast]);

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams();
      if (status) qs.set('status', status);
      if (type) qs.set('type', type);
      const d = await api<{ requests: HelpRequest[] }>(`/api/admin/requests?${qs}`);
      setList(d.requests);
    } catch (e) {
      toast('error', (e as Error).message);
    }
  }, [status, type, toast]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${status === f.value ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select className={`${inputCls} w-auto`} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <button className={btn.secondary} onClick={() => setEditingDefaults(true)}>
            ⚙ Default messages
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list === null && <p className="text-gray-500">Loading…</p>}
        {list?.length === 0 && <p className="text-gray-500">Nothing here.</p>}
        {list?.map((r) => (
          <button key={r.id} onClick={() => setOpen(r)} className="rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-primary-300 hover:shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-semibold text-gray-900">{r.users?.full_name || r.users?.email}</div>
                <div className="truncate text-xs text-gray-500">{r.program_participants?.profile?.business_name || r.users?.email}</div>
              </div>
              <Badge tone={TONE[r.status]}>{REQUEST_STATUS_LABEL[r.status]}</Badge>
            </div>
            <div className="mt-3">
              <Badge tone={r.type === 'funding' ? 'amber' : 'purple'}>{REQUEST_TYPE_LABEL[r.type]}</Badge>
            </div>
            <div className="mt-2 text-sm text-gray-800">{requestTitle(r.type, r.details)}</div>
            <div className="mt-2 text-xs text-gray-400">
              Sent {fmtDate(r.created_at)}
              {r.reviewed_at && ` · reviewed ${fmtDate(r.reviewed_at)}`}
            </div>
          </button>
        ))}
      </div>

      {open && <RequestModal r={open} defaults={defaults} toast={toast} onClose={() => setOpen(null)} onChanged={load} />}
      {editingDefaults && (
        <DefaultsModal initial={defaults} toast={toast} onClose={() => setEditingDefaults(false)} onSaved={setDefaults} />
      )}
    </div>
  );
}

function RequestModal({
  r,
  defaults,
  toast,
  onClose,
  onChanged,
}: {
  r: HelpRequest;
  defaults: DecisionMessages;
  toast: Toast;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [decision, setDecision] = useState<'approved' | 'rejected'>(r.status === 'rejected' ? 'rejected' : 'approved');
  const [messages, setMessages] = useState<Record<'approved' | 'rejected', string>>({
    approved: r.status === 'approved' && r.admin_message ? r.admin_message : defaults[r.type].approved,
    rejected: r.status === 'rejected' && r.admin_message ? r.admin_message : defaults[r.type].rejected,
  });
  const [sendEmail, setSendEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  const rows = describeRequest(r.type, r.details);
  const isDefault = messages[decision] === defaults[r.type][decision];
  const decided = r.status === 'approved' || r.status === 'rejected';

  const submit = async () => {
    if (!messages[decision].trim()) {
      toast('error', 'Write a message for the participant.');
      return;
    }
    setBusy(true);
    try {
      const d = await api<{ emailed: boolean | null }>('/api/admin/requests', {
        method: 'PATCH',
        json: { id: r.id, decision, message: messages[decision], sendEmail },
      });
      toast(
        d.emailed === false ? 'error' : 'success',
        `Marked as ${REQUEST_STATUS_LABEL[decision]}` +
          (d.emailed === true ? ' · email sent' : d.emailed === false ? ' · but the email failed to send' : ' · no email sent')
      );
      onChanged();
      onClose();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={`${REQUEST_TYPE_LABEL[r.type]} · ${r.users?.email}`} onClose={onClose} wide>
      <div className="space-y-6 text-sm">
        <div className="flex flex-wrap gap-4 text-gray-600">
          <span>
            Status: <Badge tone={TONE[r.status]}>{REQUEST_STATUS_LABEL[r.status]}</Badge>
          </span>
          <span>Sent: {fmtDate(r.created_at, true)}</span>
          {r.reviewed_at && <span>Reviewed: {fmtDate(r.reviewed_at, true)}</span>}
          {r.decision_email_sent === false && <Badge tone="red">Decision email failed</Badge>}
        </div>

        <section>
          <h4 className="font-semibold text-gray-900">{r.users?.full_name || r.users?.email}</h4>
          <p className="text-gray-600">
            {r.users?.email}
            {r.program_participants?.profile?.business_name && ` · ${r.program_participants.profile.business_name}`}
            {r.program_participants?.profile?.city && ` · ${r.program_participants.profile.city}`}
            {r.program_participants?.profile?.country && `, ${r.program_participants.profile.country}`}
            {r.program_participants?.profile?.whatsapp && ` · WhatsApp ${r.program_participants.profile.whatsapp}`}
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900">{requestTitle(r.type, r.details)}</h4>
          <dl className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 px-3 py-2 sm:grid-cols-[200px_1fr]">
                <dt className="text-xs font-semibold uppercase text-gray-500">{row.label}</dt>
                <dd className="whitespace-pre-wrap break-words text-gray-800">
                  {row.label === 'Pitch deck' ? (
                    <a href={safeHref(row.value)} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {r.status === 'withdrawn' ? (
          <p className="rounded-lg bg-gray-50 p-3 text-gray-600">The participant withdrew this request.</p>
        ) : (
          <section className="space-y-3 border-t border-gray-100 pt-4">
            {decided && (
              <p className="rounded-lg bg-amber-50 p-3 text-amber-800">
                Already {REQUEST_STATUS_LABEL[r.status].toLowerCase()}. Deciding again overwrites the decision and, if enabled, emails the participant again.
              </p>
            )}
            <div className="flex gap-2">
              {(['approved', 'rejected'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDecision(d)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                    decision === d ? (d === 'approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'border border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {d === 'approved' ? 'Approve' : 'Disapprove'}
                </button>
              ))}
            </div>
            <FieldRow label={`Message to the participant ${isDefault ? '(default)' : '(customized)'}`} hint="Included in the email and shown on their Leadership Info page.">
              <textarea
                className={inputCls}
                rows={6}
                value={messages[decision]}
                onChange={(e) => setMessages({ ...messages, [decision]: e.target.value })}
              />
            </FieldRow>
            <div className="flex flex-wrap items-center gap-4">
              {!isDefault && (
                <button
                  type="button"
                  className={btn.small}
                  onClick={() => setMessages({ ...messages, [decision]: defaults[r.type][decision] })}
                >
                  Reset to default message
                </button>
              )}
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                Email the participant
              </label>
            </div>
            <button className={decision === 'approved' ? btn.primary : `${btn.primary} !bg-red-600 hover:!bg-red-700`} disabled={busy} onClick={submit}>
              {busy ? 'Saving…' : decision === 'approved' ? 'Approve request' : 'Disapprove request'}
            </button>
          </section>
        )}
      </div>
    </Modal>
  );
}

function DefaultsModal({
  initial,
  toast,
  onClose,
  onSaved,
}: {
  initial: DecisionMessages;
  toast: Toast;
  onClose: () => void;
  onSaved: (m: DecisionMessages) => void;
}) {
  const [m, setM] = useState<DecisionMessages>(initial);
  const [busy, setBusy] = useState(false);
  const set = (t: RequestType, d: 'approved' | 'rejected', v: string) => setM({ ...m, [t]: { ...m[t], [d]: v } });

  const save = async () => {
    setBusy(true);
    try {
      const d = await api<{ messages: DecisionMessages }>('/api/admin/requests/settings', { method: 'PUT', json: { messages: m } });
      onSaved(d.messages);
      toast('success', 'Default messages saved');
      onClose();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Default decision messages" onClose={onClose} wide>
      <div className="space-y-6 text-sm">
        <p className="text-gray-600">
          These pre-fill the message box when you approve or disapprove a request. You can still edit the message for each request before sending. Leave a
          box empty to use the built-in text.
        </p>
        {(['helper', 'funding'] as const).map((t) => (
          <section key={t} className="space-y-3">
            <h4 className="font-semibold text-gray-900">{REQUEST_TYPE_LABEL[t]}</h4>
            {(['approved', 'rejected'] as const).map((d) => {
              const builtIn = DEFAULT_DECISION_MESSAGE[t][d];
              return (
                <div key={d}>
                  <FieldRow label={d === 'approved' ? 'When approved' : 'When disapproved'}>
                    <textarea className={inputCls} rows={5} value={m[t][d]} placeholder={builtIn} onChange={(e) => set(t, d, e.target.value)} />
                  </FieldRow>
                  {m[t][d] !== builtIn && (
                    <button type="button" className={`${btn.small} mt-1`} onClick={() => set(t, d, builtIn)}>
                      Restore built-in text
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        ))}
        <div className="flex gap-2 border-t border-gray-100 pt-4">
          <button className={btn.primary} disabled={busy} onClick={save}>
            {busy ? 'Saving…' : 'Save default messages'}
          </button>
          <button className={btn.secondary} disabled={busy} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
