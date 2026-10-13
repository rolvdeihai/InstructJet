'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { downloadSubmissionPdf } from '@/lib/pdf-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  DocumentTextIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

type Status = 'pending' | 'approved' | 'rejected';

interface Submission {
  id: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document' | 'other';
  ai_score: any;
  ai_comment: string | null;
  approval_status: Status;
  created_at: string;
  worker_name: string | null;
  worker_email: string | null;
  guide: {
    id: string;
    title: string;
    slug: string;
  };
}

const STATUS_STYLES: Record<Status, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  approved: 'bg-green-50 text-green-700 ring-green-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
};

function getScore(sub: Submission): number | null {
  const score = sub.ai_score?.score;
  return typeof score === 'number' ? score : null;
}

function scoreStyle(score: number | null) {
  if (score === null) return 'bg-gray-100 text-gray-500';
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function fileExtension(url: string) {
  return url.split('?')[0].split('.').pop() || 'bin';
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ring-1 capitalize ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function MediaPreview({ sub, large = false }: { sub: Submission; large?: boolean }) {
  if (sub.file_type === 'image') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={sub.file_url} alt="Work submission" className={`w-full h-full ${large ? 'object-contain' : 'object-cover'}`} />;
  }
  if (sub.file_type === 'video') {
    return <video src={sub.file_url} className={`w-full h-full ${large ? 'object-contain' : 'object-cover'}`} controls />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <DocumentTextIcon className="h-12 w-12 mb-2" />
      <p className="text-sm font-medium uppercase">{fileExtension(sub.file_url)} document</p>
      {large && (
        <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-primary-600 hover:underline">
          Open in new tab
        </a>
      )}
    </div>
  );
}

// ─── Submission Card ────────────────────────────────────────────────────
function SubmissionCard({
  sub,
  isSelected,
  onToggleSelect,
  onOpen,
  onUpdateStatus,
}: {
  sub: Submission;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (sub: Submission) => void;
  onUpdateStatus: (id: string, status: Status) => void;
}) {
  const score = getScore(sub);

  return (
    <div
      className={`group bg-white rounded-2xl border overflow-hidden flex flex-col transition hover:shadow-lg ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
      }`}
    >
      <div className="relative h-44 bg-gray-100 cursor-pointer" onClick={() => onOpen(sub)}>
        <MediaPreview sub={sub} />
        <label
          className="absolute top-3 left-3 bg-white/90 rounded-md p-1 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(sub.id)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 block"
          />
        </label>
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${scoreStyle(score)}`}>
          {score === null ? 'N/A' : `${score}/100`}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/guides/${sub.guide.slug}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
            {sub.guide.title}
          </Link>
          <StatusBadge status={sub.approval_status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {sub.worker_name || 'Anonymous worker'} · {new Date(sub.created_at).toLocaleDateString()}
        </p>

        <div className="mt-3 text-sm text-gray-600 line-clamp-3 flex-1">
          {sub.ai_comment
            ? sub.ai_comment.replace(/[#*_`>|-]/g, '').slice(0, 220)
            : <span className="italic text-gray-400">No review yet.</span>}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onOpen(sub)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Review
          </button>
          {sub.approval_status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(sub.id, 'approved')}
                title="Approve"
                className="p-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(sub.id, 'rejected')}
                title="Reject"
                className="p-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Review Panel (full-size editor) ────────────────────────────────────
