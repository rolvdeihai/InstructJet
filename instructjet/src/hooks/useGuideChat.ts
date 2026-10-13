// src/hooks/useGuideChat.ts
//
// AI chat that drives a guide document. Shared by the create page and the
// edit page: owns the chat session, messages, web search, file analysis,
// queue polling and the @guide / @revision flows. The guide content itself is
// owned by the caller and updated through `onGuideChange`.

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export type GuideChatMessage = { role: 'user' | 'assistant'; content: string };

const DEFAULT_SECTIONS = [
  'Overview',
  'Prerequisites',
  'Step-by-Step Instructions',
  'Tools & Assets',
  'Flow',
];

interface UseGuideChatOptions {
  userId: string;
  /** Existing guide this chat belongs to (edit page); null while creating. */
  guideId?: string | null;
  guideContent: string;
  onGuideChange: (content: string) => void;
}

export function useGuideChat({ userId, guideId = null, guideContent, onGuideChange }: UseGuideChatOptions) {
  const [messages, setMessages] = useState<GuideChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSections, setGeneratingSections] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [guideSections, setGuideSections] = useState<string[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentRequestIdRef = useRef<string | null>(null);

  // Refs so callbacks always see the latest values without being recreated.
  const messagesRef = useRef<GuideChatMessage[]>([]);
  const guideContentRef = useRef(guideContent);
  guideContentRef.current = guideContent;
  const onGuideChangeRef = useRef(onGuideChange);
  onGuideChangeRef.current = onGuideChange;

  const hasGuide = guideContent.trim().length > 0;

  // ─── Session Management ──────────────────────────────────────────────────
  const resetChat = useCallback(async () => {
    messagesRef.current = [];
    setMessages([]);
    setGuideSections([]);
    setGeneratingSections(false);
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: userId, guide_id: guideId })
      .select('id')
      .single();
    if (error) {
      console.error('Failed to create session:', error);
      return;
    }
    setSessionId(data.id);
  }, [userId, guideId]);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    const order = messagesRef.current.length;
    messagesRef.current = [...messagesRef.current, { role, content }];
    setMessages(messagesRef.current);
    if (sessionId) {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role,
        content,
        message_order: order,
      });
    }
  }, [sessionId]);

  // ─── Web Search ──────────────────────────────────────────────────────────
  const fetchWebSearchSummary = useCallback(async (query: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/web-search', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxResults: 5 }),
      });

      if (!response.ok) {
        if (response.status === 402) {
          await addMessage('assistant', '⚠️ Insufficient tokens for web search. Please purchase more tokens.');
          return null;
        }
        console.error('Web search API error:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) return null;

      const summary = data.results.map((r: any, idx: number) =>
        `${idx + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.url}`
      ).join('\n\n');

      return `Web search results for "${query}":\n\n${summary}`;
    } catch (err) {
      console.error('Web search fetch failed:', err);
      return null;
    }
  }, [addMessage]);

  // ─── Queue Polling ──────────────────────────────────────────────────────
  const startQueuePolling = useCallback(() => {
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
  }, []);

  const stopQueuePolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setQueuePosition(null);
  }, []);

  useEffect(() => stopQueuePolling, [stopQueuePolling]);

  const stopGeneration = useCallback(async () => {
    const requestId = currentRequestIdRef.current;
    if (requestId) {
      try {
        await fetch('/api/cancel', {
          method: 'POST',
          body: JSON.stringify({ requestId }),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Cancel request failed', err);
      }
      currentRequestIdRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    stopQueuePolling();
  }, [stopQueuePolling]);

  // ─── File Upload (base64, analysed for context) ──────────────────────────
  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await addMessage('assistant', `📎 **File attached:** ${file.name}\n\nAnalyzing...`);

      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType = '';
      if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension)) fileType = 'image';
      else if (['pdf'].includes(fileExtension)) fileType = 'application/pdf';
      else if (['docx'].includes(fileExtension)) fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (['doc'].includes(fileExtension)) fileType = 'application/msword';
      else fileType = 'other';

      const response = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          fileType,
          fileName: file.name,
          guideId: null,
          updateDB: false,
          userMessage: 'Please analyze this file for context to help create a guide.',
        }),
      });

      const data = await response.json();
      if (data.feedback) {
        await addMessage('assistant', `📊 **AI Analysis**:\n${data.feedback}`);
        if (data.ocrText && data.ocrText.length) {
          await addMessage('assistant', `📝 **Text extracted from file** (for context):\n\`\`\`\n${data.ocrText.substring(0, 1500)}\n\`\`\``);
        }
      } else {
        await addMessage('assistant', 'Sorry, could not analyze the file.');
      }
    } catch (err) {
      console.error(err);
      await addMessage('assistant', '❌ Failed to process file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [addMessage]);

  const triggerFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ─── Section Generation (free tier, HF server) ───────────────────────────
  const generateGuideSections = useCallback(async (
    prompt: string,
    sections: string[],
    fullContext?: string
  ) => {
    setGeneratingSections(true);
    onGuideChangeRef.current('');

    const baseUrl = process.env.NEXT_PUBLIC_HF_API_BASE_URL;
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_HF_API_BASE_URL is not defined');
      setGeneratingSections(false);
      return;
    }

    try {
      let contextToUse = prompt;

      if (fullContext) {
        try {
          const compressRes = await fetch(`${baseUrl}/compress-query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: fullContext }),
          });
          if (compressRes.ok) {
            const { compressed } = await compressRes.json();
            if (compressed) contextToUse = compressed;
          } else {
            contextToUse = fullContext;
          }
        } catch (err) {
          console.error('Compression error:', err);
          contextToUse = fullContext;
        }
      }

      let fullGuide = '';
      for (let i = 0; i < sections.length; i++) {
        setCurrentSectionIndex(i);
        try {
          const response = await fetch(`${baseUrl}/generate-section`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section_type: sections[i],
              context: contextToUse,
              compress_input: false,
            }),
          });

          if (!response.ok) {
            throw new Error(`Section generation failed: ${response.status}`);
          }

          const data = await response.json();
          fullGuide += `\n\n## ${sections[i]}\n${data.content}`;
        } catch (err) {
          console.error(`Error generating section ${sections[i]}:`, err);
          fullGuide += `\n\n## ${sections[i]}\n*Failed to generate.*`;
        }
        onGuideChangeRef.current(fullGuide);
      }
    } catch (err) {
      console.error('[ERROR] generateGuideSections failed:', err);
      await addMessage('assistant', 'Failed to generate guide sections. Please try again.');
    } finally {
      setGeneratingSections(false);
      setCurrentSectionIndex(0);
    }
  }, [addMessage]);

  // ─── Send Message ────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const isRevision = /^@revision\b/i.test(message.trim());
    const cleanedMessage = isRevision ? message.trim().replace(/^@revision\s*/i, '').trim() : message;
    const currentGuide = guideContentRef.current;

    if (isRevision && !currentGuide.trim()) {
      await addMessage('assistant', "I don't see any guide to revise yet. Please generate a guide first using '@guide' or by asking me to create one.");
      return;
    }

    const history = messagesRef.current;
    await addMessage('user', message);

    const requestId = crypto.randomUUID();
    currentRequestIdRef.current = requestId;

    let searchSummary: string | null = null;
    if (webSearchEnabled) {
      setIsSearching(true);
      searchSummary = await fetchWebSearchSummary(cleanedMessage);
      setIsSearching(false);
      if (searchSummary) {
        await addMessage('assistant', `🔍 I searched the web for "${cleanedMessage}"...`);
      } else {
        await addMessage('assistant', `⚠️ Web search failed...`);
      }
    }

    setIsGenerating(true);
    startQueuePolling();

    try {
      const contextMessages = [...history, { role: 'user', content: message }].slice(-10);
      let contextString = contextMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      if (searchSummary) {
        contextString = `[WEB SEARCH RESULTS]\n${searchSummary}\n\n[CONVERSATION HISTORY]\n${contextString}`;
      }

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanedMessage,
          context: contextString,
          requestId,
          guideContent: currentGuide,
          isRevision,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (data.aborted === true) {
        console.log('Request aborted by user');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (data.queue_position > 0) {
        setQueuePosition(data.queue_position);
        setTimeout(() => setQueuePosition(null), 3000);
      }

      if (!data.response) {
        throw new Error('Empty response from AI');
      }

      let parsed: any = null;
      try {
        parsed = JSON.parse(data.response);
      } catch {
        // Not JSON – normal conversational response
      }

      if (parsed?.type === 'revision' && typeof parsed.content === 'string') {
        onGuideChangeRef.current(parsed.content);
        await addMessage('assistant', parsed.summary
          ? `✅ Guide updated.\n\n${parsed.summary}`
          : `✅ I've rewritten the guide with your revisions.`);
        return;
      }

      if (parsed?.action === 'complete_guide') {
        await addMessage('assistant', parsed.content);
        onGuideChangeRef.current(parsed.content);
        return;
      }

      if (parsed?.action === 'generate_guide') {
        await addMessage('assistant', `I'll generate a step‑by‑step guide...`);
        setIsGenerating(false);
        stopQueuePolling();
        const sections = parsed.sections || DEFAULT_SECTIONS;
        setGuideSections(sections);
        await generateGuideSections(parsed.summary, sections, contextString);
        return;
      }

      await addMessage('assistant', data.response);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request aborted by user');
        return;
      }
      console.error('[ERROR] handleSendMessage failed:', err);
      await addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsGenerating(false);
      stopQueuePolling();
      abortControllerRef.current = null;
      currentRequestIdRef.current = null;
    }
  }, [
    addMessage,
    webSearchEnabled,
    fetchWebSearchSummary,
    startQueuePolling,
    stopQueuePolling,
    generateGuideSections,
  ]);

  const toggleWebSearch = useCallback(() => setWebSearchEnabled(v => !v), []);

  return {
    messages,
    hasGuide,
    resetChat,
    handleSendMessage,
    stopGeneration,
    fileInputRef,
    handleFileSelected,
    triggerFilePicker,
    uploading,
    isGenerating,
    isSearching,
    webSearchEnabled,
    toggleWebSearch,
    queuePosition,
    generatingSections,
    currentSectionIndex,
    guideSections,
  };
}
