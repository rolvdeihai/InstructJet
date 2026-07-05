'use client';

import { useState, useEffect, useRef } from 'react';
import ChatInterface from './ChatInterface';
import GuidePreview from './GuidePreview';
import { supabase } from '@/lib/supabase-client';

// ─── Tutorial Component ──────────────────────────────────────────────────────
const GuideTutorial = ({ compact = false }: { compact?: boolean }) => (
  <div className={compact ? "text-sm" : ""}>
    <h3 className="text-xl font-semibold mb-2">📘 Welcome to the Guide Creator</h3>
    <p className="mb-2">
      Start by sending a message describing the guide you want. The AI will help you structure it step by step.
    </p>
    <ul className="list-disc list-inside space-y-1 text-sm">
      <li>Be specific about your topic and audience.</li>
      <li>Enable <strong>Web Search</strong> for current facts.</li>
      <li>For free users: you'll get a section‑by‑section generation.</li>
      <li>Premium users: receive a complete guide in one go.</li>
      <li>Edit the preview, add a title, and publish.</li>
      <li>Attach files for AI analysis to enrich your guide.</li>
      <li>Tips: For tasks that can't be checked with OCR, simply create the guide to instruct the workers to document their work in detail so we can check their report instead. 😁</li>
    </ul>
    <p className="mt-3 text-xs text-blue-600">
      💡 Need more help? Click the <strong>?</strong> button next to the title.
    </p>
  </div>
);

// ─── Guide Section Helpers ──────────────────────────────────────────────
const parseGuideSections = (markdown: string): { frontMatter: string; sections: Record<string, string> } => {
  const sections: Record<string, string> = {};
  const lines = markdown.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];
  let frontMatter: string[] = [];
  let inFrontMatter = true;

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      inFrontMatter = false;
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = match[1].trim();
      currentContent = [];
    } else {
      if (inFrontMatter) {
        frontMatter.push(line);
      } else {
        currentContent.push(line);
      }
    }
  }
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  return { frontMatter: frontMatter.join('\n').trim(), sections };
};

const reconstructGuide = (frontMatter: string, sections: Record<string, string>): string => {
  const sectionStr = Object.entries(sections)
    .map(([title, content]) => `## ${title}\n\n${content}`)
    .join('\n\n');
  return frontMatter ? `${frontMatter}\n\n${sectionStr}` : sectionStr;
};

