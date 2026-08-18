// app/api/analyze-media/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { jsonrepair } from 'jsonrepair';
import { getCurrentUser } from '@/lib/session';
import path from 'path';
import mammoth from 'mammoth';

// ─── Constants ──────────────────────────────────────────────────────────────
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const FETCH_TIMEOUT_MS = 120000;

// ─── Main POST handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      mediaId,          // single (backward compatibility)
      mediaIds,         // array (new)
      fileUrl,          // single
      fileUrls,         // array
      imageBase64,
      fileType,
      fileTypes,
      fileName,
      fileNames,
      guideId,
      updateDB = true,
      userMessage = '',
    } = body;

    // ─── Normalize input: determine if we have multiple files ──────────
    const isMulti = Array.isArray(mediaIds) || Array.isArray(fileUrls);
    const ids = isMulti ? (mediaIds || []) : (mediaId ? [mediaId] : []);
    const urls = isMulti ? (fileUrls || []) : (fileUrl ? [fileUrl] : []);
    const types = isMulti ? (fileTypes || []) : (fileType ? [fileType] : []);
    const names = isMulti ? (fileNames || []) : (fileName ? [fileName] : []);

    console.log('[analyze-media] Received:', { isMulti, ids, urls, guideId, updateDB });

    // ─── If we have a single base64 (guide creation), handle separately ──
    if (imageBase64 && !isMulti) {
      // ... existing base64 handling (we keep it for backward compatibility)
      return await handleBase64(imageBase64, fileType, fileName, guideId, user, userMessage);
    }

    // ─── Validate that we have at least one file ──────────────────────
    if (ids.length === 0 && urls.length === 0) {
      return NextResponse.json({ error: 'At least one mediaId or fileUrl is required' }, { status: 400 });
    }

    // ─── If using mediaIds, fetch their file_urls from DB ─────────────
    let finalUrls = [...urls];
    let finalNames = [...names];
    let finalTypes = [...types];

    if (ids.length > 0) {
      // Fetch file_url and file_type from DB for each mediaId
      const { data: mediaRows, error: mediaError } = await supabaseAdmin
        .from('media_uploads')
        .select('id, file_url, file_type')
        .in('id', ids);

      if (mediaError) {
        console.error('[analyze-media] Error fetching media:', mediaError);
        return NextResponse.json({ error: 'Failed to fetch media records' }, { status: 500 });
      }

      // Map the results
      const mediaMap = new Map(mediaRows.map(row => [row.id, row]));
      // Reconstruct the arrays in the same order as ids
      finalUrls = ids.map((id: string) => mediaMap.get(id)?.file_url).filter(Boolean) as string[];
      finalTypes = ids.map((id: string) => mediaMap.get(id)?.file_type || 'other');
      // If names not provided, use URL file name
      if (finalNames.length === 0) {
        finalNames = finalUrls.map((url: string) => {
          const parts = url.split('/');
          return parts[parts.length - 1] || 'file';
        });
      }
    }

    // ─── Ensure we have all arrays same length ───────────────────────
    const count = finalUrls.length;
    if (count === 0) {
      return NextResponse.json({ error: 'No valid files to analyze' }, { status: 400 });
    }

    // ─── Download and extract text from each file ─────────────────────
    const extractedTexts: string[] = [];
    const fileNamesForContext: string[] = [];

    for (let i = 0; i < count; i++) {
      const url = finalUrls[i];
      const type = finalTypes[i] || 'other';
      const name = finalNames[i] || `file_${i+1}`;

      try {
        console.log(`[analyze-media] Processing file ${i+1}/${count}: ${name}`);
        const accessibleUrl = await getAccessibleUrl(url);
        const response = await fetch(accessibleUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let text = '';
        const isImage = type === 'image' || type.startsWith('image/');
        if (isImage) {
          text = await performOCRFromBuffer(buffer);
        } else {
          const contentType = response.headers.get('content-type') || type;
          text = await extractTextFromBuffer(buffer, contentType, name);
        }

        extractedTexts.push(text || '[No text extracted]');
        fileNamesForContext.push(name);
      } catch (err: any) {
        console.error(`[analyze-media] Error processing ${name}:`, err);
        extractedTexts.push(`[Error: ${err.message || 'Failed to process file'}]`);
        fileNamesForContext.push(name);
      }
    }

    // ─── Combine extracted texts into a single context ──────────────
    let combinedText = '';
    for (let i = 0; i < extractedTexts.length; i++) {
      combinedText += `\n\n### File ${i+1}: ${fileNamesForContext[i]}\n${extractedTexts[i]}`;
    }

    // ─── Fetch guide context ──────────────────────────────────────────
    let guideTitle = 'Task Guide';
    let guideContent = '';
    let hasGuide = false;
    if (guideId) {
      const { data: guide, error: guideError } = await supabaseAdmin
        .from('guides')
        .select('title, content')
        .eq('id', guideId)
        .single();
      if (!guideError && guide) {
        guideTitle = guide.title;
        guideContent = guide.content;
        hasGuide = true;
      }
    }

    // ─── AI evaluation (always DeepSeek) ──────────────────────────────
    const evaluation = await evaluateSubmissionWithDeepSeek(
      guideTitle,
      guideContent,
      combinedText,
      userMessage,
      hasGuide,
      fileNamesForContext.length
    );

    // ─── Update all media rows with the SAME evaluation ──────────────
    if (updateDB && ids.length > 0) {
      console.log(`[analyze-media] Updating ${ids.length} media rows with evaluation`);

      const updateData = {
        ai_score: { score: evaluation.score, raw: evaluation },
        ai_comment: evaluation.comment,
        approval_status: guideId ? 'pending' : null,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabaseAdmin
        .from('media_uploads')
        .update(updateData)
        .in('id', ids);

      if (updateError) {
        console.error('[analyze-media] Update error:', updateError);
      } else {
        console.log('[analyze-media] Update successful for all media');
      }
    }

    return NextResponse.json({
      feedback: evaluation.comment,
      score: evaluation.score,
      files_processed: count,
      ocrText: combinedText,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}

// ─── Helper: handle base64 (single file, guide creation) ──────────────────
async function handleBase64(
  imageBase64: string,
  fileType: string,
  fileName: string,
  guideId: string,
  user: any,
  userMessage: string
) {
  try {
    const base64Data = imageBase64.split(',')[1];
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid base64 data' }, { status: 400 });
    }
    const buffer = Buffer.from(base64Data, 'base64');
    const isImage = fileType?.startsWith('image/') || fileType === 'image';
    let extractedText = '';
    if (isImage) {
      extractedText = await performOCRFromBuffer(buffer);
    } else {
      const guessedType = fileType || 'application/octet-stream';
      extractedText = await extractTextFromBuffer(buffer, guessedType, fileName || 'file');
    }

    let guideTitle = 'Task Guide';
    let guideContent = '';
    let hasGuide = false;
    if (guideId) {
      const { data: guide, error: guideError } = await supabaseAdmin
        .from('guides')
        .select('title, content')
        .eq('id', guideId)
        .single();
      if (!guideError && guide) {
        guideTitle = guide.title;
        guideContent = guide.content;
        hasGuide = true;
      }
    }

    const evaluation = await evaluateSubmissionWithDeepSeek(
      guideTitle,
      guideContent,
      extractedText,
      userMessage,
      hasGuide,
      1
    );

    return NextResponse.json({
      feedback: evaluation.comment,
      score: evaluation.score,
      ocrText: extractedText,
    });
  } catch (error: any) {
    console.error('Base64 analysis error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}

// ─── Helper: get accessible URL ────────────────────────────────────────────
async function getAccessibleUrl(url: string): Promise<string> {
  if (url.includes('/storage/v1/object/public/')) return url;
  const match = url.match(/\/storage\/v1\/object\/(?:authenticated\/)?([^\/]+)\/(.+)/);
  if (match) {
    const bucket = match[1];
    const filePath = match[2];
    const { data } = await supabaseAdmin.storage.from(bucket).createSignedUrl(filePath, 60);
    if (data?.signedUrl) return data.signedUrl;
  }
  return url;
}

// ─── OCR from buffer ──────────────────────────────────────────────────────
async function performOCRFromBuffer(buffer: Buffer): Promise<string> {
  console.log('🔍 OCR from buffer');
  const workerPath = path.resolve(
    process.cwd(),
    'node_modules/tesseract.js/src/worker-script/node/index.js'
  );
  let worker;
  try {
    worker = await createWorker('eng', 1, { workerPath });
    const { data: { text } } = await worker.recognize(buffer);
    console.log(`✅ OCR extracted ${text.length} characters`);
    return text.trim();
  } catch (err) {
    console.error('OCR error:', err);
    return '';
  } finally {
    if (worker) await worker.terminate();
  }
}

// ─── Document text extraction ──────────────────────────────────────────────
async function extractTextFromBuffer(buffer: Buffer, mimeType: string, fileIdentifier: string): Promise<string> {
  let type = mimeType;

  // Infer MIME type from file extension if generic
  if (!type || type === 'application/octet-stream' || type === 'document' || type === 'other') {
    const ext = fileIdentifier.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') type = 'application/pdf';
    else if (ext === 'docx') type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === 'doc') type = 'application/msword';
    else if (ext === 'txt') type = 'text/plain';
    else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') type = 'image';
  }

  console.log(`[extractText] Processing ${fileIdentifier} with type: ${type}`);

  try {
    // ─── PDF ──────────────────────────────────────────────────────
    if (type === 'application/pdf') {
      try {
        // Try dynamic import with proper error handling
        const pdfParse = await import('pdf-parse');
        // pdf-parse exports a default function, but sometimes it's nested
        const parseFn = (pdfParse as any).default || pdfParse;
        if (typeof parseFn !== 'function') {
          throw new Error('pdf-parse did not return a function');
        }
        const data = await parseFn(buffer);
        const text = data?.text || '';
        return text.trim() || '[PDF was empty or had no extractable text]';
      } catch (pdfError: any) {
        console.error('[extractText] PDF parsing error:', pdfError);
        // Fallback: try to extract text using a simpler approach
        try {
          // Some PDFs can be read as text if they're not binary
          const text = buffer.toString('utf-8');
          if (text.length > 100) {
            return text.slice(0, 10000) + '\n\n[Note: Partial text extraction using fallback]';
          }
        } catch (_) {}
        return `[Error parsing PDF: ${pdfError.message || 'unknown error'}]`;
      }
    }

    // ─── DOCX ──────────────────────────────────────────────────────
    else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        // Dynamic import for mammoth
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '[No text found in DOCX]';
      } catch (docxError: any) {
        console.error('[extractText] DOCX parsing error:', docxError);
        return `[Error parsing DOCX: ${docxError.message || 'unknown error'}]`;
      }
    }

    // ─── DOC (older Word) ──────────────────────────────────────────
    else if (type === 'application/msword') {
      try {
        const text = buffer.toString('utf-8');
        if (text.length > 100) {
          return text.slice(0, 10000);
        }
        return '[No readable text in .doc file]';
      } catch (_) {
        return '[.doc files are not fully supported. Please upload .docx or PDF.]';
      }
    }

    // ─── Plain text ──────────────────────────────────────────────
    else if (type === 'text/plain') {
      try {
        const text = buffer.toString('utf-8');
        return text.slice(0, 10000);
      } catch (_) {
        return '[Could not read text file]';
      }
    }

    // ─── Unsupported type ────────────────────────────────────────
    else {
      // Try to read as text anyway
      try {
        const text = buffer.toString('utf-8');
        if (text.length > 100) {
          return text.slice(0, 10000);
        }
        return `[Unsupported document type: ${type || 'unknown'}]`;
      } catch (_) {
        return `[Unsupported document type: ${type || 'unknown'}]`;
      }
    }
  } catch (error: any) {
    console.error('[extractText] Unexpected error:', error);
    return `[Error extracting text: ${error.message || 'unknown'}]`;
  }
}

// ─── AI Evaluation using DeepSeek ──────────────────────────────────────────
async function evaluateSubmissionWithDeepSeek(
  title: string,
  instructions: string,
  extractedText: string,
  userQuestion: string,
  hasGuide: boolean,
  fileCount: number
): Promise<{ score: number; comment: string }> {
  let systemPrompt = `You are an AI that analyzes images and documents.`;
  let userMessage = `Extracted text from ${fileCount} file(s):\n${extractedText || '[No text extracted]'}`;

  if (hasGuide && instructions) {
    systemPrompt = `You are an AI that **evaluates** how well a worker followed a set of task instructions.
You will receive text extracted from one or more files submitted by the worker.
Your evaluation must be structured and include the following sections:
1. ✅ **What was done correctly** – highlight what the worker did right.
2. ❌ **Mistakes and errors** – point out specific errors, omissions, or incorrect steps.
3. 💡 **Possible improvements** – suggest concrete ways to improve the submission.
4. 📝 **Misunderstandings** – identify any misinterpretations of the instructions.
5. 🎯 **Overall score** – a numeric score from 0 to 100 based on accuracy, completeness, and adherence to the instructions.

Be **constructive and specific**. Use bullet points where appropriate. Do not be overly harsh, but do not sugarcoat. Provide actionable feedback that helps the worker improve.

Output ONLY valid JSON with the following structure:
{
  "score": <integer 0-100>,
  "comment": "<your detailed evaluation with all sections>"
}`;

    userMessage = `Task Title: ${title}\nTask Instructions:\n${instructions}\n\nWorker Submission Text (${fileCount} file(s)):\n${extractedText || '[No text extracted]'}`;
  } else {
    systemPrompt = `You are an AI that analyzes images or documents and provides **helpful, constructive feedback**.
Consider the extracted text and the user's question if provided.
Provide a clear, concise analysis and, if possible, a qualitative score (0-100) indicating relevance or clarity.
If it's a general document, highlight strengths, weaknesses, and suggestions for improvement.

Output ONLY valid JSON: {"score": integer 0-100, "comment": "string"}`;

    userMessage = `Analyze the following extracted text from ${fileCount} file(s):\n${extractedText || '[No text extracted]'}`;
  }

  if (userQuestion) {
    userMessage += `\n\nUser's question: ${userQuestion}`;
  }

  const deepseekMessages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  console.log('🚀 Calling DeepSeek for evaluation (multiple files)...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: deepseekMessages,
        temperature: 0.3,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content || '';

    console.log('🤖 Raw DeepSeek response length:', aiResponse.length);

    // Extract JSON from response
    let cleanResponse = aiResponse.trim();
    const codeBlockMatch = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      cleanResponse = codeBlockMatch[1].trim();
    }

    let parsed = null;
    try {
      parsed = JSON.parse(cleanResponse);
    } catch (e) {
      try {
        const repaired = jsonrepair(cleanResponse);
        parsed = JSON.parse(repaired);
      } catch (e2) {
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const repairedMatch = jsonrepair(jsonMatch[0]);
            parsed = JSON.parse(repairedMatch);
          } catch (e3) {}
        }
      }
    }

    if (parsed && typeof parsed.score === 'number' && typeof parsed.comment === 'string') {
      const score = Math.min(100, Math.max(0, parsed.score));
      const comment = parsed.comment;
      return { score, comment };
    }

    console.warn('No valid JSON found in DeepSeek response');
    return { score: 50, comment: 'The AI could not evaluate your submission properly. Please try again.' };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('DeepSeek evaluation error:', error);
    return { score: 0, comment: 'Evaluation failed due to AI service error. Please try again later.' };
  }
}