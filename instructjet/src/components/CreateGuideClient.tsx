'use client';

import { useState, useEffect, useRef } from 'react';
import ChatInterface from './ChatInterface';
import GuidePreview from './GuidePreview';
import { supabase } from '@/lib/supabase-client';

export default function CreateGuideClient({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [guideContent, setGuideContent] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingSections, setGeneratingSections] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [guideSections, setGuideSections] = useState<string[]>([]);
  
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Token budget field for workers' chat
  const [tokenBudget, setTokenBudget] = useState<number>(5000);
  const [showBudgetHelp, setShowBudgetHelp] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await fetchWithCreds('/api/user/profile', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.user?.plan_tier || 'free');
        } else {
          console.error('Failed to fetch user plan:', res.status);
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
      if (!data.results || data.results.length === 0) {
        return null;
      }

      const summary = data.results.map((r: any, idx: number) =>
        `${idx + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.url}`
      ).join('\n\n');

      return `Web search results for "${query}":\n\n${summary}`;
    } catch (err) {
      console.error('Web search fetch failed:', err);
      return null;
    }
  };

  // Start polling /api/queue-status
  const startQueuePolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/queue-status');
        if (!res.ok) return;
        const status = await res.json();
        // Show queue position if there are queued requests.
        // The user's position = number of queued + (1 if active > 0)
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
      // Tell backend to cancel
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

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    await addMessage('user', message);

    const requestId = crypto.randomUUID();
    setCurrentRequestId(requestId);

    let searchSummary: string | null = null;
    if (webSearchEnabled) {
      setIsSearching(true);
      searchSummary = await fetchWebSearchSummary(message);
      setIsSearching(false);
      if (searchSummary) {
        await addMessage('assistant', `🔍 I searched the web for "${message}"...`);
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
          message, 
          context: contextString,
          requestId
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
          
          // 🚀 PREMIUM: complete_guide (full guide from DeepSeek)
          if (parsed.action === 'complete_guide') {
            // Display the full markdown guide in chat
            await addMessage('assistant', parsed.content);
            // Populate the preview area
            setGuideContent(parsed.content);
            setIsGenerating(false);
            stopQueuePolling();
            return;
          }
          
          // FREE: generate_guide (triggers section-by-section)
          if (parsed.action === 'generate_guide') {
            await addMessage('assistant', `I'll generate a step‑by‑step guide...`);
            setIsGenerating(false);
            stopQueuePolling();
            const sections = parsed.sections || ['Overview', 'Prerequisites', 'Step-by-Step Instructions', 'Tools & Assets', 'Flow'];
            setGuideSections(sections);
            await generateGuideSections(parsed.summary, sections);
            return;
          }
        } catch (e) {
          // Not JSON – normal conversational response
        }
        // Normal text response (non‑guide)
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

  const generateGuideSections = async (prompt: string, sections: string[]) => {
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
      
      // Only compress if the prompt is longer than ~2000 characters (approx 500 tokens)
      if (prompt.length > 2000) {
        console.log('[DEBUG] Compressing long query:', prompt.slice(0, 100) + '...');
        const compressRes = await fetch(`${baseUrl}/compress-query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (!compressRes.ok) throw new Error(`Compress failed: ${compressRes.status}`);
        const { compressed } = await compressRes.json();
        contextToUse = compressed;
        console.log('[DEBUG] Compressed context received');
      } else {
        console.log('[DEBUG] Skipping compression (short prompt, using original)');
      }

      let fullGuide = '';
      for (let i = 0; i < sections.length; i++) {
        setCurrentSectionIndex(i);
        try {
          console.log(`[DEBUG] Generating section ${i+1}/${sections.length}: ${sections[i]}`);
          const response = await fetch(`${baseUrl}/generate-section`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section_type: sections[i],
              compressed_context: contextToUse,
              compress_input: false,
            }),
          });
          if (!response.ok) throw new Error(`Section generation failed: ${response.status}`);
          const data = await response.json();
          fullGuide += `\n\n## ${sections[i]}\n${data.content}`;
          setGuideContent(fullGuide);
        } catch (err) {
          console.error(`Error generating section ${sections[i]}:`, err);
          fullGuide += `\n\n## ${sections[i]}\n*Failed to generate.*`;
          setGuideContent(fullGuide);
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
        // Check balance
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

        // Deduct tokens
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

      // Save guide with token budget
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
      const { data, error } = await supabase
        .from('guides')
        .insert({
          user_id: userId,
          slug,
          title,
          content: guideContent,
          ai_generated: true,
          total_token_budget: tokenBudget,        // NEW: set initial budget
          token_budget_remaining: tokenBudget,    // NEW: remaining budget starts same
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

  return (
    <div className="flex h-screen pt-16">
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating || generatingSections}
          isSearching={isSearching}
          webSearchEnabled={webSearchEnabled}
          onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
          onStopGeneration={stopGeneration}
          queuePosition={queuePosition}   // 👈 add this line
        />
        {generatingSections && guideSections.length > 0 && (
          <div className="border-t border-gray-200 p-2 text-sm text-gray-500 text-center">
            Generating section {currentSectionIndex + 1}/{guideSections.length}: {guideSections[currentSectionIndex]}
          </div>
        )}
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col space-y-3">
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
            </div>
            {/* Token Budget Input with Help Popup */}
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
        <GuidePreview content={guideContent} onChange={setGuideContent} />
      </div>
    </div>
  );
}