'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { downloadSubmissionPdf } from '@/lib/pdf-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Submission {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  ai_score: any;
  ai_comment: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  worker_name: string | null;
  worker_email: string | null;
  guide: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function SubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filtered, setFiltered] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState('');
  const [editScoreValue, setEditScoreValue] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchSubmissions();
  }, [user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(submissions);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(submissions.filter(sub =>
        sub.guide.title.toLowerCase().includes(term) ||
        (sub.worker_name && sub.worker_name.toLowerCase().includes(term))
      ));
    }
  }, [searchTerm, submissions]);

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
    // ✅ Fetch ALL submissions, including those with ai_score = null or 0
    const { data: media, error: mediaError } = await supabase
      .from('media_uploads')
      .select('id, file_url, file_type, ai_score, ai_comment, approval_status, created_at, guide_id, worker_name, worker_email')
      .in('guide_id', guideIds)
      // .not('ai_score', 'is', null)   // ← REMOVED: now includes all
      .order('created_at', { ascending: false });
    if (mediaError) {
      console.error(mediaError);
    } else if (media) {
      const enriched: Submission[] = media.map((item: any) => ({
        ...item,
        guide: guides.find(g => g.id === item.guide_id)!,
      }));
      setSubmissions(enriched);
      setFiltered(enriched);
    }
    setLoading(false);
    setSelectedIds(new Set());
  };

  const updateApprovalStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase.from('media_uploads').update({ approval_status: newStatus }).eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, approval_status: newStatus } : s));
    } else alert('Failed to update');
  };

  // ─── Edit: save both comment and score ──────────────────────────────────
  const saveCommentAndScore = async (id: string, newComment: string, newScore: number | null) => {
    const updateData: any = { ai_comment: newComment };
    if (newScore !== null) {
      // Preserve existing ai_score object but update the score
      const current = submissions.find(s => s.id === id);
      const currentScore = current?.ai_score || {};
      updateData.ai_score = {
        ...currentScore,
        score: newScore,
      };
    }
    const { error } = await supabase
      .from('media_uploads')
      .update(updateData)
      .eq('id', id);
    if (!error) {
      setSubmissions(prev =>
        prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              ai_comment: newComment,
              ai_score: updateData.ai_score || s.ai_score,
            };
          }
          return s;
        })
      );
      setEditingId(null);
    } else {
      alert('Failed to save changes');
    }
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

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(s => s.id)));
    }
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
      const remaining = submissions.filter(s => !selectedIds.has(s.id));
      setSubmissions(remaining);
      setFiltered(prev => prev.filter(s => !selectedIds.has(s.id)));
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Work Submissions</h1>
            {selectedIds.size > 0 && (
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-6">Submitted work with evaluations. Edit comments and scores, then download PDF reports.</p>

          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search by guide title or worker name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-md border rounded-lg px-4 py-2"
            />
            {filtered.length > 0 && (
              <button
                onClick={selectAll}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {selectedIds.size === filtered.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No submissions match your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((sub) => (
                <div key={sub.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition relative">
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="relative h-48 bg-gray-100 group">
                    {sub.file_type === 'image' ? (
                      <Image src={sub.file_url} alt="Work submission" fill className="object-cover" />
                    ) : sub.file_type === 'video' ? (
                      <video src={sub.file_url} className="w-full h-full object-cover" controls />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <p className="text-sm text-gray-600">Document</p>
                          <button
                            onClick={() => downloadFile(sub.file_url, `submission_${sub.id}.${sub.file_url.split('.').pop()}`)}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => downloadFile(sub.file_url, `submission_${sub.id}.${sub.file_type === 'image' ? 'jpg' : 'mp4'}`)}
                      className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-1 rounded shadow text-xs hover:bg-opacity-100"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <Link href={`/guides/${sub.guide.slug}`} className="font-semibold text-primary-600 hover:underline">
                        {sub.guide.title}
                      </Link>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sub.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                        sub.approval_status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{sub.approval_status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Submitted: {new Date(sub.created_at).toLocaleDateString()}</p>
                    {sub.worker_name && <p className="text-sm text-gray-600 mt-1">Worker: {sub.worker_name}</p>}
                    
                    {/* ─── Editable Comment + Score ─────────────────────── */}
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Review:</span>
                        {editingId !== sub.id ? (
                          <button
                            onClick={() => {
                              setEditingId(sub.id);
                              setEditCommentValue(sub.ai_comment || '');
                              setEditScoreValue(sub.ai_score?.score ?? null);
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        ) : (
                          <div className="space-x-2">
                            <button
                              onClick={() => saveCommentAndScore(sub.id, editCommentValue, editScoreValue)}
                              className="text-xs text-green-600 hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs text-gray-500 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === sub.id ? (
                        <div className="mt-1 space-y-2">
                          <div>
                            <label className="text-xs text-gray-600">Score (0–100)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editScoreValue ?? ''}
                              onChange={(e) => setEditScoreValue(e.target.value === '' ? null : Number(e.target.value))}
                              className="w-full p-1 border rounded text-sm"
                              placeholder="Leave blank for N/A"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Comment (Markdown supported)</label>
                            <textarea
                              value={editCommentValue}
                              onChange={(e) => setEditCommentValue(e.target.value)}
                              className="w-full mt-1 p-1 border rounded text-sm"
                              rows={3}
                              placeholder="Markdown supported"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mt-1 text-sm">
                            <span className="font-medium">Score: </span>
                            {sub.ai_score && typeof sub.ai_score === 'object' && 'score' in sub.ai_score ? (
                              <span className="font-bold">{sub.ai_score.score}/100</span>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </div>
                          <div className="prose prose-sm max-w-none mt-1 text-gray-700">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {sub.ai_comment || '*No comment provided.*'}
                            </ReactMarkdown>
                          </div>
                        </>
                      )}
                    </div>

                    {/* ─── Actions ────────────────────────────────────────── */}
                    <button
                      onClick={() => downloadPDF(sub)}
                      className="mt-3 w-full py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                    >
                      📄 Download PDF Report
                    </button>

                    <button
                      onClick={() => sendReviewEmail(sub)}
                      disabled={!sub.worker_email}
                      className="mt-2 w-full py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📧 Send Review via Gmail
                    </button>

                    {sub.approval_status === 'pending' && (
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => updateApprovalStatus(sub.id, 'approved')} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Approve</button>
                        <button onClick={() => updateApprovalStatus(sub.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}