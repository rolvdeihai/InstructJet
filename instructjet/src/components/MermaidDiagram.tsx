// src/components/MermaidDiagram.tsx
'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  flowchart: { useMaxWidth: true, htmlLabels: true },
});

/**
 * Safely escapes node labels that contain special characters.
 * Converts id[text with ( ) / \ etc.] → id["text with ( ) / \ etc."]
 */
function sanitizeMermaid(chart: string): string {
  // Match node definitions: any identifier followed by [label]
  // But avoid matching subgraph definitions or other bracket uses.
  // This regex captures the part before '[' (the node id) and the label content.
  return chart.replace(/(\w+)\[([^\]]+)\]/g, (match, id, label) => {
    // If label already wrapped in double quotes, keep as is
    if (label.startsWith('"') && label.endsWith('"')) return match;
    // Check for characters that confuse Mermaid when unquoted
    if (/[\(\)\/\\{}\[\]:;]/.test(label)) {
      // Escape any double quotes inside the label
      const escapedLabel = label.replace(/"/g, '\\"');
      return `${id}["${escapedLabel}"]`;
    }
    return match;
  });
}

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !chart) return;

    const renderDiagram = async () => {
      const safeChart = sanitizeMermaid(chart);
      try {
        const { svg } = await mermaid.mermaidAPI.render(
          `mermaid-${Date.now()}`,
          safeChart
        );
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err: any) {
        console.error('Mermaid error:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <pre class="text-red-500 p-2 bg-red-50 rounded">Failed to render diagram.
Error: ${err.message}

Sanitized input:
${safeChart}</pre>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return <div ref={containerRef} className="my-4 w-full min-h-[200px] overflow-auto" />;
}