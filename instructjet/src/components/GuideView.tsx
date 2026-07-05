'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidDiagram from './MermaidDiagram';

export default function GuideView({ content }: { content: string }) {
  // ─── Video URL detection (same as GuidePreview) ─────────────────────
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

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}   // enables raw HTML (colors, highlights, etc.)
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
  );
}