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

  const { message, context, requestId, guideContent, isRevision } = await req.json();
  if (!requestId) {
    return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
  }

  const userPlan = await getUserPlan(user.id);
  const isPremium = userPlan === 'premium';

  // Detect explicit guide request (full generation)
  const isExplicitGuideRequest = message.trim().startsWith('@guide');
  
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

  // ─── Base system instruction with guide context ──────────────
  const baseSystemInstruction = `You are InstructJet AI, an expert at creating and revising task guides.
The current guide content (in Markdown with ## section headers) is provided below. Use it to answer questions, suggest improvements, or make revisions.

Current guide content:
${guideContent || 'No guide has been generated yet.'}

Your job is to assist the user in creating or refining guides.
- For normal conversation, respond naturally with helpful text.
- If you still need more info, ask clarifying questions.
`;

  // ─── Revision system instruction ──────────────────────────────
  // The whole document goes to the model and the whole revised document comes
  // back, so revisions can touch any part of it (titles, structure, new or
  // removed sections, diagrams) rather than only predefined sections.
  const revisionSystemInstruction = `You are InstructJet AI, an expert guide editor.
You will receive a complete guide document in Markdown and a revision request.
Rewrite the document so that it fully applies the requested revisions.

Rules:
- Output the COMPLETE revised document, from the first line to the last, in Markdown.
- Keep every part the user did not ask to change exactly as it is (wording, images, links, tables, mermaid diagrams).
- You may add, remove, reorder or rename sections, headings and steps when the request calls for it.
- Keep Mermaid diagrams valid and inside \`\`\`mermaid code blocks.
- Do NOT add commentary, explanations or a preamble, and do NOT wrap the whole document in a code block.`;

  const revisionUserMessage = `Current guide document:
<<<DOCUMENT
${guideContent || ''}
DOCUMENT>>>

Revision request: ${message}

${context ? `Recent conversation (for context):\n${context}\n\n` : ''}Return the complete revised document now.`;

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

      // Case 1: Explicit guide generation (@guide or "create a guide")
      if (isExplicitGuideRequest) {
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

        // Increment daily usage for free users
        if (!isPremium) {
          await incrementDailyDeepSeekUsage(user.id);
        }
      }
      // Case 2: Revision request
      else if (isRevision) {
        if (!guideContent) {
          // No guide to revise – respond with a helpful message
          assistantMessage = "I don't see any guide to revise yet. Please generate a guide first using '@guide' or by asking me to create one.";
        } else {
          const deepseekMessages = [
            { role: 'system', content: revisionSystemInstruction },
            { role: 'user', content: revisionUserMessage },
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
              temperature: 0.3,
              max_tokens: 8000,
            }),
            signal: combinedSignal,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('DeepSeek API error:', response.status, errorText);
            throw new Error(`DeepSeek API error: ${response.status}`);
          }

          const data = await response.json();
          const revised = extractRevisedDocument(data.choices[0]?.message?.content || '');
          if (!revised) {
            errorOccurred = true;
            assistantMessage = 'Sorry, the AI did not return a revised guide. Please try rephrasing your revision.';
          } else {
            const truncated = data.choices[0]?.finish_reason === 'length';
            assistantMessage = JSON.stringify({
              type: 'revision',
              content: revised,
              summary: truncated
                ? '⚠️ The guide is very long and the revision may have been cut off at the end. Please review the last section.'
                : undefined,
            });
          }
          queuePosition = 0;

          // Increment daily usage for free users
          if (!isPremium) {
            await incrementDailyDeepSeekUsage(user.id);
          }
        }
      }
      // Case 3: Normal conversation
      else {
        const deepseekMessages = [
          { role: 'system', content: baseSystemInstruction },
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

        // Increment daily usage for free users
        if (!isPremium) {
          await incrementDailyDeepSeekUsage(user.id);
        }
      }
    } else {
      // ─── FALLBACK: LOCAL HF API (Free users beyond quota) ──────

      // For HF fallback, we do not support explicit revision JSON;
      // we treat everything as normal chat (but we still include guide content in the context).
      const fallbackContext = isRevision && guideContent
        ? `${revisionSystemInstruction}\n\n${revisionUserMessage}`
        : `${baseSystemInstruction}\n\nConversation history:\n${context || ''}\n\nUser: ${message}\nAssistant:`;

      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: message,
          context: fallbackContext,
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
        // Only treat the reply as a document if it actually looks like one.
        const revised = isRevision && guideContent ? extractRevisedDocument(assistantMessage || '') : null;
        if (revised && /^#{1,3}\s/m.test(revised)) {
          assistantMessage = JSON.stringify({ type: 'revision', content: revised });
        }
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
          const fallbackContext = `${baseSystemInstruction}\n\nConversation history:\n${context || ''}\n\nUser: ${message}\nAssistant:`;
          const fallbackResponse = await fetch(HF_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: message,
              context: fallbackContext,
              request_id: requestId,
            }),
            signal: combinedSignal,
          });
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            assistantMessage = data.response;
            queuePosition = data.queue_position;
            fallbackSucceeded = true;
          } else {
            throw new Error('HF fallback failed');
          }
        } catch (fallbackError) {
          console.error('Fallback to HF also failed:', fallbackError);
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

// Strips wrappers the model sometimes adds around a revised document
// (a ```markdown fence, or the <<<DOCUMENT markers echoed back).
function extractRevisedDocument(raw: string): string | null {
  let text = raw.trim();
  const fenced = text.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fenced) text = fenced[1].trim();
  text = text.replace(/^<<<DOCUMENT\s*/, '').replace(/\s*DOCUMENT>>>$/, '').trim();
  return text || null;
}
