// src/app/api/worker-chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { deductTokens, checkSufficientTokens } from '@/lib/token-manager';
import { triggerGitHubWorkflow } from '@/lib/ai-server';

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const FETCH_TIMEOUT_MS = 600_000;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

async function getUserPlan(userId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('users')
    .select('plan_tier')
    .eq('id', userId)
    .single();
  return data?.plan_tier || 'free';
}

export async function POST(req: NextRequest) {
  const { message, guideContent, context, guideId, tokens = 1000, requestId } = await req.json();

  if (!guideId) {
    return NextResponse.json({ error: 'guideId is required' }, { status: 400 });
  }
  if (!requestId) {
    return NextResponse.json({ error: 'requestId is required for cancellation' }, { status: 400 });
  }
  if (tokens <= 0 || isNaN(tokens)) {
    return NextResponse.json({ error: 'Invalid token amount' }, { status: 400 });
  }

  // 1. Get the guide and its remaining budget (cap)
  const { data: guide, error: guideError } = await supabaseAdmin
    .from('guides')
    .select('user_id, token_budget_remaining')
    .eq('id', guideId)
    .single();

  if (guideError || !guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  const creatorUserId = guide.user_id;
  const budgetRemaining = guide.token_budget_remaining || 0;

  // 2. Check guide budget cap
  if (budgetRemaining < tokens) {
    return NextResponse.json(
      { error: `Guide budget exhausted. Remaining: ${budgetRemaining}, Required: ${tokens}. Ask creator to increase the budget limit.` },
      { status: 402 }
    );
  }

  // 3. Check creator's main token balance
  const hasTokens = await checkSufficientTokens(creatorUserId, tokens);
  if (!hasTokens) {
    return NextResponse.json(
      { error: 'Guide creator has insufficient tokens in their account.' },
      { status: 402 }
    );
  }

  // 4. Prepare AI call with abort support
  const systemPrompt = `You are a helpful assistant that answers questions about a task guide. The guide is about: ${guideContent}. 
Answer the worker's question clearly and concisely. Use the conversation history if relevant.`;

  const fullContext = `${systemPrompt}\n\nConversation history:\n${context || ''}\n\nWorker: ${message}\nAssistant:`;

  const abortSignal = req.signal;
  const timeoutSignal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const combinedSignal = AbortSignal.any([abortSignal, timeoutSignal]);

  let assistantMessage: string;
  let queuePosition: number | undefined;
  let aborted = false;
  let serverStarting = false;
  let errorOccurred = false;

  // Check if the creator (guide owner) is premium
  const userPlan = await getUserPlan(creatorUserId);
  const isPremium = userPlan === 'premium';

  try {
    if (isPremium) {
      // --- DeepSeek API call ---
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Conversation history:\n${context || ''}\n\nWorker: ${message}` }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal: combinedSignal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      assistantMessage = data.choices[0]?.message?.content || 'Sorry, DeepSeek returned an empty response.';
      queuePosition = 0;
    } else {
      // --- Local HF API call (free users) ---
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: message,
          context: fullContext,
          request_id: requestId,
        }),
        signal: combinedSignal,
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 502 || response.status === 503) {
          await triggerGitHubWorkflow();
          serverStarting = true;
          assistantMessage = getServerStartingMessage();
        } else {
          throw new Error(`HF API error: ${response.status}`);
        }
      } else {
        const data = await response.json();
        assistantMessage = data.response;
        queuePosition = data.queue_position;
      }
    }
  } catch (error: any) {
    console.error('Worker chat API error:', error);
    if (error.name === 'AbortError') {
      aborted = true;
      assistantMessage = '';
    } else if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      if (!isPremium) {
        await triggerGitHubWorkflow();
        serverStarting = true;
        assistantMessage = getServerStartingMessage();
      } else {
        errorOccurred = true;
        assistantMessage = 'Sorry, DeepSeek is currently unavailable. Please try again later.';
      }
    } else {
      errorOccurred = true;
      assistantMessage = 'Sorry, I encountered an error. Please try again.';
    }
  }

  if (aborted) {
    return NextResponse.json({ aborted: true, response: '' });
  }

  // Deduct tokens ONLY if server responded normally (not starting, not error)
  if (!aborted && !errorOccurred && !serverStarting && !assistantMessage.includes('waking up')) {
    const deduction = await deductTokens(creatorUserId, tokens, 'worker_chat', {
      guide_id: guideId,
      message_length: message.length,
      request_id: requestId,
    });
    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error }, { status: 500 });
    }

    const newBudgetRemaining = budgetRemaining - tokens;
    const { error: updateBudgetError } = await supabaseAdmin
      .from('guides')
      .update({
        token_budget_remaining: newBudgetRemaining,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guideId);

    if (updateBudgetError) {
      console.error('Failed to update guide budget cap:', updateBudgetError);
    }
  }

  return NextResponse.json({
    response: assistantMessage,
    queue_position: queuePosition,
    request_id: requestId,
    server_starting: serverStarting,
  });
}

function getServerStartingMessage(): string {
  return `🚀 **The AI server is waking up.**  
We have started the server. It usually takes 2–3 minutes to become ready.  
Please wait a moment and then try again.  
(No tokens were deducted for this attempt.)`;
}