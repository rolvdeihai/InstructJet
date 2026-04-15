// src/components/GuidePreview.tsx
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from './MermaidDiagram';

interface GuidePreviewProps {
  content: string;
  onChange: (content: string) => void;
}

export default function GuidePreview({ content, onChange }: GuidePreviewProps) {
  const [editMode, setEditMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-2 flex space-x-2">
        <button
          onClick={() => setEditMode('edit')}
          className={`px-3 py-1 rounded ${editMode === 'edit' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
        >
          Edit
        </button>
        <button
          onClick={() => setEditMode('preview')}
          className={`px-3 py-1 rounded ${editMode === 'preview' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
        >
          Preview
        </button>
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-auto p-4">
        {editMode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full flex-1 border border-gray-300 rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            style={{ minHeight: 0 }}
            placeholder="Guide content will appear here after AI generates it..."
          />
        ) : (
          <div className="flex-1 overflow-auto prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const inline = (props as any).inline;
                  if (!inline && match && match[1] === 'mermaid') {
                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}