// src/components/CreateGuideClient.tsx
'use client';

import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import GuidePreview from './GuidePreview';
import { supabase } from '@/lib/supabase-client';
import CaptchaSolver from './CaptchaSolver';

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
  
  // NEW: web search state
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // const webSearchApiUrl = process.env.NEXT_PUBLIC_WEB_SEARCH_API_URL;
  // const wsBaseUrl = process.env.NEXT_PUBLIC_WEB_SEARCH_API_URL || window.location.origin;

  // Create a fresh session on mount
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

  // Helper: call web search API and return summarized text
  const fetchWebSearchSummary = async (query: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxResults: 5 }),
      });

      if (!response.ok) {
        console.error('Web search API error:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        console.log('No results from web search');
        return null;
      }

      // Log which source was used (for debugging)
      console.log(`[Client] Web search used source: ${data.source} (chain: ${data.allSources?.join(' → ')})`);

      // Format results as before
      const summary = data.results.map((r: any, idx: number) =>
        `${idx + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.url}`
      ).join('\n\n');

      return `Web search results for "${query}":\n\n${summary}`;
    } catch (err) {
      console.error('Web search fetch failed:', err);
      return null;
    }
  };


  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    await addMessage('user', message);
    
    // If web search is enabled, perform search first
    let searchSummary: string | null = null;
    if (webSearchEnabled) {
      setIsSearching(true);
      searchSummary = await fetchWebSearchSummary(message);
      setIsSearching(false);
      // Optionally add a system message indicating search was used
      if (searchSummary) {
        await addMessage('assistant', `🔍 I searched the web for "${message}" and found the following information:\n\n${searchSummary}\n\nNow I'll use this to help create your guide.`);
      } else {
        await addMessage('assistant', `⚠️ Web search failed or returned no results. Continuing without search.`);
      }
    }

    setIsGenerating(true);
    try {
      // Build conversation context (last 10 messages)
      const contextMessages = [...messages, { role: 'user', content: message }].slice(-10);
      let contextString = contextMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      
      // Prepend search summary if available
      if (searchSummary) {
        contextString = `[WEB SEARCH RESULTS]\n${searchSummary}\n\n[CONVERSATION HISTORY]\n${contextString}`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: contextString,
        }),
      });
      const data = await response.json();
      if (data.response) {
        try {
          const parsed = JSON.parse(data.response);
          if (parsed.action === 'generate_guide') {
            await addMessage('assistant', `I'll generate a step‑by‑step guide for you: **${parsed.summary}**. The guide will appear on the right.`);
            setIsGenerating(false);
            const sections = [
              'Overview',
              'Prerequisites',
              'Step-by-Step Instructions',
              'Tools & Assets',
              'Flow'
            ];
            setGuideSections(sections);
            await generateGuideSections(parsed.summary, sections);
            return;
          }
        } catch (e) {
          // Not JSON – normal assistant response
        }
        await addMessage('assistant', data.response);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error(err);
      await addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGuideSections = async (prompt: string, sections: string[]) => {
    setGeneratingSections(true);
    setGuideContent('');
    setCurrentSectionIndex(0);
    let fullGuide = '';
    for (let i = 0; i < sections.length; i++) {
      setCurrentSectionIndex(i);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_HF_API_BASE_URL;
        const response = await fetch(`${baseUrl}/generate-section`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_type: sections[i],
            context: `User request: ${prompt}\nPrevious sections:\n${fullGuide}`,
            compress_input: true,
          }),
        });
        const data = await response.json();
        const sectionContent = data.content;
        fullGuide += `\n\n## ${sections[i]}\n${sectionContent}`;
        setGuideContent(fullGuide);
      } catch (err) {
        console.error(`Error generating section ${sections[i]}:`, err);
        fullGuide += `\n\n## ${sections[i]}\n*Failed to generate this section. Please try again.*`;
        setGuideContent(fullGuide);
      }
    }
    setGeneratingSections(false);
    setCurrentSectionIndex(0);
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
    setSaving(true);
    try {
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
      const { data, error } = await supabase
        .from('guides')
        .insert({
          user_id: userId,
          slug,
          title,
          content: guideContent,
          ai_generated: true,
        })
        .select('slug')
        .single();
      if (error) throw error;
      window.location.href = `/guides/${data.slug}`;
    } catch (err) {
      console.error('Publish error:', err);
      alert('Failed to publish guide');
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
        />
        {generatingSections && guideSections.length > 0 && (
          <div className="border-t border-gray-200 p-2 text-sm text-gray-500 text-center">
            Generating section {currentSectionIndex + 1}/{guideSections.length}: {guideSections[currentSectionIndex]}
          </div>
        )}
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <input
            type="text"
            placeholder="Guide Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg mr-2"
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
            className="ml-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            New Guide
          </button>
        </div>
        <GuidePreview content={guideContent} onChange={setGuideContent} />
      </div>
      {/* CAPTCHA modal – floats above everything */}
      {/* {webSearchApiUrl && webSearchEnabled && <CaptchaSolver wsUrl={wsBaseUrl} />} */}
    </div>
  );
}