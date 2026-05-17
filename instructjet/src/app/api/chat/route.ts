// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { checkSufficientTokens, deductTokens } from '@/lib/token-manager';
import { getUserFromSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { triggerGitHubWorkflow } from '@/lib/ai-server'; // ✅ import

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const FETCH_TIMEOUT_MS = 600_000; // 10 minutes
const COLAB_NOTEBOOK_URL = 'https://colab.research.google.com/drive/1MYZeH5mNCEd9bdO8bL2tCL9IRWtd62CG?usp=sharing';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasTokens = await checkSufficientTokens(user.id, 1000);
  if (!hasTokens) {
    return NextResponse.json(
      { error: 'Insufficient tokens. Please purchase more tokens or upgrade your plan.' },
      { status: 402 }
    );
  }

  const { message, context, requestId } = await req.json();

  if (!requestId) {
    return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
  }

  const systemInstruction = `You are InstructJet AI, an expert at creating task guides. 
    Your job is to ask clarifying questions about the task: what needs to be done, who is the target worker, any common misunderstandings, required tools, etc. 
    After you have enough context (e.g., after 3-5 exchanges), output a JSON object with the following structure:
    {"action": "generate_guide", "summary": "A concise summary of the task based on the conversation so far.", "sections": ["Overview", "Prerequisites", "Step-by-Step Instructions", "Tools & Assets", "Flow"]}
    **Important for the Flow section**: When you later generate that section, it must contain a Mermaid flowchart diagram. Use \`\`\`mermaid ... \`\`\` syntax. Example:
    \`\`\`mermaid
    flowchart TD
      A[Start] --> B[Step 1]
      C -->|Yes| D[Step 2]
      C -->|No| E[Step 3]
      D --> F[End]
      E --> F
    \`\`\`
    If you still need more info, just respond naturally asking for clarification. Do not output the guide directly; only output JSON when ready.`;

  const fullContext = `${systemInstruction}\n\nConversation history:\n${context || ''}\n\nUser: ${message}\nAssistant:`;

  const abortSignal = req.signal;
  const timeoutSignal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const combinedSignal = AbortSignal.any([abortSignal, timeoutSignal]);

  let assistantMessage: string;
  let queuePosition: number | undefined;
  let aborted = false;
  let serverStarting = false;

  try {
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
        // Server offline – trigger GitHub workflow
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
  } catch (error: any) {
    console.error('Chat API error:', error);

    if (error.name === 'AbortError') {
      aborted = true;
      assistantMessage = '';
    } else if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      // Network error – server likely offline
      await triggerGitHubWorkflow();
      serverStarting = true;
      assistantMessage = getServerStartingMessage();
    } else {
      assistantMessage = 'Sorry, an unexpected error occurred. Please try again.';
    }
  }

  if (aborted) {
    return NextResponse.json({ aborted: true, response: '' });
  }

  // Do NOT deduct tokens if server is starting (or offline)
  if (!serverStarting && !assistantMessage.includes('AI server is currently offline')) {
    await deductTokens(user.id, 1000, 'guide_chat', {
      message_length: message.length,
      had_error: false,
    });
  }

  return NextResponse.json({
    response: assistantMessage,
    queue_position: queuePosition,
    request_id: requestId,
    server_starting: serverStarting, // optional frontend hint
  });
}

function getServerStartingMessage(): string {
  return `🚀 **The AI server is waking up.**  
We have started the server. It usually takes 2–3 minutes to become ready.  
Please wait a moment and then try again.  
(No tokens were deducted for this attempt.)`;
}