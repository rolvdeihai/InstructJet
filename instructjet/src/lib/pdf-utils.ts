import { PDFDocument, StandardFonts } from 'pdf-lib';
import { rgb } from 'pdf-lib';

// Strip common markdown syntax for plain text rendering in PDF
function stripMarkdown(text: string): string {
  if (!text) return '';
  let result = text;
  
  // Remove images ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  // Remove links [text](url) -> text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove bold/italic markers **, __, *, _
  result = result.replace(/(\*\*|__)(.*?)\1/g, '$2');
  result = result.replace(/(\*|_)(.*?)\1/g, '$2');
  // Remove inline code `code`
  result = result.replace(/`([^`]+)`/g, '$1');
  // Remove headers #
  result = result.replace(/^#{1,6}\s+/gm, '');
  // Convert unordered list items * or - to bullet points
  result = result.replace(/^[\*\-]\s+/gm, '• ');
  // Convert ordered list items 1. to "1. " (keep but ensure space)
  result = result.replace(/^\d+\.\s+/gm, (match) => match);
  // Remove horizontal rules ---
  result = result.replace(/^[-*_]{3,}\s*$/gm, '');
  // Remove blockquote >
  result = result.replace(/^>\s+/gm, '');
  // Remove extra newlines
  result = result.replace(/\n{3,}/g, '\n\n');
  
  return result.trim();
}

function sanitizeText(text: string): string {
  // Also strip markdown for safety
  return stripMarkdown(text.replace(/[\u{1F300}-\u{1FAFF}]/gu, ''));
}

function wrapTextIntoLines(
  font: any,
  text: string,
  fontSize: number,
  maxWidth: number,
  lineHeightMultiplier = 1.2
): { lines: string[]; lineHeight: number } {
  const paragraphs = String(text || '').split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = sanitizeText(
        currentLine ? `${currentLine} ${word}` : word
      );
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    // Preserve blank line between paragraphs
    if (!para.trim()) {
      lines.push('');
    }
  }

  return {
    lines,
    lineHeight: fontSize * lineHeightMultiplier,
  };
}

export async function createSubmissionPdfBlob(
  submission: {
    guideTitle: string;
    workerName: string | null;
    submissionDate: string;
    status: string;
    score: number | null;
    comment: string | null;
  },
  options?: {
    titleFontSize?: number;
    bodyFontSize?: number;
    margin?: number;
    lineHeightMultiplier?: number;
  }
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage();
  const { width, height } = currentPage.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleFontSize = options?.titleFontSize || 16;
  const bodyFontSize = options?.bodyFontSize || 11;
  const margin = options?.margin || 50;
  const lineHeightMultiplier = options?.lineHeightMultiplier || 1.2;

  let y = height - margin;

  // Title
  currentPage.drawText('Submission Report', {
    x: margin,
    y,
    size: titleFontSize,
    font,
  });
  y -= titleFontSize * 1.8;

  // Metadata lines (sanitized)
  const sanitizedGuideTitle = sanitizeText(submission.guideTitle);
  const sanitizedWorkerName = sanitizeText(submission.workerName || 'Anonymous');
  const sanitizedStatus = sanitizeText(submission.status);
  
  const metaLines = [
    `Guide: ${sanitizedGuideTitle}`,
    `Worker: ${sanitizedWorkerName}`,
    `Submitted: ${submission.submissionDate}`,
    `Status: ${sanitizedStatus}`,
    `Score: ${submission.score !== null ? `${submission.score}/100` : 'N/A'}`,
    '',
    'Comment:',
  ];

  const maxWidth = width - margin * 2;
  const { lines: metaWrapped, lineHeight } = wrapTextIntoLines(
    font,
    metaLines.join('\n'),
    bodyFontSize,
    maxWidth,
    lineHeightMultiplier
  );

  for (const line of metaWrapped) {
    if (y < margin) {
      currentPage = pdfDoc.addPage();
      y = currentPage.getSize().height - margin;
    }
    currentPage.drawText(line || ' ', {
      x: margin,
      y,
      size: bodyFontSize,
      font,
    });
    y -= lineHeight;
  }

  // Comment body (stripped of markdown)
  const rawComment = submission.comment || 'No comment provided.';
  const strippedComment = sanitizeText(rawComment); // sanitizeText now calls stripMarkdown
  const { lines: commentLines, lineHeight: commentLineHeight } = wrapTextIntoLines(
    font,
    strippedComment,
    bodyFontSize,
    maxWidth,
    lineHeightMultiplier
  );

  for (const line of commentLines) {
    if (y < margin) {
      currentPage = pdfDoc.addPage();
      y = currentPage.getSize().height - margin;
    }
    currentPage.drawText(line || ' ', {
      x: margin + 10, // slight indent for comment
      y,
      size: bodyFontSize,
      font,
    });
    y -= commentLineHeight;
  }

  // Footer
  const footerY = margin - 10;
  if (footerY > 10) {
    currentPage.drawText('Generated automatically', {
      x: margin,
      y: footerY,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
}

export async function downloadSubmissionPdf(
  submission: Parameters<typeof createSubmissionPdfBlob>[0],
  fileName: string
) {
  const blob = await createSubmissionPdfBlob(submission);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}