const updateGuideSections = (
  currentGuide: string,
  updates: Record<string, string>
): string => {
  const { frontMatter, sections } = parseGuideSections(currentGuide);
  let updated = false;
  for (const [sectionName, newContent] of Object.entries(updates)) {
    // Update existing section or add new one
    sections[sectionName] = newContent;
    updated = true;
  }
  return updated ? reconstructGuide(frontMatter, sections) : currentGuide;
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CreateGuideClient({ userId }: { userId: string }) {
  // ─── Core State ──────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [guideContent, setGuideContent] = useState<string>('');
  const [hasGuide, setHasGuide] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingSections, setGeneratingSections] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [guideSections, setGuideSections] = useState<string[]>([]);
  const [showGuideTutorial, setShowGuideTutorial] = useState(false);

  // Web search & queue
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Token budget
  const [tokenBudget, setTokenBudget] = useState<number>(5000);
  const [showBudgetHelp, setShowBudgetHelp] = useState(false);

  // File upload (no bucket) – base64 only
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Abort / request tracking
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const fetchWithCreds = (url: string, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
  };

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await fetchWithCreds('/api/user/profile', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.user?.plan_tier || 'free');
        }
      } catch (err) {
        console.error('Error fetching user plan:', err);
      }
    };
    fetchUserPlan();
  }, []);

  useEffect(() => {
    createNewSession();
  }, []);

  // ─── Session Management ──────────────────────────────────────────────────
  const createNewSession = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: userId, guide_id: null })
      .select('id')
      .single();
    if (error) {
      console.error('Failed to create session:', error);
      return;
    }
    setSessionId(data.id);
    setMessages([]);
    setGuideContent('');
    setHasGuide(false);
    setGuideSections([]);
    setTitle('');
    setGeneratingSections(false);
  };

  const addMessage = async (role: 'user' | 'assistant', content: string) => {
    const newMessage = { role, content };
    setMessages(prev => [...prev, newMessage]);
    if (sessionId) {
      const order = messages.length;
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role,
        content,
        message_order: order,
      });
    }
  };

  // ─── Web Search ──────────────────────────────────────────────────────────
  const fetchWebSearchSummary = async (query: string): Promise<string | null> => {
    try {
      const response = await fetchWithCreds('/api/web-search', {
        method: 'POST',
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
  };

  // ─── Queue Polling ──────────────────────────────────────────────────────
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
    setIsGenerating(false);
    stopQueuePolling();
  };

  // ─── File Upload (base64, no bucket) ──────────────────────────────────
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (['png','jpg','jpeg','gif','webp'].includes(fileExtension)) fileType = 'image';
      else if (['pdf'].includes(fileExtension)) fileType = 'application/pdf';
      else if (['docx'].includes(fileExtension)) fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (['doc'].includes(fileExtension)) fileType = 'application/msword';
      else fileType = 'other';

      const response = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          fileType: fileType,
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
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ─── Main Send Message ──────────────────────────────────────────────────
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Detect revision command
    const isRevision = message.trim().startsWith('@revision');
    const cleanedMessage = isRevision ? message.replace(/^@revision\s*/i, '').trim() : message;

    if (isRevision && !hasGuide) {
      await addMessage('assistant', "I don't see any guide to revise yet. Please generate a guide first using '@guide' or by asking me to create one.");
      return;
    }

    await addMessage('user', message); // store original message for history

    const requestId = crypto.randomUUID();
    setCurrentRequestId(requestId);

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
      const contextMessages = [...messages, { role: 'user', content: message }].slice(-10);
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
          guideContent: guideContent, // always send current guide
          isRevision,                 // tell API it's a revision request
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

      if (data.response) {
        try {
          const parsed = JSON.parse(data.response);

          // Handle revision response
          if (parsed.type === 'revision' && parsed.sections) {
            const newGuide = updateGuideSections(guideContent, parsed.sections);
            setGuideContent(newGuide);
            setHasGuide(true);
            await addMessage('assistant', `✅ I've updated the sections you requested.`);
            setIsGenerating(false);
            stopQueuePolling();
            return;
          }

          // Premium: complete_guide
          if (parsed.action === 'complete_guide') {
            await addMessage('assistant', parsed.content);
            setGuideContent(parsed.content);
            setHasGuide(true);
            setIsGenerating(false);
            stopQueuePolling();
            return;
          }

          // Free: generate_guide (section by section)
          if (parsed.action === 'generate_guide') {
            await addMessage('assistant', `I'll generate a step‑by‑step guide...`);
            setIsGenerating(false);
            stopQueuePolling();
            const sections =
              parsed.sections || [
                'Overview',
                'Prerequisites',
                'Step-by-Step Instructions',
                'Tools & Assets',
                'Flow',
              ];
            setGuideSections(sections);
            await generateGuideSections(parsed.summary, sections, contextString);
            return;
          }
        } catch (e) {
          // Not JSON – normal conversational response
        }
        await addMessage('assistant', data.response);
      } else {
        throw new Error('Empty response from AI');
      }
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
      setCurrentRequestId(null);
    }
  };

  // ─── Section Generation ──────────────────────────────────────────────────
  const generateGuideSections = async (
    prompt: string,
    sections: string[],
    fullContext?: string
  ) => {
    setGeneratingSections(true);
    setGuideContent('');

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
          setGuideContent(fullGuide);
          setHasGuide(true);
        } catch (err) {
          console.error(`Error generating section ${sections[i]}:`, err);
          fullGuide += `\n\n## ${sections[i]}\n*Failed to generate.*`;
          setGuideContent(fullGuide);
          setHasGuide(true);
        }
      }
    } catch (err) {
      console.error('[ERROR] generateGuideSections failed:', err);
      await addMessage('assistant', 'Failed to generate guide sections. Please try again.');
    } finally {
      setGeneratingSections(false);
      setCurrentSectionIndex(0);
    }
  };

  // ─── Publish Guide ────────────────────────────────────────────────────────
  const publishGuide = async () => {
    if (!guideContent) {
      alert('No guide content to publish');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title for the guide');
      return;
    }

    const publishCost = userPlan === 'basic' ? 0 : 5000;
    setSaving(true);

    try {
      if (publishCost > 0) {
        const balanceRes = await fetchWithCreds('/api/tokens/balance', { method: 'GET' });
        if (!balanceRes.ok) {
          const err = await balanceRes.json();
          throw new Error(err.error || 'Failed to check token balance');
        }
        const { total_tokens } = await balanceRes.json();
        if (total_tokens < publishCost) {
          alert(`Insufficient tokens. Need ${publishCost} tokens to publish a guide. Please purchase more tokens or upgrade your plan.`);
          setSaving(false);
          return;
        }

        const deductRes = await fetchWithCreds('/api/tokens/deduct', {
          method: 'POST',
          body: JSON.stringify({
            amount: publishCost,
            feature: 'guide_publish',
            metadata: { title, wordCount: guideContent.length }
          }),
        });
        if (!deductRes.ok) {
          const errorData = await deductRes.json();
          throw new Error(errorData.error || 'Token deduction failed');
        }
      }

      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
      const { data, error } = await supabase
        .from('guides')
        .insert({
          user_id: userId,
          slug,
          title,
          content: guideContent,
          ai_generated: true,
          total_token_budget: tokenBudget,
          token_budget_remaining: tokenBudget,
        })
        .select('slug')
        .single();
      if (error) throw error;
      window.location.href = `/guides/${data.slug}`;
    } catch (err: any) {
      console.error('Publish error:', err);
      alert(err.message || 'Failed to publish guide');
    } finally {
      setSaving(false);
    }
  };

  // ─── Handle Guide Preview Changes ──────────────────────────────────────
  const handleGuidePreviewChange = (newContent: string) => {
    setGuideContent(newContent);
    if (newContent.trim()) {
      setHasGuide(true);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen pt-16">
      {/* ─── Left Panel: Chat ────────────────────────────────────────────── */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating || generatingSections}
          isSearching={isSearching}
          webSearchEnabled={webSearchEnabled}
          onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
          onStopGeneration={stopGeneration}
          queuePosition={queuePosition}
          showWelcome={messages.length === 0}
          onAttachFile={triggerFilePicker}
          uploading={uploading}
          hasGuide={hasGuide}
        />
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept="image/*,.pdf,.docx,.doc"
          className="hidden"
        />
        {generatingSections && guideSections.length > 0 && (
          <div className="border-t border-gray-200 p-2 text-sm text-gray-500 text-center">
            Generating section {currentSectionIndex + 1}/{guideSections.length}: {guideSections[currentSectionIndex]}
          </div>
        )}
      </div>

      {/* ─── Right Panel: Preview + Controls ────────────────────────────── */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col space-y-3">
            {/* Row 1: Title, Publish, New Guide, Help */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Guide Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                onClick={publishGuide}
                disabled={saving || !guideContent}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish Guide'}
              </button>
              <button
                onClick={createNewSession}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                New Guide
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGuideTutorial(!showGuideTutorial)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Guide creation help"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {showGuideTutorial && (
                  <div className="absolute right-0 mt-2 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <GuideTutorial compact />
                    <button onClick={() => setShowGuideTutorial(false)} className="mt-2 text-xs text-primary-600">
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Token Budget */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Worker Chat Token Budget</label>
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowBudgetHelp(!showBudgetHelp)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Help"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {showBudgetHelp && (
                  <div className="absolute z-10 w-80 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 -left-32">
                    <h4 className="font-semibold text-gray-800 mb-1">What is token budget?</h4>
                    <p>Workers who ask questions about this guide will consume tokens from this budget (1000 tokens per message).</p>
                    <p className="mt-1">Set a budget to control how many questions workers can ask. You can top it up later by editing the guide.</p>
                    <p className="mt-1 text-xs text-gray-500">Recommended: 5000–20000 tokens for active guides.</p>
                    <button onClick={() => setShowBudgetHelp(false)} className="mt-2 text-xs text-primary-600">Close</button>
                  </div>
                )}
              </div>
              <input
                type="number"
                value={tokenBudget}
                onChange={(e) => setTokenBudget(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                step="1000"
                className="w-32 px-2 py-1 border rounded-lg text-sm"
              />
              <span className="text-xs text-gray-500">tokens</span>
            </div>
          </div>
        </div>
        <GuidePreview
          content={guideContent}
          onChange={handleGuidePreviewChange}
          userId={userId}
        />
      </div>
    </div>
  );
}