function ReviewPanel({
  sub,
  onClose,
  onSave,
  onUpdateStatus,
  onDownloadFile,
  onDownloadPDF,
  onSendReview,
}: {
  sub: Submission;
  onClose: () => void;
  onSave: (id: string, comment: string, score: number | null) => Promise<boolean>;
  onUpdateStatus: (id: string, status: Status) => void;
  onDownloadFile: (url: string, filename: string) => void;
  onDownloadPDF: (sub: Submission) => void;
  onSendReview: (sub: Submission) => void;
}) {
  const [comment, setComment] = useState(sub.ai_comment || '');
  const [score, setScore] = useState<number | null>(getScore(sub));
  const [tab, setTab] = useState<'write' | 'preview'>('preview');
  const [saving, setSaving] = useState(false);

  const dirty = comment !== (sub.ai_comment || '') || score !== getScore(sub);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const save = async () => {
    setSaving(true);
    const ok = await onSave(sub.id, comment, score);
    setSaving(false);
    if (ok) setTab('preview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/50 sm:p-6 animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white w-full max-w-6xl sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{sub.guide.title}</h2>
              <StatusBadge status={sub.approval_status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {sub.worker_name || 'Anonymous worker'}
              {sub.worker_email && <> · {sub.worker_email}</>}
              {' · '}
              {new Date(sub.created_at).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Close">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-5">
          {/* Preview */}
          <div className="lg:col-span-2 bg-gray-50 border-b lg:border-b-0 lg:border-r p-4 flex flex-col gap-3">
            <div className="h-64 lg:h-[420px] bg-white rounded-xl border overflow-hidden">
              <MediaPreview sub={sub} large />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onDownloadFile(sub.file_url, `submission_${sub.id}.${fileExtension(sub.file_url)}`)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="h-4 w-4" /> Download file
              </button>
              <button
                onClick={() => onDownloadPDF(sub)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-gray-50"
              >
                <DocumentArrowDownIcon className="h-4 w-4" /> Download PDF report
              </button>
              <button
                onClick={() => onSendReview(sub)}
                disabled={!sub.worker_email}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <EnvelopeIcon className="h-4 w-4" /> Send review via Gmail
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3 p-4 sm:p-6 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Score</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={score ?? ''}
                    onChange={(e) => setScore(e.target.value === '' ? null : Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="N/A"
                  />
                  <span className="text-sm text-gray-500">/ 100</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={score ?? 0}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-primary-600"
              />
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Review comment</label>
                <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-sm">
                  {(['write', 'preview'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-3 py-1 rounded-md capitalize transition ${
                        tab === t ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {tab === 'write' ? (
                <>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    autoFocus
                    className="w-full min-h-[320px] lg:min-h-[380px] flex-1 p-4 border border-gray-300 rounded-xl text-sm leading-relaxed font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Write your review… Markdown is supported."
                  />
                  <p className="text-xs text-gray-400 mt-1">Markdown supported: **bold**, - lists, ## headings</p>
                </>
              ) : (
                <div
                  onDoubleClick={() => setTab('write')}
                  className="min-h-[320px] lg:min-h-[380px] p-4 border border-gray-200 rounded-xl bg-gray-50 overflow-y-auto prose prose-sm max-w-none"
                >
                  {comment ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment}</ReactMarkdown>
                  ) : (
                    <p className="italic text-gray-400">No review yet. Switch to Write to add one.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus(sub.id, 'approved')}
              disabled={sub.approval_status === 'approved'}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40"
            >
              <CheckIcon className="h-4 w-4" /> Approve
            </button>
            <button
              onClick={() => onUpdateStatus(sub.id, 'rejected')}
              disabled={sub.approval_status === 'rejected'}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40"
            >
              <XMarkIcon className="h-4 w-4" /> Reject
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white">
              Close
            </button>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function SubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchSubmissions();
  }, [user]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return submissions.filter(sub =>
      (statusFilter === 'all' || sub.approval_status === statusFilter) &&
      (!term ||
        sub.guide.title.toLowerCase().includes(term) ||
        (sub.worker_name && sub.worker_name.toLowerCase().includes(term)) ||
        (sub.worker_email && sub.worker_email.toLowerCase().includes(term)))
    );
  }, [searchTerm, statusFilter, submissions]);

  const stats = useMemo(() => {
    const scores = submissions.map(getScore).filter((s): s is number => s !== null);
    return {
      all: submissions.length,
      pending: submissions.filter(s => s.approval_status === 'pending').length,
      approved: submissions.filter(s => s.approval_status === 'approved').length,
      rejected: submissions.filter(s => s.approval_status === 'rejected').length,
      avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    };
  }, [submissions]);

  const openSub = submissions.find(s => s.id === openId) || null;

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('id, title, slug')
      .eq('user_id', user!.id);
    if (guidesError || !guides?.length) {
      setSubmissions([]);
      setLoading(false);
      return;
    }
    const guideIds = guides.map(g => g.id);
    const { data: media, error: mediaError } = await supabase
      .from('media_uploads')
      .select('id, file_url, file_type, ai_score, ai_comment, approval_status, created_at, guide_id, worker_name, worker_email')
      .in('guide_id', guideIds)
      .order('created_at', { ascending: false });
    if (mediaError) {
      console.error(mediaError);
    } else if (media) {
      const enriched: Submission[] = media.map((item: any) => ({
        ...item,
        guide: guides.find(g => g.id === item.guide_id)!,
      }));
      setSubmissions(enriched);
    }
    setLoading(false);
    setSelectedIds(new Set());
  };

  const updateApprovalStatus = async (id: string, newStatus: Status) => {
    const { error } = await supabase.from('media_uploads').update({ approval_status: newStatus }).eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, approval_status: newStatus } : s));
    } else alert('Failed to update');
  };

  const saveCommentAndScore = async (id: string, newComment: string, newScore: number | null) => {
    const updateData: any = { ai_comment: newComment };
    if (newScore !== null) {
      const current = submissions.find(s => s.id === id);
      const currentScore = current?.ai_score || {};
      updateData.ai_score = { ...currentScore, score: newScore };
    }
    const { error } = await supabase
      .from('media_uploads')
      .update(updateData)
      .eq('id', id);
    if (error) {
      alert('Failed to save changes');
      return false;
    }
    setSubmissions(prev =>
      prev.map(s => s.id === id
        ? { ...s, ai_comment: newComment, ai_score: updateData.ai_score || s.ai_score }
        : s)
    );
    return true;
  };

  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadPDF = async (sub: Submission) => {
    await downloadSubmissionPdf(
      {
        guideTitle: sub.guide.title,
        workerName: sub.worker_name,
        submissionDate: new Date(sub.created_at).toLocaleString(),
        status: sub.approval_status,
        score: sub.ai_score?.score ?? null,
        comment: sub.ai_comment,
      },
      `submission_${sub.id}_report.pdf`
    );
  };

  const sendReviewEmail = (sub: Submission) => {
    if (!sub.worker_email) {
      alert('No email address on file for this worker.');
      return;
    }
    const subject = `Review for your submission to "${sub.guide.title}"`;
    const body = `Dear worker,\n\nHere is the review of your submission:\n\n${sub.ai_comment || 'No comment provided.'}\n\nScore: ${sub.ai_score?.score ?? 'N/A'}/100\n\nStatus: ${sub.approval_status}\n\nBest regards,\nTask Giver`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(sub.worker_email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selectedIds.has(s.id));

  const selectAll = () => {
    setSelectedIds(allFilteredSelected ? new Set() : new Set(filtered.map(s => s.id)));
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = confirm(`Delete ${selectedIds.size} selected submission(s)? This action cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/delete-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (!response.ok) throw new Error('Deletion failed');
      setSubmissions(prev => prev.filter(s => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      alert('Failed to delete submissions');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;
  if (!user) return null;

  const tabs: { key: Status | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats.all },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Work Submissions</h1>
            <p className="text-gray-600 mt-1">Review submitted work, adjust AI evaluations, and send feedback.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Total', value: stats.all, accent: 'text-gray-900' },
            { label: 'Awaiting review', value: stats.pending, accent: 'text-amber-600' },
            { label: 'Approved', value: stats.approved, accent: 'text-green-600' },
            { label: 'Average score', value: stats.avg === null ? '—' : stats.avg, accent: 'text-primary-600' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-gray-500">{card.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-1 ${card.accent}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  statusFilter === t.key ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
                <span className={`ml-1.5 text-xs ${statusFilter === t.key ? 'text-primary-500' : 'text-gray-400'}`}>{t.count}</span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 lg:max-w-sm lg:ml-auto">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guide, worker name or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button onClick={selectAll} className="flex-1 lg:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                {allFilteredSelected ? 'Deselect all' : 'Select all'}
              </button>
              {selectedIds.size > 0 && (
                <button
                  onClick={deleteSelected}
                  disabled={deleting}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                >
                  <TrashIcon className="h-4 w-4" />
                  {deleting ? 'Deleting…' : `Delete (${selectedIds.size})`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 text-center py-16 px-6">
            <InboxIcon className="h-12 w-12 mx-auto text-gray-300" />
            <p className="mt-3 text-gray-600 font-medium">
              {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your filters'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {submissions.length === 0 ? 'Work submitted by workers on your guides will appear here.' : 'Try a different status or search term.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((sub) => (
              <SubmissionCard
                key={sub.id}
                sub={sub}
                isSelected={selectedIds.has(sub.id)}
                onToggleSelect={toggleSelect}
                onOpen={(s) => setOpenId(s.id)}
                onUpdateStatus={updateApprovalStatus}
              />
            ))}
          </div>
        )}
      </div>

      {openSub && (
        <ReviewPanel
          key={openSub.id}
          sub={openSub}
          onClose={() => setOpenId(null)}
          onSave={saveCommentAndScore}
          onUpdateStatus={updateApprovalStatus}
          onDownloadFile={downloadFile}
          onDownloadPDF={downloadPDF}
          onSendReview={sendReviewEmail}
        />
      )}
      <Footer />
    </main>
  );
}
