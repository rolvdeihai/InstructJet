// src/components/WorkerChat.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WorkerChatProps {
  guideId: string;
  guideTitle: string;
}

export default function WorkerChat({ guideId, guideTitle }: WorkerChatProps) {
  const [messages, setMessages] = useState<Array<{ role: 'worker' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingConsultation, setPendingConsultation] = useState<{ mediaId: string; fileUrl: string; fileName: string } | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempWorkerName, setTempWorkerName] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load or create session (no name check)
  useEffect(() => {
    const storedSession = localStorage.getItem(`worker_session_${guideId}`);
    if (storedSession) {
      setSessionId(storedSession);
      loadMessages(storedSession);
    } else {
      createSession();
    }
  }, [guideId]);

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

  const saveWorkerName = async (name: string) => {
    if (!sessionId) return;
    await supabase
      .from('worker_chat_sessions')
      .update({ worker_name: name })
      .eq('id', sessionId);
    localStorage.setItem(`worker_name_${guideId}`, name);
  };

  const clearChat = async () => {
    localStorage.removeItem(`worker_session_${guideId}`);
    localStorage.removeItem(`worker_name_${guideId}`);
    await createSession();
    setMessages([]);
    setPendingConsultation(null);
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

  const handleSendMessage = async () => {
    if (!input.trim() && !pendingConsultation) return;
    const userMsg = input.trim();
    setInput('');

    if (pendingConsultation) {
      setIsLoading(true);
      try {
        if (userMsg) await addMessage('worker', userMsg);
        else await addMessage('worker', `📎 Consulting about: ${pendingConsultation.fileName}`);

        const response = await fetch('/api/analyze-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaId: pendingConsultation.mediaId,
            fileUrl: pendingConsultation.fileUrl,
            fileType: 'image',
            guideId,
            updateDB: false,
            userMessage: userMsg || 'Please analyze this image in the context of the guide.'
          }),
        });
        const data = await response.json();
        if (data.feedback) {
          await addMessage('assistant', `📊 **AI Analysis**:\n${data.feedback}`);
          // OCR text is added as a separate assistant message for context (can be hidden later)
          if (data.ocrText && data.ocrText.length) {
            await addMessage('assistant', `📝 **Text extracted from image** (for context):\n\`\`\`\n${data.ocrText.substring(0, 1000)}\n\`\`\``);
          }
        } else {
          await addMessage('assistant', 'Sorry, could not analyze the image.');
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

    if (!userMsg) return;
    await addMessage('worker', userMsg);
    setIsLoading(true);
    try {
      const contextMessages = [...messages, { role: 'worker', content: userMsg }].slice(-10);
      const contextString = contextMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await fetch('/api/worker-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          guideContent: await fetchGuideContent(),
          context: contextString,
        }),
      });
      const data = await response.json();
      if (data.response) {
        await addMessage('assistant', data.response);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error(err);
      await addMessage('assistant', 'Sorry, I encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGuideContent = async () => {
    const { data } = await supabase.from('guides').select('content').eq('id', guideId).single();
    return data?.content || '';
  };

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

      const { data: media, error: insertError } = await supabase
        .from('media_uploads')
        .insert({
          guide_id: guideId,
          worker_session_id: sessionId,
          file_url: fileUrl,
          file_type: file.type.startsWith('image/') ? 'image' : 'video',
          ai_score: null,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;

      setPendingConsultation({ mediaId: media.id, fileUrl, fileName: file.name });
      await addMessage('assistant', `📎 **Image attached:** ${file.name}\n\nType your question and click Send.`);
    } catch (err) {
      console.error(err);
      await addMessage('assistant', 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const requestWorkerName = (file: File) => {
    const existingName = localStorage.getItem(`worker_name_${guideId}`);
    if (existingName) {
      doSubmissionUpload(file, existingName);
    } else {
      setPendingFile(file);
      setShowNameModal(true);
    }
  };

  const doSubmissionUpload = async (file: File, workerName: string) => {
    setUploading(true);
    try {
      if (!localStorage.getItem(`worker_name_${guideId}`)) {
        await saveWorkerName(workerName);
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `worker-uploads/${guideId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('worker-uploads')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from('worker-uploads').getPublicUrl(filePath);
      const fileUrl = publicUrlData.publicUrl;

      const { data: media, error: insertError } = await supabase
        .from('media_uploads')
        .insert({
          guide_id: guideId,
          worker_session_id: sessionId,
          worker_name: workerName,
          file_url: fileUrl,
          file_type: file.type.startsWith('image/') ? 'image' : 'video',
          ai_score: null,
          approval_status: 'pending',
        })
        .select('id')
        .single();
      if (insertError) throw insertError;

      await addMessage('worker', `📤 **Work submitted**: ${file.name} (by ${workerName})`);
      await analyzeUpload(media.id, fileUrl, file.type, true);
      await addMessage('assistant', '✅ Your work has been submitted. The task giver will see it on their dashboard.');
    } catch (err) {
      console.error(err);
      await addMessage('assistant', 'Submission failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const analyzeUpload = async (mediaId: string, fileUrl: string, fileType: string, updateDB: boolean) => {
    try {
      const response = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, fileUrl, fileType, guideId, updateDB }),
      });
      const data = await response.json();
      if (data.feedback) {
        await addMessage('assistant', `📊 **AI Evaluation**:\n${data.feedback}`);
      } else if (data.error) {
        await addMessage('assistant', `❌ Analysis error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      await addMessage('assistant', 'Evaluation error.');
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const action = fileInputRef.current?.getAttribute('data-action');
    if (action === 'consult') {
      uploadForConsultation(file);
    } else if (action === 'submit') {
      requestWorkerName(file);
    }
  };

  const triggerFilePicker = (action: 'consult' | 'submit') => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-action', action);
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="border-t border-gray-200 pt-4">
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-gray-500">
              <div className="flex space-x-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {pendingConsultation && (
        <div className="mb-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
          📎 Pending image: {pendingConsultation.fileName} – type your question.
          <button onClick={() => setPendingConsultation(null)} className="ml-2 text-xs underline">Cancel</button>
        </div>
      )}

      <div className="flex space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder={pendingConsultation ? "Type your question about the image..." : "Ask a question..."}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={2}
        />
        <button onClick={handleSendMessage} disabled={isLoading || (!input.trim() && !pendingConsultation)} className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">Send</button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept="image/*,video/*" className="hidden" />
        <button onClick={() => triggerFilePicker('consult')} disabled={uploading || !!pendingConsultation} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          {uploading ? 'Uploading...' : '📎 Attach for Consultation'}
        </button>
        <button onClick={() => triggerFilePicker('submit')} disabled={uploading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {uploading ? 'Submitting...' : '✅ Submit Work'}
        </button>
        <p className="text-xs text-gray-500">Consultation: attach + ask question. Submission: auto‑evaluated and scored.</p>
      </div>

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
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowNameModal(false); setPendingFile(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button
                onClick={() => {
                  if (tempWorkerName.trim()) {
                    setShowNameModal(false);
                    if (pendingFile) doSubmissionUpload(pendingFile, tempWorkerName.trim());
                    setPendingFile(null);
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
    </div>
  );
}