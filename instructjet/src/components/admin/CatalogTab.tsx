// src/components/admin/CatalogTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { BUSINESS_CATEGORIES, CATALOG_TYPES } from '@/lib/program/config';
import { api, Badge, btn, FieldRow, fmtDate, inputCls, Modal, safeHref, type Toast } from './ui';

interface Item {
  id?: string;
  type: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  tags: string[];
  location: string | null;
  is_online: boolean;
  event_date: string | null;
  platform: string | null;
  provider: string | null;
  is_free: boolean;
  certification: string | null;
  source?: string;
  is_active: boolean;
  last_seen_at?: string;
  created_at?: string;
}

const EMPTY: Item = {
  type: 'networking_event',
  title: '',
  description: '',
  url: '',
  category: 'general',
  tags: [],
  location: '',
  is_online: false,
  event_date: '',
  platform: '',
  provider: '',
  is_free: true,
  certification: '',
  is_active: true,
};

const typeLabel = (v: string) => CATALOG_TYPES.find((t) => t.value === v)?.label || v;
const categoryLabel = (v: string) => (v === 'general' ? 'General' : BUSINESS_CATEGORIES.find((c) => c.value === v)?.label || v);

export default function CatalogTab({ toast }: { toast: Toast }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [type, setType] = useState('');
  const [active, setActive] = useState('true');
  const [source, setSource] = useState('');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Item | null>(null);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (active) params.set('active', active);
      if (source) params.set('source', source);
      if (search) params.set('q', search);
      const d = await api<{ items: Item[] }>(`/api/admin/catalog?${params}`);
      setItems(d.items);
    } catch (e) {
      toast('error', (e as Error).message);
    }
  }, [type, active, source, search, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = async (item: Item, fields: Partial<Item>, label: string) => {
    try {
      await api('/api/admin/catalog', { method: 'PATCH', json: { id: item.id, ...fields } });
      toast('success', label);
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  const remove = async (item: Item) => {
    if (!window.confirm(`Delete “${item.title}”? A scraped item may be found again next week; deactivate it instead to keep it out.`)) return;
    try {
      await api(`/api/admin/catalog?id=${item.id}`, { method: 'DELETE' });
      toast('success', 'Deleted');
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q.trim());
          }}
        >
          <input className={`${inputCls} max-w-xs`} placeholder="Search title, description, provider" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <select className={`${inputCls} w-auto`} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {CATALOG_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select className={`${inputCls} w-auto`} value={active} onChange={(e) => setActive(e.target.value)}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
          <option value="">Active & inactive</option>
        </select>
        <select className={`${inputCls} w-auto`} value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Manual & scraped</option>
          <option value="manual">Manual</option>
          <option value="scraped">Scraped</option>
        </select>
        <button className={`${btn.primary} ml-auto`} onClick={() => setEditing({ ...EMPTY })}>+ Add item</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">When / where</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items === null && (
              <tr><td colSpan={6} className="px-4 py-6 text-gray-500">Loading…</td></tr>
            )}
            {items?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-gray-500">No items. Add one or run the scrape from the Overview tab.</td></tr>
            )}
            {items?.map((i) => (
              <tr key={i.id} className={i.is_active ? '' : 'opacity-60'}>
                <td className="max-w-md px-4 py-3">
                  <a href={safeHref(i.url)} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-primary-600">
                    {i.title}
                  </a>
                  {i.description && <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{i.description}</p>}
                  {i.tags?.length > 0 && <p className="mt-1 text-xs text-gray-400">{i.tags.join(' · ')}</p>}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {typeLabel(i.type)}
                  {i.platform && <div className="text-xs text-gray-400">{i.platform}</div>}
                </td>
                <td className="px-4 py-3 text-gray-700">{categoryLabel(i.category)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {i.event_date ? fmtDate(i.event_date) : '—'}
                  <div className="text-xs text-gray-400">{i.is_online ? 'Online' : i.location || ''}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={i.source === 'manual' ? 'blue' : 'gray'}>{i.source}</Badge>
                  {!i.is_active && <div className="mt-1"><Badge tone="red">inactive</Badge></div>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button className={btn.small} onClick={() => setEditing(i)}>Edit</button>
                    <button className={btn.small} onClick={() => patch(i, { is_active: !i.is_active }, i.is_active ? 'Deactivated' : 'Activated')}>
                      {i.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className={btn.small} onClick={() => remove(i)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ItemModal
          item={editing}
          toast={toast}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ItemModal({ item, toast, onClose, onSaved }: { item: Item; toast: Toast; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Item>({ ...item });
  const [tags, setTags] = useState((item.tags || []).join(', '));
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Item) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      const { id, source: _s, last_seen_at: _l, created_at: _c, ...rest } = f;
      await api('/api/admin/catalog', { method: id ? 'PATCH' : 'POST', json: { ...(id ? { id } : {}), ...rest, tags } });
      toast('success', id ? 'Item updated' : 'Item added');
      onSaved();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={item.id ? 'Edit catalog item' : 'Add catalog item'} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldRow label="Type">
          <select className={inputCls} value={f.type} onChange={set('type')}>
            {CATALOG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Business category" hint="“General” matches everyone">
          <select className={inputCls} value={f.category} onChange={set('category')}>
            <option value="general">General</option>
            {BUSINESS_CATEGORIES.filter((c) => c.value !== 'other').map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </FieldRow>
        <div className="sm:col-span-2">
          <FieldRow label="Title">
            <input className={inputCls} value={f.title} onChange={set('title')} />
          </FieldRow>
        </div>
        <div className="sm:col-span-2">
          <FieldRow label="URL" hint="For communities, the direct Telegram / Discord / WhatsApp invite link">
            <input className={inputCls} value={f.url} onChange={set('url')} placeholder="https://" />
          </FieldRow>
        </div>
        <div className="sm:col-span-2">
          <FieldRow label="Description">
            <textarea className={inputCls} rows={3} value={f.description || ''} onChange={set('description')} />
          </FieldRow>
        </div>
        <div className="sm:col-span-2">
          <FieldRow label="Tags (comma separated)" hint="Keywords used to match participant profiles">
            <input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} />
          </FieldRow>
        </div>
        <FieldRow label="Event date">
          <input type="date" className={inputCls} value={f.event_date || ''} onChange={set('event_date')} />
        </FieldRow>
        <FieldRow label="Location" hint="City, country (leave empty if online)">
          <input className={inputCls} value={f.location || ''} onChange={set('location')} />
        </FieldRow>
        <FieldRow label="Provider / organizer">
          <input className={inputCls} value={f.provider || ''} onChange={set('provider')} />
        </FieldRow>
        <FieldRow label="Platform">
          <input className={inputCls} value={f.platform || ''} onChange={set('platform')} placeholder="coursera, discord, eventbrite…" />
        </FieldRow>
        <FieldRow label="Certificate (courses)">
          <input className={inputCls} value={f.certification || ''} onChange={set('certification')} />
        </FieldRow>
        <div className="flex flex-col justify-end gap-2 text-sm text-gray-700">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_online} onChange={(e) => setF({ ...f, is_online: e.target.checked })} /> Online</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_free} onChange={(e) => setF({ ...f, is_free: e.target.checked })} /> Free</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Active (can be sent)</label>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className={btn.secondary} onClick={onClose}>Cancel</button>
        <button className={btn.primary} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </Modal>
  );
}
