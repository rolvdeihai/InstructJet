// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkSufficientTokens, deductTokens } from '@/lib/token-manager';
import { getUserFromSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { triggerGitHubWorkflow } from '@/lib/ai-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { canUseDeepSeek, incrementDailyDeepSeekUsage } from '@/lib/daily-usage';

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const FETCH_TIMEOUT_MS = 600_000; // 10 minutes
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
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('instructjet_session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check token balance (1000 tokens per chat message)
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

  const userPlan = await getUserPlan(user.id);
  const isPremium = userPlan === 'premium';

  // Detect explicit guide request
  const isExplicitGuideRequest =
    message.trim().startsWith('@guide') ||
    /\b(create|make|generate)\s+a\s+guide\b/i.test(message);

  // ─── Decide whether to use DeepSeek ───────────────────────────
  let useDeepSeek = false;
  let remainingQuota = 0;

  if (isPremium) {
    useDeepSeek = true;
  } else {
    // Free user: check daily quota (not evaluation)
    const { allowed, remaining } = await canUseDeepSeek(user.id, false);
    useDeepSeek = allowed;
    remainingQuota = remaining;
  }

  const normalSystemInstruction = `You are InstructJet AI, an expert at creating task guides. 
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

  const fullContext = `${normalSystemInstruction}\n\nConversation history:\n${context || ''}\n\nUser: ${message}\nAssistant:`;

  const abortSignal = req.signal;
  const timeoutSignal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const combinedSignal = AbortSignal.any([abortSignal, timeoutSignal]);

  let assistantMessage: string;
  let queuePosition: number | undefined;
  let aborted = false;
  let serverStarting = false;
  let errorOccurred = false;
  let fallbackSucceeded = false;

  try {
    if (useDeepSeek) {
      // ─── DEEPSEEK PATH ──────────────────────────────────────────

      if (isExplicitGuideRequest) {
        // Generate full guide in one DeepSeek call
        const cleanedMessage = message.replace(/^@guide\s*/i, '').trim();

        const deepseekMessages = [
          {
            role: 'system',
            content: `You are a guide generator. Output ONLY a valid JSON object with exactly these keys: "Overview", "Prerequisites", "Step-by-Step Instructions", "Tools & Assets", "Flow". Each value is a string containing the section content in markdown. The Flow section MUST include a Mermaid flowchart inside a \`\`\`mermaid code block. Do not add any extra text, explanations, or markdown outside the JSON.`,
          },
          {
            role: 'user',
            content: `Generate a guide for: ${cleanedMessage || 'the following task'}\n\nContext: ${context || 'No additional context'}`,
          },
        ];

        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
          },
          body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: deepseekMessages,
            temperature: 0.2,
            max_tokens: 2000,
          }),
          signal: combinedSignal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('DeepSeek API error:', response.status, errorText);
          throw new Error(`DeepSeek API error: ${response.status}`);
        }

        const data = await response.json();
        let rawContent = data.choices[0]?.message?.content || '{}';

        // Parse JSON
        let sectionsJson: Record<string, string> = {};
        try {
          const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            sectionsJson = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON object found');
          }
        } catch (e) {
          console.error('Failed to parse DeepSeek JSON', e);
          // Fallback sections
          sectionsJson = {
            Overview: 'Failed to generate overview.',
            Prerequisites: 'Failed to generate prerequisites.',
            'Step-by-Step Instructions': 'Failed to generate steps.',
            'Tools & Assets': 'Failed to generate tools.',
            Flow: '```mermaid\ngraph TD\nA[Error] --> B[Try again]\n```',
          };
        }

        // Build full markdown guide from JSON
        const fullGuide = Object.entries(sectionsJson)
          .map(([title, content]) => `## ${title}\n\n${content}`)
          .join('\n\n');

        assistantMessage = JSON.stringify({
          action: 'complete_guide',
          content: fullGuide,
          sections: sectionsJson,
        });
        queuePosition = 0;

        // ✅ Increment daily usage for free users
        if (!isPremium) {
          await incrementDailyDeepSeekUsage(user.id);
        }
      } else {
        // Normal conversation
        const deepseekMessages = [
          { role: 'system', content: normalSystemInstruction },
          { role: 'user', content: `Conversation history:\n${context || ''}\n\nUser: ${message}` },
        ];

        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
          },
          body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: deepseekMessages,
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

        // ✅ Increment daily usage for free users
        if (!isPremium) {
          await incrementDailyDeepSeekUsage(user.id);
        }
      }
    } else {
      // ─── FALLBACK: LOCAL HF API (Free users beyond quota) ──────

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
    console.error('Chat API error:', error);

    if (error.name === 'AbortError') {
      aborted = true;
      assistantMessage = '';
    } else if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      // If DeepSeek failed, try HF fallback (only if we were using DeepSeek)
      if (useDeepSeek) {
        try {
          const fallbackResponse = await fetch(HF_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: message,
              context: fullContext,
              request_id: requestId,
            }),
            signal: combinedSignal,
          });
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            assistantMessage = data.response;
            queuePosition = data.queue_position;
            // fallback succeeded – mark it so we don't set error flags
            fallbackSucceeded = true;
          } else {
            // fallback request returned error
            throw new Error('HF fallback failed');
          }
        } catch (fallbackError) {
          console.error('Fallback to HF also failed:', fallbackError);
          // fallback failed – set error
          errorOccurred = true;
          assistantMessage = 'Sorry, DeepSeek is currently unavailable and fallback also failed. Please try again later.';
        }
      } else {
        // HF failed for free user (original request was HF)
        if (!isPremium) {
          await triggerGitHubWorkflow();
          serverStarting = true;
          assistantMessage = getServerStartingMessage();
        } else {
          errorOccurred = true;
          assistantMessage = 'Sorry, the AI service is currently unavailable. Please try again later.';
        }
      }
    } else {
      errorOccurred = true;
      assistantMessage = 'Sorry, an unexpected error occurred. Please try again.';
    }
  }

  if (aborted) {
    return NextResponse.json({ aborted: true, response: '' });
  }

  // Deduct tokens only if response is valid (not aborted, not error, not server starting, not fallback that succeeded)
  const shouldDeduct = !aborted && !errorOccurred && !serverStarting && !fallbackSucceeded && !assistantMessage.includes('waking up');

  if (shouldDeduct) {
    await deductTokens(user.id, 1000, 'guide_chat', {
      message_length: message.length,
      had_error: false,
    });
  }

  return NextResponse.json({
    response: assistantMessage,
    queue_position: queuePosition,
    request_id: requestId,
    server_starting: serverStarting,
    daily_quota_remaining: !isPremium ? remainingQuota : undefined,
  });
}

function getServerStartingMessage(): string {
  return `🚀 **The AI server is waking up.**  
We have started the server. It usually takes 2–3 minutes to become ready.  
Please wait a moment and then try again.  
(No tokens were deducted for this attempt.)`;
}