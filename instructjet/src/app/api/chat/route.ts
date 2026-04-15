// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const FETCH_TIMEOUT_MS = 600_000; // 10 minutes

// The Colab notebook URL (make sure it's public)
const COLAB_NOTEBOOK_URL = 'https://colab.research.google.com/drive/17BePgGCEGK5oRcjcMsjRMzT0pfXHsiwx?usp=sharing';

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const { message, context } = await req.json();

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

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: message,
        context: fullContext,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // If the HF server returns 404 (or any error), treat it as offline
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        return NextResponse.json({
          response: getServerOfflineMessage()
        });
      }
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
    let assistantMessage = data.response;

    return NextResponse.json({ response: assistantMessage });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Chat API error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'The AI is taking too long to respond. Please try again with a simpler request.' },
        { status: 504 }
      );
    }
    
    // Network errors (e.g., ECONNREFUSED, fetch failed) also mean server is down
    if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        response: getServerOfflineMessage()
      });
    }
    
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}

// Helper function to generate the tutorial message
function getServerOfflineMessage(): string {
  return `⚠️ **The AI server is currently offline.**  
To use the guide generator, you need to start the server first.  

**How to activate:**  
1. Click this link to open the Google Colab notebook:  
   🔗 [Start AI Server on Colab](${COLAB_NOTEBOOK_URL})  
2. In Colab, click the **"Run all"** button (or run the cells one by one).  
3. Wait until you see a message like *"Server running on http://localhost:8000"* and the ngrok URL is displayed.  
4. Once the server is running, return here and try again.  

The server will stay active as long as the Colab tab is open.  
If it stops, just repeat the steps above.  

*Need help?* Make sure you're signed into Google and have enough free Colab quota.`;
}