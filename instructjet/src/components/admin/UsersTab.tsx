// src/components/admin/UsersTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, FieldRow, fmtDate, inputCls, Modal, toDateInput, type Toast } from './ui';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  plan_tier: string;
  subscription_plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
  role: string;
  is_active: boolean;
  created_at?: string;
  tokens: { subscription_tokens: number; package_tokens: number } | null;
  participant: { id: string; status: string } | null;
}

export default function UsersTab({ toast, adminId }: { toast: Toast; adminId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('q', search);
      if (plan) params.set('plan', plan);
      if (role) params.set('role', role);
      if (status) params.set('status', status);
      const d = await api<{ users: User[]; total: number; pageSize: number }>(`/api/admin/users?${params}`);
      setUsers(d.users);
      setTotal(d.total);
      setPageSize(d.pageSize);
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, search, plan, role, status, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const quick = async (u: User, patch: Partial<User>, label: string) => {
    try {
      await api('/api/admin/users', { method: 'PATCH', json: { id: u.id, ...patch } });
      toast('success', label);
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  const enroll = async (u: User) => {
    if (!window.confirm(`Enroll ${u.email} in the Business Support Program? They also get Premium for 3 months.`)) return;
    try {
      await api('/api/admin/participants', { method: 'POST', json: { email: u.email } });
      toast('success', `${u.email} enrolled`);
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(q.trim());
        }}
      >
        <input className={`${inputCls} max-w-xs`} placeholder="Search email or name" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={plan} onChange={(e) => { setPage(1); setPlan(e.target.value); }}>
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <select className={`${inputCls} w-auto`} value={role} onChange={(e) => { setPage(1); setRole(e.target.value); }}>
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select className={`${inputCls} w-auto`} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">Active & deactivated</option>
          <option value="active">Active</option>
          <option value="inactive">Deactivated</option>
        </select>
        <button className={btn.secondary}>Search</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Until</th>
              <th className="px-4 py-3">Tokens (sub / pack)</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-gray-500">Loading…</td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className={u.is_active ? '' : 'bg-red-50/40'}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{u.full_name || '—'}</div>
                  <div className="text-gray-500">{u.email}</div>
                  <div className="mt-1 flex gap-1">
                    {u.role === 'admin' && <Badge tone="purple">admin</Badge>}
                    {!u.is_active && <Badge tone="red">deactivated</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={u.plan_tier === 'premium' ? 'green' : 'gray'}>{u.plan_tier}</Badge>
                  {u.subscription_plan === 'business_program' && <div className="mt-1 text-xs text-gray-500">via program</div>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{fmtDate(u.current_period_end)}</td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">
                  {(u.tokens?.subscription_tokens ?? 0).toLocaleString()} / {(u.tokens?.package_tokens ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {u.participant ? <Badge tone={u.participant.status === 'active' ? 'green' : 'amber'}>{u.participant.status}</Badge> : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button className={btn.small} onClick={() => setEditing(u)}>Edit</button>
                    {!u.participant && <button className={btn.small} onClick={() => enroll(u)}>Enroll in program</button>}
                    {u.id !== adminId &&
                      (u.is_active ? (
                        <button
                          className={btn.small}
                          onClick={() => window.confirm(`Deactivate ${u.email}? They are signed out and cannot log in.`) && quick(u, { is_active: false }, 'User deactivated')}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button className={btn.small} onClick={() => quick(u, { is_active: true }, 'User reactivated')}>Reactivate</button>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{total.toLocaleString()} users</span>
        <div className="flex items-center gap-2">
          <button className={btn.small} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} / {pages}</span>
          <button className={btn.small} disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      {editing && (
        <EditUser
          user={editing}
          isSelf={editing.id === adminId}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            toast('success', 'User updated');
            load();
          }}
          toast={toast}
        />
      )}
    </div>
  );
}

function EditUser({ user, isSelf, onClose, onSaved, toast }: { user: User; isSelf: boolean; onClose: () => void; onSaved: () => void; toast: Toast }) {
  const [f, setF] = useState({
    full_name: user.full_name || '',
    role: user.role,
    is_active: user.is_active,
    plan_tier: user.plan_tier,
    subscription_plan: user.subscription_plan || '',
    subscription_status: user.subscription_status || '',
    current_period_end: toDateInput(user.current_period_end),
    subscription_tokens: user.tokens?.subscription_tokens ?? 0,
    package_tokens: user.tokens?.package_tokens ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api('/api/admin/users', {
        method: 'PATCH',
        json: {
          id: user.id,
          ...f,
          current_period_end: f.current_period_end ? `${f.current_period_end}T23:59:59Z` : '',
        },
      });
      onSaved();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={`Edit ${user.email}`} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldRow label="Full name">
            <input className={inputCls} value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
          </FieldRow>
        </div>
        <FieldRow label="Plan">
          <select className={inputCls} value={f.plan_tier} onChange={(e) => setF({ ...f, plan_tier: e.target.value })}>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </FieldRow>
        <FieldRow label="Plan valid until">
          <input type="date" className={inputCls} value={f.current_period_end} onChange={(e) => setF({ ...f, current_period_end: e.target.value })} />
        </FieldRow>
        <FieldRow label="Subscription source">
          <select className={inputCls} value={f.subscription_plan} onChange={(e) => setF({ ...f, subscription_plan: e.target.value })}>
            <option value="">—</option>
            <option value="premium">Premium subscription</option>
            <option value="business_program">Business Support Program</option>
          </select>
        </FieldRow>
        <FieldRow label="Subscription status">
          <select className={inputCls} value={f.subscription_status} onChange={(e) => setF({ ...f, subscription_status: e.target.value })}>
            <option value="">—</option>
            <option value="active">active</option>
            <option value="canceling">canceling (ends at period end)</option>
            <option value="canceled">canceled</option>
            <option value="past_due">past_due</option>
          </select>
        </FieldRow>
        <FieldRow label="Subscription tokens">
          <input type="number" min={0} className={inputCls} value={f.subscription_tokens} onChange={(e) => setF({ ...f, subscription_tokens: Number(e.target.value) })} />
        </FieldRow>
        <FieldRow label="Package tokens">
          <input type="number" min={0} className={inputCls} value={f.package_tokens} onChange={(e) => setF({ ...f, package_tokens: Number(e.target.value) })} />
        </FieldRow>
        <FieldRow label="Role">
          <select className={inputCls} value={f.role} disabled={isSelf} onChange={(e) => setF({ ...f, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </FieldRow>
        <FieldRow label="Account">
          <select className={inputCls} value={f.is_active ? 'active' : 'inactive'} disabled={isSelf} onChange={(e) => setF({ ...f, is_active: e.target.value === 'active' })}>
            <option value="active">Active</option>
            <option value="inactive">Deactivated</option>
          </select>
        </FieldRow>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Changing the plan here does not touch the Paddle subscription. Subscription tokens are reset to the plan’s monthly allocation at the start of each month; package tokens never reset.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button className={btn.secondary} onClick={onClose}>Cancel</button>
        <button className={btn.primary} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </Modal>
  );
}
