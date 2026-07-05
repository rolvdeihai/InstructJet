'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidDiagram from './MermaidDiagram';

interface GuidePreviewProps {
  content: string;
  onChange: (content: string) => void;
  showToolbar?: boolean;
  userId?: string;
}

export default function GuidePreview({
  content,
  onChange,
  showToolbar = true,
  userId,
}: GuidePreviewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Update history when content changes from parent
  useEffect(() => {
    if (content !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);

  const pushHistory = (newContent: string) => {
    if (newContent === history[historyIndex]) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onChange(newContent);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    pushHistory(newContent);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  };

  // ─── Toolbar Core ──────────────────────────────────────────────────────

  const insertMarkdown = (before: string, after: string, placeholder?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newSelected = selected || placeholder || '';
    const newContent =
      content.substring(0, start) +
      before +
      newSelected +
      after +
      content.substring(end);
    pushHistory(newContent);
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + newSelected.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const wrapWith = (before: string, after: string, placeholder?: string) => {
    insertMarkdown(before, after, placeholder);
  };

  // ─── Table Generator ──────────────────────────────────────────────────
  const handleTable = () => {
    const rows = parseInt(prompt('Number of rows (including header):', '3') || '3');
    const cols = parseInt(prompt('Number of columns:', '3') || '3');
    if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) return;

    let table = '|' + ' Header |'.repeat(cols) + '\n';
    table += '|' + ' --- |'.repeat(cols) + '\n';
    for (let i = 1; i < rows; i++) {
      table += '|' + ' Cell |'.repeat(cols) + '\n';
    }
    wrapWith('\n' + table + '\n', '');
  };

  // ─── Color / Highlight ────────────────────────────────────────────────
  const handleColor = () => {
    colorInputRef.current?.click();
  };

  const onColorPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    wrapWith(`<span style="color:${color};">`, '</span>');
  };

  const handleHighlight = () => {
    highlightInputRef.current?.click();
  };

  const onHighlightPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    wrapWith(`<span style="background-color:${color};">`, '</span>');
  };

  // ─── Superscript / Subscript ──────────────────────────────────────────
  const handleSuperscript = () => wrapWith('<sup>', '</sup>');
  const handleSubscript = () => wrapWith('<sub>', '</sub>');

  // ─── Video Insertion ──────────────────────────────────────────────────
  const handleVideo = () => {
    const url = prompt(
      'Enter video URL:\n\n' +
      'Supported formats:\n' +
      '• YouTube: https://youtu.be/... or https://www.youtube.com/watch?v=...\n' +
      '• Google Drive: https://drive.google.com/file/d/.../view (Must share edit url)\n' + 
      '• Direct video file: https://example.com/video.mp4'
    );
    if (!url || !url.trim()) return;
    // For Google Drive, we'll keep the original URL – preview will handle it
    wrapWith(`[Video](${url.trim()})`, '');
  };

  // ─── Image Upload via API ────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-guide-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;
      const altText = prompt('Alt text for image:', file.name.split('.')[0]) || 'image';
      const width = prompt('Image width (e.g., 100%, 300px, leave blank for auto):', '');
      let markdown;
      if (width) {
        markdown = `<img src="${imageUrl}" alt="${altText}" style="width:${width}; max-width:100%;" />`;
      } else {
        markdown = `![${altText}](${imageUrl})`;
      }
      wrapWith(markdown, '');
    } catch (err: any) {
      console.error('Image upload error:', err);
      alert(err.message || 'Failed to upload image.');
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

  // ─── Toolbar Handlers ─────────────────────────────────────────────────
  const handleBold = () => wrapWith('**', '**', 'bold text');
  const handleItalic = () => wrapWith('*', '*', 'italic text');
  const handleUnderline = () => wrapWith('__', '__', 'underlined text');
  const handleHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    wrapWith(prefix, '', 'Heading');
  };
  const handleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const lines = selected.split('\n');
    const newSelected = lines.map(line => (line.trim() ? `- ${line}` : line)).join('\n');
    const newContent = content.substring(0, start) + newSelected + content.substring(end);
    pushHistory(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newSelected.length);
    }, 0);
  };
  const handleNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const lines = selected.split('\n');
    const newSelected = lines.map((line, idx) => (line.trim() ? `${idx+1}. ${line}` : line)).join('\n');
    const newContent = content.substring(0, start) + newSelected + content.substring(end);
    pushHistory(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newSelected.length);
    }, 0);
  };
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = prompt('Link text:', 'link');
      const linkText = text || 'link';
      wrapWith(`[${linkText}](`, ')', url);
    }
  };
  const handleCodeBlock = () => wrapWith('```\n', '\n```', 'code');
  const handleBlockquote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const lines = selected.split('\n');
    const newSelected = lines.map(line => (line.trim() ? `> ${line}` : line)).join('\n');
    const newContent = content.substring(0, start) + newSelected + content.substring(end);
    pushHistory(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newSelected.length);
    }, 0);
  };
  const handleHr = () => {
    wrapWith('\n---\n', '');
  };

  // ─── Help Modal ──────────────────────────────────────────────────────
  const HelpContent = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Markdown Cheat Sheet</h2>
          <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div><strong>Bold:</strong> <code>**text**</code> → <b>text</b></div>
          <div><strong>Italic:</strong> <code>*text*</code> → <i>text</i></div>
          <div><strong>Underline:</strong> <code>__text__</code> → <u>text</u></div>
          <div><strong>Headings:</strong> <code># H1</code>, <code>## H2</code>, ... <code>###### H6</code></div>
          <div><strong>Bullet list:</strong> <code>- item</code> or <code>* item</code></div>
          <div><strong>Numbered list:</strong> <code>1. item</code></div>
          <div><strong>Link:</strong> <code>[text](url)</code></div>
          <div><strong>Image:</strong> <code>![alt](image-url)</code></div>
          <div><strong>Table:</strong> Use the 📊 button to generate.</div>
          <div><strong>Code block:</strong> Wrap with <code>```</code></div>
          <div><strong>Blockquote:</strong> Start line with <code>&gt;</code></div>
          <div><strong>Superscript:</strong> <code>&lt;sup&gt;text&lt;/sup&gt;</code></div>
          <div><strong>Subscript:</strong> <code>&lt;sub&gt;text&lt;/sub&gt;</code></div>
          <div><strong>Color:</strong> <code>&lt;span style="color:red;"&gt;text&lt;/span&gt;</code></div>
          <div><strong>Highlight:</strong> <code>&lt;span style="background:yellow;"&gt;text&lt;/span&gt;</code></div>
          <div><strong>Video:</strong> Use the ▶️ button or paste a link as <code>[Video](url)</code>.</div>
          <div><strong>Google Drive:</strong> Use the share link <code>https://drive.google.com/file/d/.../view</code> and make sure it's public.</div>
        </div>
      </div>
    </div>
  );

  // ─── Video URL detection (for preview) ───────────────────────────────
  const getVideoEmbedUrl = (url: string): string | null => {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Google Drive - extract file ID and use /preview endpoint
    const driveMatch = url.match(/\/file\/d\/([^\/]+)\//);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    // Direct video file
    if (/\.(mp4|webm|ogg|mov|avi|wmv|flv)(\?.*)?$/i.test(url)) {
      return url;
    }

    return null;
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden">
      {showToolbar && (
        <>
          <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
            <input
              type="color"
              ref={colorInputRef}
              onChange={onColorPick}
              className="hidden"
              value="#000000"
            />
            <input
              type="color"
              ref={highlightInputRef}
              onChange={onHighlightPick}
              className="hidden"
              value="#ffff00"
            />

            {/* Text formatting */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={handleBold} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Bold (Ctrl+B)">B</button>
              <button type="button" onClick={handleItalic} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Italic (Ctrl+I)"><i>I</i></button>
              <button type="button" onClick={handleUnderline} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Underline (Ctrl+U)"><u>U</u></button>
              <button type="button" onClick={handleColor} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Text color">A</button>
              <button type="button" onClick={handleHighlight} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Highlight">H</button>
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            {/* Headings */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={() => handleHeading(1)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Heading 1">H1</button>
              <button type="button" onClick={() => handleHeading(2)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Heading 2">H2</button>
              <button type="button" onClick={() => handleHeading(3)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Heading 3">H3</button>
              <button type="button" onClick={() => handleHeading(4)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Heading 4">H4</button>
              <button type="button" onClick={() => handleHeading(5)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Heading 5">H5</button>
              <button type="button" onClick={() => handleHeading(6)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Heading 6">H6</button>
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            {/* Lists */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={handleBulletList} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Bullet list">•</button>
              <button type="button" onClick={handleNumberedList} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Numbered list">1.</button>
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            {/* Links & Media */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={handleLink} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Link">🔗</button>
              <button type="button" onClick={handleVideo} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Video">▶️</button>
              <button type="button" onClick={triggerFilePicker} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Upload Image" disabled={uploading}>
                {uploading ? '⏳' : '🖼️'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            {/* Table & code */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={handleTable} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Insert table">📊</button>
              <button type="button" onClick={handleCodeBlock} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Code block">{'<>'}</button>
              <button type="button" onClick={handleBlockquote} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Blockquote">"</button>
              <button type="button" onClick={handleHr} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Horizontal rule">---</button>
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            {/* Superscript / Subscript */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={handleSuperscript} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Superscript">x²</button>
              <button type="button" onClick={handleSubscript} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Subscript">x₂</button>
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            {/* Undo / Redo / Help */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-200">
              <button type="button" onClick={undo} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Undo (Ctrl+Z)">↩️</button>
              <button type="button" onClick={redo} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Redo (Ctrl+Shift+Z)">↪️</button>
              <button type="button" onClick={() => setShowHelp(true)} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Help">?</button>
            </div>

            <span className="w-px h-6 bg-gray-300"></span>

            <button type="button" onClick={() => setIsPreview(!isPreview)} className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100">
              {isPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>

          {showHelp && <HelpContent />}
        </>
      )}

      <div className="flex-1 overflow-auto">
        {isPreview ? (
          <div className="p-4 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const inline = (props as any).inline;
                  if (!inline && match && match[1] === 'mermaid') {
                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
                a({ href, children }) {
                  if (!href) return <a>{children}</a>;
                  const embedUrl = getVideoEmbedUrl(href);
                  if (embedUrl) {
                    // Google Drive - use iframe with /preview
                    if (embedUrl.includes('drive.google.com') && embedUrl.includes('/preview')) {
                      return (
                        <iframe
                          src={embedUrl}
                          title="Google Drive video"
                          frameBorder="0"
                          allow="autoplay"
                          allowFullScreen
                          style={{ width: '100%', aspectRatio: '16/9', maxWidth: '100%' }}
                        />
                      );
                    }
                    // YouTube/Vimeo iframe
                    if (embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com')) {
                      return (
                        <iframe
                          src={embedUrl}
                          title="Embedded video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: '100%', aspectRatio: '16/9', maxWidth: '100%' }}
                        />
                      );
                    }
                    // Direct video file - use <video> tag
                    if (/\.(mp4|webm|ogg|mov|avi|wmv|flv)(\?.*)?$/i.test(href)) {
                      return (
                        <video controls style={{ width: '100%', maxHeight: '500px' }}>
                          <source src={href} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      );
                    }
                    // Fallback: just render as a link
                  }
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {children}
                    </a>
                  );
                },
                img({ src, alt }) {
                  if (!src) return null;
                  return <img src={src} alt={alt || 'Image'} className="max-w-full h-auto" />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm"
            placeholder="Write your guide content in Markdown..."
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}