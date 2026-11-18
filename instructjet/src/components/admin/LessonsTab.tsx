// src/components/admin/LessonsTab.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, FieldRow, inputCls, Modal, safeHref, type Toast } from './ui';

interface Lesson {
  id?: string;
  title: string;
  summary: string | null;
  body: string | null;
  url: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function LessonsTab({ toast }: { toast: Toast }) {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [editing, setEditing] = useState<Lesson | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ lessons: Lesson[] }>('/api/admin/lessons');
      setLessons(d.lessons);
    } catch (e) {
      toast('error', (e as Error).message);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = async (l: Lesson, fields: Partial<Lesson>) => {
    try {
      await api('/api/admin/lessons', { method: 'PATCH', json: { id: l.id, ...fields } });
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  // Swap sort_order with the neighbour
  const move = async (index: number, dir: -1 | 1) => {
    if (!lessons) return;
    const a = lessons[index];
    const b = lessons[index + dir];
    if (!b) return;
    const aOrder = a.sort_order === b.sort_order ? a.sort_order + dir : b.sort_order;
    await Promise.all([
      api('/api/admin/lessons', { method: 'PATCH', json: { id: a.id, sort_order: aOrder } }),
      api('/api/admin/lessons', { method: 'PATCH', json: { id: b.id, sort_order: a.sort_order } }),
    ]).catch((e) => toast('error', (e as Error).message));
    load();
  };

  const remove = async (l: Lesson) => {
    if (!window.confirm(`Delete “${l.title}”?`)) return;
    try {
      await api(`/api/admin/lessons?id=${l.id}`, { method: 'DELETE' });
      toast('success', 'Lesson deleted');
      load();
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-gray-600">
          Lessons are emailed in this order, one every few days (set in Overview), and start again from the top after the last one. Each participant has their own position in the rotation.
        </p>
        <button className={btn.primary} onClick={() => setEditing({ title: '', summary: '', body: '', url: '', sort_order: (lessons?.at(-1)?.sort_order ?? 0) + 1, is_active: true })}>
          + Add lesson
        </button>
      </div>

      <div className="space-y-2">
        {lessons === null && <p className="text-gray-500">Loading…</p>}
        {lessons?.length === 0 && <p className="text-gray-500">No lessons yet. Participants still get the Discord invite and weekly picks.</p>}
        {lessons?.map((l, i) => (
          <div key={l.id} className={`flex flex-wrap items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 ${l.is_active ? '' : 'opacity-60'}`}>
            <div className="flex flex-col gap-1">
              <button className={btn.small} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button className={btn.small} disabled={i === lessons.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">#{i + 1}</span>
                <span className="font-semibold text-gray-900">{l.title}</span>
                {!l.is_active && <Badge tone="red">inactive</Badge>}
              </div>
              {l.summary && <p className="mt-1 text-sm text-gray-600">{l.summary}</p>}
              {l.url && (
                <a href={safeHref(l.url)} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-primary-600 hover:underline">
                  {l.url}
                </a>
              )}
            </div>
            <div className="flex gap-1">
              <button className={btn.small} onClick={() => setEditing(l)}>Edit</button>
              <button className={btn.small} onClick={() => patch(l, { is_active: !l.is_active })}>{l.is_active ? 'Deactivate' : 'Activate'}</button>
              <button className={btn.small} onClick={() => remove(l)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <LessonModal
          lesson={editing}
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

function LessonModal({ lesson, toast, onClose, onSaved }: { lesson: Lesson; toast: Toast; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Lesson>({ ...lesson });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api('/api/admin/lessons', { method: f.id ? 'PATCH' : 'POST', json: f });
      toast('success', f.id ? 'Lesson updated' : 'Lesson added');
      onSaved();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={lesson.id ? 'Edit lesson' : 'Add lesson'} onClose={onClose} wide>
      <div className="grid gap-4">
        <FieldRow label="Title">
          <input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Delegating without losing control" />
        </FieldRow>
        <FieldRow label="Summary" hint="One or two sentences shown above the lesson">
          <input className={inputCls} value={f.summary || ''} onChange={(e) => setF({ ...f, summary: e.target.value })} />
        </FieldRow>
        <FieldRow label="Lesson text" hint="Plain text; blank lines start new paragraphs. Leave empty if you only link to an article.">
          <textarea className={inputCls} rows={12} value={f.body || ''} onChange={(e) => setF({ ...f, body: e.target.value })} />
        </FieldRow>
        <FieldRow label="Article link (optional)">
          <input className={inputCls} value={f.url || ''} onChange={(e) => setF({ ...f, url: e.target.value })} placeholder="https://" />
        </FieldRow>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Active (included in the rotation)
        </label>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button className={btn.secondary} onClick={onClose}>Cancel</button>
        <button className={btn.primary} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </Modal>
  );
}
