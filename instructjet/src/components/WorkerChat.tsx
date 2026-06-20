// src/components/WorkerChat.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WorkerChatProps {
  guideId: string;
  guideTitle: string;
}

const MAX_TOTAL_SIZE_MB = 50;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

export default function WorkerChat({ guideId, guideTitle }: WorkerChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ role: 'worker' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [pendingConsultation, setPendingConsultation] = useState<{
    mediaId: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
  } | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempWorkerName, setTempWorkerName] = useState('');
  const [tempWorkerEmail, setTempWorkerEmail] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  // ─── Confirmation Modal State ──────────────────────────────────────────
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<{
    mediaIds: string[];
    fileUrls: string[];
    fileNames: string[];
    fileTypes: string[];
    workerName: string;
    workerEmail: string;
    files: File[];
    evaluation: { score: number; comment: string } | null;
  } | null>(null);

  // Budget state
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null);
  const [isCreator, setIsCreator] = useState(false);

  // ─── Existing lifecycle & helpers ──────────────────────────────────────
  useEffect(() => {
    const storedSession = localStorage.getItem(`worker_session_${guideId}`);
    if (storedSession) {
      setSessionId(storedSession);
      loadMessages(storedSession);
    } else {
      createSession();
    }
  }, [guideId]);

  useEffect(() => {
    const fetchBudgetAndCreator = async () => {
      try {
        const res = await fetch(`/api/guides/${guideId}/budget`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setRemainingBudget(data.remaining_budget);
          setIsCreator(true);
        } else {
          setRemainingBudget(null);
          setIsCreator(false);
        }
      } catch (err) {
        console.error('Failed to fetch budget:', err);
      }
    };
    fetchBudgetAndCreator();
  }, [guideId, user]);

  const createSession = async () => {
    const { data, error } = await supabase
      .from('worker_chat_sessions')
      .insert({ guide_id: guideId, worker_identifier: null, worker_name: null })
      .select('id')
      .single();
    if (error) {
      console.error('Failed to create worker session:', error);
      return;
    }
    setSessionId(data.id);
    localStorage.setItem(`worker_session_${guideId}`, data.id);
    setMessages([]);
  };

  const saveWorkerName = async (name: string, email: string) => {
    if (!sessionId) return;
    await supabase
      .from('worker_chat_sessions')
      .update({ worker_name: name })
      .eq('id', sessionId);
    localStorage.setItem(`worker_name_${guideId}`, name);
    localStorage.setItem(`worker_email_${guideId}`, email);
  };

  const clearChat = async () => {
    localStorage.removeItem(`worker_session_${guideId}`);
    localStorage.removeItem(`worker_name_${guideId}`);
    await createSession();
    setMessages([]);
    setPendingConsultation(null);
    setPendingFiles([]);
  };

  const loadMessages = async (sessId: string) => {
    const { data, error } = await supabase
      .from('worker_chat_messages')
      .select('role, content')
      .eq('session_id', sessId)
      .order('message_order', { ascending: true });
    if (error) {
      console.error('Failed to load messages:', error);
      return;
    }
    setMessages(data.map(m => ({ role: m.role as 'worker' | 'assistant', content: m.content })));
  };

  const addMessage = async (role: 'worker' | 'assistant', content: string) => {
    const newMessage = { role, content };
    setMessages(prev => [...prev, newMessage]);
    if (sessionId) {
      const order = messages.length;
      await supabase.from('worker_chat_messages').insert({
        session_id: sessionId,
        role,
        content,
        message_order: order,
      });
    }
  };

  const fetchGuideContent = async () => {
    const { data } = await supabase.from('guides').select('content').eq('id', guideId).single();
    return data?.content || '';
  };

  // ─── Queue polling ──────────────────────────────────────────────────────
  const startQueuePolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/queue-status');
        if (!res.ok) return;
        const status = await res.json();
        if (status.queued > 0 || status.active > 0) {
          setQueuePosition(status.queued + (status.active > 0 ? 1 : 0));
        } else {
          setQueuePosition(null);
        }
      } catch (err) {
        console.error('Queue polling error', err);
      }
    }, 2000);
  };

  const stopQueuePolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setQueuePosition(null);
  };

  const stopGeneration = async () => {
    if (currentRequestId) {
      try {
        await fetch('/api/cancel', {
          method: 'POST',
          body: JSON.stringify({ requestId: currentRequestId }),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Cancel request failed', err);
      }
      setCurrentRequestId(null);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    stopQueuePolling();
  };

  const userAbortedRef = useRef(false);

  // ─── Send message (includes consultation flow) ──────────────────────────
  const handleSendMessage = async () => {
    if (!input.trim() && !pendingConsultation) return;
    const userMsg = input.trim();
    setInput('');

    // ─── Consultation flow (single file, no confirmation) ──────────────
    if (pendingConsultation) {
      setIsLoading(true);
      try {
        if (userMsg) await addMessage('worker', userMsg);
        else await addMessage('worker', `📎 Consulting about: ${pendingConsultation.fileName}`);

        // Use the single-file analyze (backward compatible)
        const response = await fetch('/api/analyze-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaId: pendingConsultation.mediaId,
            fileUrl: pendingConsultation.fileUrl,
            fileType: pendingConsultation.fileType,
            fileName: pendingConsultation.fileName,
            guideId,
            updateDB: false,
            userMessage: userMsg || 'Please analyze this file in the context of the guide.',
          }),
        });
        const data = await response.json();
        if (data.feedback) {
          await addMessage('assistant', `📊 **AI Analysis**:\n${data.feedback}`);
          if (data.ocrText && data.ocrText.length) {
            await addMessage('assistant', `📝 **Text extracted** (for context):\n\`\`\`\n${data.ocrText.substring(0, 1000)}\n\`\`\``);
          }
        } else {
          await addMessage('assistant', 'Sorry, could not analyze the file.');
        }
      } catch (err) {
        console.error(err);
        await addMessage('assistant', 'An error occurred.');
      } finally {
        setPendingConsultation(null);
        setIsLoading(false);
      }
      return;
    }

    // ─── Regular chat message ──────────────────────────────────────────
    if (!userMsg) return;
    await addMessage('worker', userMsg);

    const requestId = crypto.randomUUID();
    setCurrentRequestId(requestId);
    setIsLoading(true);
    startQueuePolling();
    userAbortedRef.current = false;

    try {
      const contextMessages = [...messages, { role: 'worker', content: userMsg }].slice(-10);
      const contextString = contextMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      const guideContent = await fetchGuideContent();

      abortControllerRef.current = new AbortController();
      const timeoutSignal = AbortSignal.timeout(15 * 60 * 1000);
      const combinedSignal = AbortSignal.any([abortControllerRef.current.signal, timeoutSignal]);

      const response = await fetch('/api/worker-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          guideContent,
          context: contextString,
          guideId,
          tokens: 1000,
          requestId,
        }),
        signal: combinedSignal,
      });

      const data = await response.json();

      if (data.aborted === true) {
        console.log('Request aborted by user');
        return;
      }

      if (!response.ok) {
        if (response.status === 402) {
          await addMessage('assistant', `⚠️ ${data.error || 'Insufficient budget.'}`);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
        return;
      }

      if (data.queue_position > 0) {
        setQueuePosition(data.queue_position);
        setTimeout(() => setQueuePosition(null), 3000);
      }

      if (data.response) {
        await addMessage('assistant', data.response);
        const budgetRes = await fetch(`/api/guides/${guideId}/budget`, { credentials: 'include' });
        if (budgetRes.ok) {
          const budgetData = await budgetRes.json();
          setRemainingBudget(budgetData.remaining_budget);
        }
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' && userAbortedRef.current) {
        console.log('Request aborted by user');
        return;
      }
      console.error('Worker chat error:', err);
      await addMessage('assistant', 'The AI is taking longer than expected. Please try again in a moment.');
    } finally {
      setIsLoading(false);
      stopQueuePolling();
      abortControllerRef.current = null;
      setCurrentRequestId(null);
      userAbortedRef.current = false;
    }
  };

  // ─── Upload for consultation (single file) ──────────────────────────────
  const uploadForConsultation = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `worker-uploads/${guideId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('worker-uploads')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from('worker-uploads').getPublicUrl(filePath);
      const fileUrl = publicUrlData.publicUrl;

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isDocument = /\.(pdf|docx?)$/i.test(file.name);
      let fileType = '';
      if (isImage) fileType = 'image';
      else if (isVideo) fileType = 'video';
      else if (isDocument) fileType = 'document';
      else fileType = 'other';

      const { data: media, error: insertError } = await supabase
        .from('media_uploads')
        .insert({
          guide_id: guideId,
          worker_session_id: sessionId,
          file_url: fileUrl,
          file_type: fileType,
          ai_score: null,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;

      setPendingConsultation({ mediaId: media.id, fileUrl, fileName: file.name, fileType });
      await addMessage('assistant', `📎 **File attached:** ${file.name}\n\nType your question and click Send.`);
    } catch (err) {
      console.error(err);
      await addMessage('assistant', 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Multi‑File Submission Flow ──────────────────────────────────────────

  const validateFiles = (files: File[]): { valid: boolean; error?: string } => {
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize === 0) {
      return { valid: false, error: 'No files selected.' };
    }
    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
      const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `Total file size (${totalMB} MB) exceeds the ${MAX_TOTAL_SIZE_MB} MB limit. Please select smaller files.`,
      };
    }
    return { valid: true };
  };

  const requestWorkerNameForSubmission = (files: File[]) => {
    const existingName = localStorage.getItem(`worker_name_${guideId}`);
    const existingEmail = localStorage.getItem(`worker_email_${guideId}`);
    if (existingName && existingEmail) {
      startSubmissionFlow(files, existingName, existingEmail);
    } else {
      setPendingFiles(files);
      setShowNameModal(true);
    }
  };

  // ─── Step 1: Upload all files, create media records ─────────────────
  const startSubmissionFlow = async (files: File[], workerName: string, workerEmail: string) => {
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const mediaIds: string[] = [];
    const fileUrls: string[] = [];
    const fileNames: string[] = [];
    const fileTypes: string[] = [];

    try {
      // Upload all files in parallel
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${index}.${fileExt}`;
        const filePath = `worker-uploads/${guideId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('worker-uploads')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('worker-uploads').getPublicUrl(filePath);
        const fileUrl = publicUrlData.publicUrl;

        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isDocument = /\.(pdf|docx?)$/i.test(file.name);
        let fileType = '';
        if (isImage) fileType = 'image';
        else if (isVideo) fileType = 'video';
        else if (isDocument) fileType = 'document';
        else fileType = 'other';

        const { data: media, error: insertError } = await supabase
          .from('media_uploads')
          .insert({
            guide_id: guideId,
            worker_session_id: sessionId,
            worker_name: workerName,
            worker_email: workerEmail,
            file_url: fileUrl,
            file_type: fileType,
            ai_score: null,
            ai_comment: null,
            approval_status: 'pending',
          })
          .select('id')
          .single();
        if (insertError) throw insertError;

        mediaIds.push(media.id);
        fileUrls.push(fileUrl);
        fileNames.push(file.name);
        fileTypes.push(fileType);

        setUploadProgress({ current: index + 1, total: files.length });
      });

      await Promise.all(uploadPromises);

      // ─── Step 2: Analyze all files with ONE API call ────────────────
      await addMessage('worker', `📤 **Analyzing submission**: ${files.length} file(s) (by ${workerName})...`);

      // Single API call with arrays
      const response = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaIds,
          fileUrls,
          fileNames,
          fileTypes,
          guideId,
          updateDB: false, // Preview only – don't save yet
          userMessage: 'Please analyze these files in the context of the guide.',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      const evaluation = data.feedback
        ? { score: data.score || 50, comment: data.feedback }
        : null;

      // ─── Step 3: Show confirmation modal ────────────────────────────
      setPendingSubmission({
        mediaIds,
        fileUrls,
        fileNames,
        fileTypes,
        workerName,
        workerEmail,
        files,
        evaluation,
      });
      setShowConfirmationModal(true);
    } catch (err) {
      console.error('Submission error:', err);
      await addMessage('assistant', '❌ Submission failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Step 4: Confirm – finalize all files with one API call ──────────
  const confirmSubmission = async () => {
    if (!pendingSubmission) return;
    setShowConfirmationModal(false);
    setUploading(true);

    try {
      const { mediaIds, fileUrls, fileNames, fileTypes, files, workerName, workerEmail, evaluation } = pendingSubmission;

      // Finalize: update DB with AI score/comment for all files
      const response = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaIds,
          fileUrls,
          fileNames,
          fileTypes,
          guideId,
          updateDB: true, // Save to DB
          userMessage: 'Final evaluation for all files.',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to finalize');
      }

      // Success message
      await addMessage(
        'assistant',
        `✅ **Work submitted successfully!**\n\n📁 **${files.length} file(s)** submitted by ${workerName}\n\n${evaluation?.comment || 'No evaluation provided.'}`
      );

      // Refresh budget
      const budgetRes = await fetch(`/api/guides/${guideId}/budget`, { credentials: 'include' });
      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        setRemainingBudget(budgetData.remaining_budget);
      }

      setPendingSubmission(null);
    } catch (err) {
      console.error(err);
      await addMessage('assistant', '❌ Failed to finalize submission.');
    } finally {
      setUploading(false);
    }
  };

  const cancelSubmission = () => {
    setShowConfirmationModal(false);
    setPendingSubmission(null);
    addMessage('assistant', '❌ Submission cancelled.');
  };

  // ─── File selection handler ────────────────────────────────────────────
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const action = fileInputRef.current?.getAttribute('data-action');

    if (action === 'consult') {
      uploadForConsultation(fileArray[0]);
    } else if (action === 'submit') {
      const validation = validateFiles(fileArray);
      if (!validation.valid) {
        addMessage('assistant', `❌ ${validation.error}`);
        return;
      }
      requestWorkerNameForSubmission(fileArray);
    }
  };

  const triggerFilePicker = (action: 'consult' | 'submit') => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-action', action);
      fileInputRef.current.multiple = action === 'submit';
      fileInputRef.current.click();
    }
  };

  // ─── Scroll to bottom ─────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="border-t border-gray-200 pt-4">
      {/* ─── Budget display ──────────────────────────────────────────── */}
      {remainingBudget !== null && (
        <div className={`mb-4 p-3 rounded-lg ${remainingBudget < 1000 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">Guide Token Budget Remaining</p>
              <p className={`text-lg font-semibold ${remainingBudget < 1000 ? 'text-red-600' : 'text-green-700'}`}>
                {remainingBudget.toLocaleString()} tokens
              </p>
              {remainingBudget < 1000 && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Budget is low! The guide creator may need to add more tokens.
                </p>
              )}
            </div>
          </div>
          {isCreator && (
            <p className="text-xs text-gray-500 mt-2">
              💡 You can add more tokens by editing this guide and increasing the "Token Budget" field.
            </p>
          )}
        </div>
      )}

      {/* ─── Messages ────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Worker Chat</h3>
        <button onClick={clearChat} className="text-xs text-red-600 hover:text-red-800">Clear Chat</button>
      </div>
      <div className="mb-4 max-h-96 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'worker' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'worker' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <div className="prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && !queuePosition && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Upload progress ────────────────────────────────────────── */}
      {uploadProgress && (
        <div className="mb-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
          📤 Uploading files: {uploadProgress.current} / {uploadProgress.total}
          <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {pendingConsultation && (
        <div className="mb-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
          📎 Pending file: {pendingConsultation.fileName} – type your question.
          <button onClick={() => setPendingConsultation(null)} className="ml-2 text-xs underline">Cancel</button>
        </div>
      )}

      {/* ─── Queue position ──────────────────────────────────────────── */}
      {queuePosition !== null && queuePosition > 0 && (
        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-700 text-sm">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span><strong>Queue position: {queuePosition}</strong> – Please wait.</span>
          </div>
          <button onClick={stopGeneration} className="text-amber-600 hover:text-amber-800 text-xs font-medium">Cancel</button>
        </div>
      )}

      {/* ─── Input area ────────────────────────────────────────────── */}
      <div className="flex space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder={pendingConsultation ? "Type your question about the file..." : "Ask a question..."}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={2}
          disabled={isLoading && !queuePosition}
        />
        {isLoading ? (
          <button
            onClick={stopGeneration}
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
            <span className="ml-1 hidden sm:inline">Stop</span>
          </button>
        ) : (
          <button
            onClick={handleSendMessage}
            disabled={(!input.trim() && !pendingConsultation) || isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        )}
      </div>

      {/* ─── File picker buttons ────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept="image/*,video/*,.pdf,.docx,.doc"
          className="hidden"
        />
        <button
          onClick={() => triggerFilePicker('consult')}
          disabled={uploading || !!pendingConsultation}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          📎 Attach for Consultation
        </button>
        <button
          onClick={() => triggerFilePicker('submit')}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '📤 Submit Work'}
        </button>
        <p className="text-xs text-gray-500">
          Consult: single file + question. Submit: multiple files (max {MAX_TOTAL_SIZE_MB}MB total).
        </p>
      </div>

      {/* ─── Name Modal ────────────────────────────────────────────────── */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Enter your name</h3>
            <p className="text-sm text-gray-600 mb-4">The task giver will see your name with the submission.</p>
            <input
              type="text"
              value={tempWorkerName}
              onChange={(e) => setTempWorkerName(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Your name"
              autoFocus
            />
            <input
              type="email"
              value={tempWorkerEmail}
              onChange={(e) => setTempWorkerEmail(e.target.value)}
              className="w-full border rounded-lg p-2 mb-2"
              placeholder="Your email (required)"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowNameModal(false); setPendingFiles([]); }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempWorkerName.trim() && tempWorkerEmail.trim()) {
                    setShowNameModal(false);
                    const files = [...pendingFiles];
                    setPendingFiles([]);
                    startSubmissionFlow(files, tempWorkerName.trim(), tempWorkerEmail.trim());
                    setTempWorkerName('');
                    setTempWorkerEmail('');
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Confirmation Modal ────────────────────────────────────────── */}
      {showConfirmationModal && pendingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">📋 Confirm Submission</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review the AI evaluation below. If you're satisfied, click "Confirm Submission" to finalize.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-500 mb-2">
                <strong>Files:</strong> {pendingSubmission.fileNames.length} file(s)
              </p>
              <ul className="text-sm text-gray-500 mb-2 list-disc list-inside">
                {pendingSubmission.fileNames.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Worker:</strong> {pendingSubmission.workerName}
              </p>
              {pendingSubmission.evaluation && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">AI Evaluation</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      pendingSubmission.evaluation.score >= 70 ? 'bg-green-100 text-green-700' :
                      pendingSubmission.evaluation.score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Score: {pendingSubmission.evaluation.score}/100
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {pendingSubmission.evaluation.comment}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              {!pendingSubmission.evaluation && (
                <p className="text-sm text-yellow-600">⏳ AI evaluation in progress...</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelSubmission}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                disabled={!pendingSubmission.evaluation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}