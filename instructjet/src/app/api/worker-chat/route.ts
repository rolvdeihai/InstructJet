// src/app/api/worker-chat/route.ts (or wherever your file is)
import { NextRequest, NextResponse } from 'next/server';

const HF_API_URL = `${process.env.HF_API_BASE_URL}/chat`;
const COLAB_NOTEBOOK_URL = 'https://colab.research.google.com/drive/17BePgGCEGK5oRcjcMsjRMzT0pfXHsiwx?usp=sharing';

export async function POST(req: NextRequest) {
  try {
    const { message, guideContent, context } = await req.json();

    const systemPrompt = `You are a helpful assistant that answers questions about a task guide. The guide is about: ${guideContent}. 
Answer the worker's question clearly and concisely. Use the conversation history if relevant.`;

    const fullContext = `${systemPrompt}\n\nConversation history:\n${context || ''}\n\nWorker: ${message}\nAssistant:`;

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: message, context: fullContext }),
    });

    if (!response.ok) {
      // If the server returns 404, 502, 503 – treat as offline
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        return NextResponse.json({
          response: getServerOfflineMessage()
        });
      }
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response });
  } catch (error: any) {
    console.error('Worker chat error:', error);
    
    // Network errors (fetch failed, ECONNREFUSED) also mean server is down
    if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        response: getServerOfflineMessage()
      });
    }
    
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}

// Helper function – same message as in the main chat API
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