import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { deductTokens, checkSufficientTokens } from '@/lib/token-manager';

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const FETCH_TIMEOUT_MS = 600_000; // 10 minutes
const COLAB_NOTEBOOK_URL = 'https://colab.research.google.com/drive/1MYZeH5mNCEd9bdO8bL2tCL9IRWtd62CG?usp=sharing';

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

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: message,
        context: fullContext,
        request_id: requestId,   // pass for cancellation
      }),
      signal: combinedSignal,
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        assistantMessage = getServerOfflineMessage();
      } else {
        throw new Error(`HF API error: ${response.status}`);
      }
    } else {
      const data = await response.json();
      assistantMessage = data.response;
      queuePosition = data.queue_position;
    }
  } catch (error: any) {
    console.error('Worker chat API error:', error);
    if (error.name === 'AbortError') {
      aborted = true;
      assistantMessage = '';
    } else if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      assistantMessage = getServerOfflineMessage();
    } else {
      assistantMessage = 'Sorry, I encountered an error. Please try again.';
    }
  }

  // If aborted, do not deduct tokens and return early
  if (aborted) {
    return NextResponse.json({ aborted: true, response: '' });
  }

  const isOffline = assistantMessage.includes('AI server is currently offline') || 
                    assistantMessage.includes('offline');

  // Deduct tokens and update budget only if not offline
  if (!isOffline) {
    // 5. Deduct tokens from creator's main balance
    const deduction = await deductTokens(creatorUserId, tokens, 'worker_chat', {
      guide_id: guideId,
      message_length: message.length,
      request_id: requestId,
    });
    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error }, { status: 500 });
    }

    // 6. Reduce guide's remaining budget (cap)
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
  });
}

function getServerOfflineMessage(): string {
  return `⚠️ **The AI server is currently offline.**  
To use the guide generator, you need to start the server first.  
🔗 [Start AI Server on Colab](${COLAB_NOTEBOOK_URL})`;
}