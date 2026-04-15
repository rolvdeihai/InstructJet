// src/app/api/analyze-media/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { jsonrepair } from 'jsonrepair';
import path from 'path';

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const FETCH_TIMEOUT_MS = 120000;

export async function POST(req: NextRequest) {
  try {
    const { mediaId, fileUrl, fileType, guideId, updateDB = true, userMessage = '' } = await req.json();

    if (!fileUrl || !guideId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch guide content
    const { data: guide, error: guideError } = await supabaseAdmin
      .from('guides')
      .select('title, content')
      .eq('id', guideId)
      .single();

    if (guideError || !guide) {
      console.error('Guide fetch error:', guideError);
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // 2. Get an accessible image URL (handle private buckets)
    let accessibleImageUrl = await getAccessibleUrl(fileUrl);

    // 3. OCR for images
    let extractedText = '';
    if (fileType === 'image') {
      extractedText = await performOCR(accessibleImageUrl);
      console.log('📝 OCR Extracted Text length:', extractedText.length);
      console.log('📝 OCR Preview:', extractedText.substring(0, 300));
    } else {
      extractedText = '[Video file – OCR not available]';
    }

    // 4. AI evaluation – using neutral language to avoid guide‑creation trigger
    const evaluation = await evaluateSubmission(guide.title, guide.content, extractedText, userMessage);
    console.log('🤖 AI Evaluation result:', evaluation);

    // 5. Update database if needed
    if (updateDB && mediaId) {
      await supabaseAdmin
        .from('media_uploads')
        .update({
          ai_score: { score: evaluation.score, raw: evaluation },
          ai_comment: evaluation.comment,
          approval_status: 'pending',
        })
        .eq('id', mediaId);
    }

    return NextResponse.json({ 
      feedback: evaluation.comment, 
      score: evaluation.score,
      ocrText: extractedText 
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}

// Helper: get a publicly accessible URL (signed if private)
async function getAccessibleUrl(url: string): Promise<string> {
  // If it's already a public Supabase URL, return as is
  if (url.includes('/storage/v1/object/public/')) {
    console.log('Using public bucket URL');
    return url;
  }
  // Try to generate a signed URL for private buckets
  const match = url.match(/\/storage\/v1\/object\/(?:authenticated\/)?([^\/]+)\/(.+)/);
  if (match) {
    const bucket = match[1];
    const filePath = match[2];
    console.log(`Generating signed URL for bucket: ${bucket}, path: ${filePath}`);
    const { data } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, 60); // 60 seconds expiry
    if (data?.signedUrl) {
      console.log('Signed URL generated successfully');
      return data.signedUrl;
    }
  }
  console.warn('Could not generate signed URL, using original (may fail)');
  return url;
}

// OCR with detailed logging
async function performOCR(imageUrl: string): Promise<string> {
  console.log('🔍 Starting OCR for URL:', imageUrl);
  // Resolve worker path relative to the project root
  const workerPath = path.resolve(
    process.cwd(),
    'node_modules/tesseract.js/src/worker-script/node/index.js'
  );
  
  let worker;
  try {
    worker = await createWorker('eng', 1, { workerPath });
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Image fetch failed: ${response.status}`);
      return '';
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { data: { text } } = await worker.recognize(buffer);
    console.log(`✅ OCR extracted ${text.length} characters`);
    return text.trim();
  } catch (err: any) {
    console.error('OCR error:', err);
    return '';
  } finally {
    if (worker) await worker.terminate();
  }
}

// AI evaluation – carefully avoids words that trigger guide‑creation
async function evaluateSubmission(title: string, instructions: string, workerText: string, userQuestion: string = ''): Promise<{ score: number; comment: string }> {
  const systemPrompt = `You are an AI that evaluates how well a worker followed a set of task instructions.
You will receive:
- Task title and instructions
- Text extracted from the worker's submitted image (OCR)
- Optional: a specific question from the worker

If a question is provided, answer it directly and also give a score based on the image content.
Otherwise, provide a general evaluation.

Output ONLY valid JSON: {"score": integer 0-100, "comment": "string"}`;

  let userMessage = `Task Title: ${title}\nTask Instructions:\n${instructions}\n\nWorker Submission OCR Text:\n${workerText || '[No text extracted]'}`;
  if (userQuestion) {
    userMessage += `\n\nWorker's Question: ${userQuestion}`;
  }

  const fullPrompt = `${systemPrompt}\n\n${userMessage}\n\nYour JSON output:`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: fullPrompt, context: '' }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HF API error: ${response.status}`);

    const data = (await response.json()) as { response?: string };
    let aiResponse = data.response || '';
    console.log('🤖 Raw AI response length:', aiResponse.length);
    console.log('🤖 Raw AI response preview:', aiResponse.substring(0, 500));

    // Remove markdown code block fences if present
    let cleanResponse = aiResponse.trim();
    const codeBlockMatch = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      cleanResponse = codeBlockMatch[1].trim();
    }

    // Try to extract JSON object
    let parsed = null;
    try {
      parsed = JSON.parse(cleanResponse);
    } catch (e) {
      try {
        // Attempt to repair common JSON issues
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

    console.warn('No valid JSON found in AI response');
    return { score: 50, comment: 'The AI could not evaluate your submission properly. Please try again or contact support.' };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('AI evaluation error:', error);
    return { score: 0, comment: 'Evaluation failed due to AI service error.' };
  }
}