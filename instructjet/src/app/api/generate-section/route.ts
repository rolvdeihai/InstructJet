// src/app/api/generate-section/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

  const { section_type, context, compress_input } = await req.json();
  if (!section_type) {
    return NextResponse.json({ error: 'Missing section_type' }, { status: 400 });
  }

  const plan = await getUserPlan(user.id);
  const isPremium = plan === 'premium';

  try {
    if (isPremium) {
      // --- DeepSeek API call for premium users ---
      let systemPrompt = `You are an expert task guide writer. Generate the "${section_type}" section in markdown.
- Use appropriate subheadings (###) and bullet points.
- Keep the section concise (max 400 tokens).
- Output ONLY the content of the requested section, no extra text.`;

      if (section_type.toLowerCase() === 'flow') {
        systemPrompt += `\n- The Flow section MUST contain a Mermaid flowchart diagram inside a markdown code block with \`\`\`mermaid ... \`\`\`.`;
      }

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
            { role: 'user', content: `Context:\n${context || 'No specific context'}\n\nNow write the "${section_type}" section:` }
          ],
          temperature: 0.4,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim() || 'Failed to generate section.';
      return NextResponse.json({ content });
    } else {
      // --- Local HF API call for free users (unchanged) ---
      const baseUrl = process.env.HF_API_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
      }
      let ctx = context;
      if (compress_input && ctx && ctx.length > 1500) {
        const compressRes = await fetch(`${baseUrl}/compress-query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: ctx }),
        });
        if (compressRes.ok) {
          const { compressed } = await compressRes.json();
          ctx = compressed;
        }
      }
      const genRes = await fetch(`${baseUrl}/generate-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_type, context: ctx, compress_input: false }),
      });
      if (!genRes.ok) {
        throw new Error('Local generation failed');
      }
      const data = await genRes.json();
      return NextResponse.json({ content: data.content });
    }
  } catch (error: any) {
    console.error('Generate section error:', error);
    return NextResponse.json(
      { error: 'Failed to generate section. Please try again.' },
      { status: 500 }
    );
  }
}