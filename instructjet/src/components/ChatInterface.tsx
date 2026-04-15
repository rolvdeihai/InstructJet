// src/components/ChatInterface.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  isSearching = false,
  webSearchEnabled = false,
  onToggleWebSearch,
}: {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  isSearching?: boolean;
  webSearchEnabled?: boolean;
  onToggleWebSearch?: () => void;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating && !isSearching) {
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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
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
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
            </div>
          </div>
        ))}
        {(isSearching || isGenerating) && (
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
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
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
            disabled={isGenerating || isSearching}
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
          <button
            type="submit"
            disabled={!input.trim() || isGenerating || isSearching}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
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