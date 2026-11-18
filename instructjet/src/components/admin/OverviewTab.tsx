// src/components/admin/OverviewTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, FieldRow, fmtDate, inputCls, type Toast } from './ui';

interface Settings {
  paused: boolean;
  discord_url: string | null;
  discord_intro_emails: number;
  lesson_every_days: number;
  digest_every_days: number;
  top_k: number;
  scraped_ttl_days: number;
  extra_queries: string[];
  last_daily_run_at: string | null;
  last_scrape_at: string | null;
  last_scrape_result: any;
}

interface Data {
  settings: Settings;
  log: { id: string; email: string; kind: string; subject: string; status: string; error: string | null; sent_at: string }[];
  stats: Record<string, number>;
}

const STAT_LABELS: Record<string, string> = {
  users: 'Users',
  premium: 'Premium users',
  admins: 'Admins',
  activeParticipants: 'Active participants',
  allParticipants: 'All participants',
  catalogActive: 'Active catalog items',
  lessons: 'Active lessons',
  claims: 'Pending Cowork claims',
};

export default function OverviewTab({ toast }: { toast: Toast }) {
  const [data, setData] = useState<Data | null>(null);
  const [form, setForm] = useState<Settings | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<Data>('/api/admin/email');
      setData(d);
      setForm(d.settings);
    } catch (e) {
      toast('error', (e as Error).message);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!form) return;
    setBusy('save');
    try {
      await api('/api/admin/email', { method: 'PUT', json: { ...form, extra_queries: form.extra_queries } });
      toast('success', 'Settings saved');
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const run = async (action: 'send_daily' | 'scrape') => {
    if (action === 'send_daily' && !confirmRun('Send today’s program emails to every participant who has not received one today?')) return;
    setBusy(action);
    try {
      const { result } = await api<{ result: any }>('/api/admin/email', { method: 'POST', json: { action } });
      toast(
        'success',
        action === 'scrape'
          ? `Scrape done: ${result.inserted} new, ${result.refreshed} refreshed${result.errors?.length ? `, ${result.errors.length} errors` : ''}`
          : result.paused
            ? 'Emails are paused — nothing sent'
            : `Sent ${result.sent}, failed ${result.failed}, nothing due for ${result.skipped}${result.remaining ? ' (more remaining, run again)' : ''}`
      );
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (!data || !form) return <p className="text-gray-500">Loading…</p>;
  const num = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: Number(e.target.value) });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(STAT_LABELS).map(([k, label]) => (
          <div key={k} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-2xl font-bold text-gray-900">{data.stats[k] ?? 0}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Jobs</h2>
            <p className="text-sm text-gray-500">
              Google Apps Script runs these automatically (daily emails, weekly scrape). Use the buttons to run them now.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={btn.primary} disabled={!!busy} onClick={() => run('send_daily')}>
              {busy === 'send_daily' ? 'Sending…' : 'Send today’s emails now'}
            </button>
            <button className={btn.secondary} disabled={!!busy} onClick={() => run('scrape')}>
              {busy === 'scrape' ? 'Scraping… (up to a few minutes)' : 'Run catalog scrape now'}
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-gray-500">Last daily email run</div>
            <div className="font-medium text-gray-900">{fmtDate(form.last_daily_run_at, true)}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-gray-500">Last scrape</div>
            <div className="font-medium text-gray-900">{fmtDate(form.last_scrape_at, true)}</div>
            {form.last_scrape_result && (
              <div className="mt-1 text-xs text-gray-500">
                {form.last_scrape_result.type && form.last_scrape_result.type !== 'all' ? `${form.last_scrape_result.type} · ` : ''}
                {form.last_scrape_result.provider} · {form.last_scrape_result.queries} queries · {form.last_scrape_result.inserted} new ·{' '}
                {form.last_scrape_result.refreshed} refreshed
                {form.last_scrape_result.errors?.length > 0 && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-red-600">{form.last_scrape_result.errors.length} errors</summary>
                    <ul className="mt-1 list-disc pl-4">
                      {form.last_scrape_result.errors.map((e: string, i: number) => (
                        <li key={i} className="break-all">{e}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Email schedule</h2>
        <p className="text-sm text-gray-500">
          Each participant gets at most one email a day, combining whatever is due: welcome, Discord invite, next lesson, weekly picks.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FieldRow label="Program emails">
            <select className={inputCls} value={form.paused ? 'paused' : 'on'} onChange={(e) => setForm({ ...form, paused: e.target.value === 'paused' })}>
              <option value="on">On</option>
              <option value="paused">Paused (nothing is sent)</option>
            </select>
          </FieldRow>
          <FieldRow label="Discord invite URL" hint="Shown in the first emails and on Leadership Info">
            <input className={inputCls} value={form.discord_url || ''} onChange={(e) => setForm({ ...form, discord_url: e.target.value })} placeholder="https://discord.gg/…" />
          </FieldRow>
          <FieldRow label="Emails that include the Discord invite">
            <input type="number" min={0} max={30} className={inputCls} value={form.discord_intro_emails} onChange={num('discord_intro_emails')} />
          </FieldRow>
          <FieldRow label="Send a lesson every N days">
            <input type="number" min={1} max={30} className={inputCls} value={form.lesson_every_days} onChange={num('lesson_every_days')} />
          </FieldRow>
          <FieldRow label="Send catalog picks every N days">
            <input type="number" min={1} max={30} className={inputCls} value={form.digest_every_days} onChange={num('digest_every_days')} />
          </FieldRow>
          <FieldRow label="Picks per email (top k)">
            <input type="number" min={1} max={15} className={inputCls} value={form.top_k} onChange={num('top_k')} />
          </FieldRow>
          <FieldRow label="Deactivate scraped items not seen for N days">
            <input type="number" min={7} max={120} className={inputCls} value={form.scraped_ttl_days} onChange={num('scraped_ttl_days')} />
          </FieldRow>
          <div className="sm:col-span-2">
            <FieldRow label="Extra search queries (one per line)" hint="Optional prefix with a type, e.g. “investor_event: angel investor pitch night Jakarta”">
              <textarea
                className={inputCls}
                rows={3}
                value={form.extra_queries.join('\n')}
                onChange={(e) => setForm({ ...form, extra_queries: e.target.value.split('\n') })}
              />
            </FieldRow>
          </div>
        </div>
        <button className={`${btn.primary} mt-4`} disabled={!!busy} onClick={save}>
          {busy === 'save' ? 'Saving…' : 'Save settings'}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent emails</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-500">
              <tr>
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">To</th>
                <th className="py-2 pr-4">Subject</th>
                <th className="py-2 pr-4">Kind</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.log.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-gray-500">
                    No emails yet.
                  </td>
                </tr>
              )}
              {data.log.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap py-2 pr-4 text-gray-500">{fmtDate(l.sent_at, true)}</td>
                  <td className="py-2 pr-4">{l.email}</td>
                  <td className="py-2 pr-4">{l.subject}</td>
                  <td className="py-2 pr-4">{l.kind}</td>
                  <td className="py-2">{l.status === 'sent' ? <Badge tone="green">sent</Badge> : <Badge tone="red">{l.error || 'failed'}</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function confirmRun(text: string) {
  return typeof window !== 'undefined' && window.confirm(text);
}
