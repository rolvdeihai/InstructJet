'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  isSearching?: boolean;
  webSearchEnabled?: boolean;
  onToggleWebSearch?: () => void;
  onStopGeneration?: () => void;
  queuePosition?: number | null;
  showWelcome?: boolean;
  onAttachFile?: () => void;
  uploading?: boolean;
  hasGuide?: boolean; // new prop to indicate if a guide exists
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  isSearching = false,
  webSearchEnabled = false,
  onToggleWebSearch,
  onStopGeneration,
  queuePosition = null,
  showWelcome = false,
  onAttachFile,
  uploading = false,
  hasGuide = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating && !isSearching && !uploading) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );

  const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  );

  const handleInsertGuide = () => {
    setInput(prev => '@guide ' + prev);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleInsertRevision = () => {
    setInput(prev => '@revision ' + prev);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const WelcomeTutorial = () => (
    <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-800">
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
      </ul>
      <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-300 text-sm">
        <strong className="block mb-1">💡 Pro Tip</strong>
        <p>
          If your task can't be verified automatically (e.g., no images or documents to scan), 
          simply create a guide that asks workers to <strong>describe their work in detail</strong> 
          – step by step, with explanations. 
          The AI can then evaluate their written report for completeness and clarity, giving you 
          confidence that the job was done right.
        </p>
        <p className="mt-1 text-xs text-blue-700">
          Example: Instead of "Take a photo of the assembly", ask "Write a summary of the 
          steps you followed and any challenges you encountered."
        </p>
      </div>
      <p className="mt-3 text-xs text-blue-600">
        💡 Need more help? Click the <strong>?</strong> button next to the title.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ─── Message Area ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && showWelcome ? (
          <div className="flex items-center justify-center h-full">
            <WelcomeTutorial />
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a({ href, children }) {
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:underline"
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {(isSearching || isGenerating) && !queuePosition && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm">
                  {isSearching ? 'Searching the web...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Queue Position Banner (with Upgrade link) ────────────────── */}
      {queuePosition !== null && queuePosition > 0 && (
        <div className="px-4 pt-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex flex-wrap items-center justify-between text-sm gap-2">
            <div className="flex flex-wrap items-center space-x-2 text-amber-700">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>
                <strong>Queue position: {queuePosition}</strong>
                <span className="ml-1">– Please wait.</span>
              </span>
              <span className="ml-1 text-amber-800">
                Or{' '}
                <Link
                  href="/pricing"
                  target="_blank"
                  className="font-bold text-primary-600 hover:underline hover:text-primary-800"
                >
                  Upgrade to Premium
                </Link>
                <span className="ml-1">to bypass the queue ⚡</span>
              </span>
            </div>
            <button
              onClick={onStopGeneration}
              className="text-amber-600 hover:text-amber-800 text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── Input Form ────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        {/* Toolbar */}
        <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
          <button
            type="button"
            onClick={handleInsertGuide}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            @guide
          </button>
          <span className="text-xs text-gray-500">
            Add @guide to generate a guide
          </span>

          <button
            type="button"
            onClick={handleInsertRevision}
            className={`text-xs px-2 py-1 rounded ${
              hasGuide
                ? 'bg-gray-100 hover:bg-gray-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!hasGuide}
            title={hasGuide ? 'Add @revision to edit a section' : 'No guide exists yet'}
          >
            @revision
          </button>
          <span className="text-xs text-gray-500">
            {hasGuide
              ? 'Add @revision to edit a section'
              : '(no guide to edit yet)'}
          </span>

          {onAttachFile && (
            <button
              type="button"
              onClick={onAttachFile}
              disabled={uploading}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1"
            >
              {uploading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                <span>📎</span>
              )}
              {uploading ? 'Uploading...' : 'Attach File'}
            </button>
          )}
        </div>

        {/* Input row */}
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe the task... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isGenerating || isSearching || (queuePosition !== null && queuePosition > 0) || uploading}
          />
          {onToggleWebSearch && (
            <button
              type="button"
              onClick={onToggleWebSearch}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                webSearchEnabled
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
              title="Enable web search for this message"
            >
              🌐
            </button>
          )}
          {isGenerating && onStopGeneration ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center"
              title="Stop generating"
            >
              <StopIcon />
              <span className="ml-1 hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                !input.trim() ||
                isGenerating ||
                isSearching ||
                (queuePosition !== null && queuePosition > 0) ||
                uploading
              }
              className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center"
              title="Send message"
            >
              <SendIcon />
              <span className="ml-1 hidden sm:inline">Send</span>
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-2 text-center">
          {webSearchEnabled ? (
            <span className="text-primary-600">🔍 Web search enabled – I'll look up current info before answering.</span>
          ) : (
            "The AI will ask clarifying questions, then generate a step-by-step guide."
          )}
        </div>
      </form>
    </div>
  );
}