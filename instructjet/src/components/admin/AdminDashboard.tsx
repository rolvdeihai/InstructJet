// src/components/admin/AdminDashboard.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Notice } from './ui';
import OverviewTab from './OverviewTab';
import UsersTab from './UsersTab';
import ParticipantsTab from './ParticipantsTab';
import CapstonesTab from './CapstonesTab';
import RequestsTab from './RequestsTab';
import CatalogTab from './CatalogTab';
import LessonsTab from './LessonsTab';

const TABS = [
  { id: 'overview', label: 'Overview & emails' },
  { id: 'users', label: 'Users' },
  { id: 'participants', label: 'Program participants' },
  { id: 'requests', label: 'Help requests' },
  { id: 'capstones', label: 'Capstones & claims' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'lessons', label: 'Crash-course lessons' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function AdminDashboard({ adminId }: { adminId: string }) {
  const [tab, setTab] = useState<TabId>('overview');
  const [msg, setMsg] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const toast = useCallback((tone: 'success' | 'error', text: string) => setMsg({ tone, text }), []);
  const clear = useCallback(() => setMsg(null), []);

  // Deep link from admin emails: /admin?tab=requests
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    if (t && TABS.some((x) => x.id === t)) setTab(t as TabId);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-20 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Admin Dashboard</h1>
        <div className="mt-5 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition ${
                tab === t.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {tab === 'overview' && <OverviewTab toast={toast} />}
          {tab === 'users' && <UsersTab toast={toast} adminId={adminId} />}
          {tab === 'participants' && <ParticipantsTab toast={toast} />}
          {tab === 'requests' && <RequestsTab toast={toast} />}
          {tab === 'capstones' && <CapstonesTab toast={toast} />}
          {tab === 'catalog' && <CatalogTab toast={toast} />}
          {tab === 'lessons' && <LessonsTab toast={toast} />}
        </div>
      </div>
      <Notice msg={msg} onClose={clear} />
    </main>
  );
}
