'use client';

import { useState, useEffect, useRef } from 'react';

interface CaptchaChallenge {
  challenge_id: string;
  type: string;
  image: string;
}

export default function CaptchaSolver({ wsUrl }: { wsUrl: string }) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  const getWebSocketUrl = () => {
    let base = wsUrl;
    if (base.startsWith('http://')) base = base.replace('http://', 'ws://');
    else if (base.startsWith('https://')) base = base.replace('https://', 'wss://');
    return `${base}/ws/captcha`;
  };

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(getWebSocketUrl());
      ws.onopen = () => console.log('✅ WebSocket connected');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChallenge({
          challenge_id: data.challenge_id,
          type: data.type,
          image: `data:image/png;base64,${data.image}`,
        });
      };
      ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting...');
        setTimeout(connect, 1000);
      };
      ws.onerror = (err) => console.error('WebSocket error', err);
      wsRef.current = ws;
    };
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [wsUrl]);

  const sendSolution = (solution: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ ...solution, challenge_id: challenge?.challenge_id }));
    }
    setChallenge(null);
    setTextAnswer('');
  };

  if (!challenge) return null;

  // Text CAPTCHA
  if (challenge.type === 'text') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">CAPTCHA Required</h3>
          <img src={challenge.image} alt="CAPTCHA" className="mb-4 border rounded" />
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Enter the text shown"
            className="w-full border rounded px-3 py-2 mb-4"
            autoFocus
          />
          <button
            onClick={() => sendSolution({ type: 'text', text: textAnswer })}
            className="w-full bg-primary-600 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  // Checkbox CAPTCHA (click on image)
  if (challenge.type === 'checkbox') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Click the CAPTCHA checkbox</h3>
          <div className="relative inline-block">
            <img
              src={challenge.image}
              alt="Click on checkbox"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                sendSolution({ type: 'click', x, y });
              }}
              className="cursor-pointer border rounded"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">Click directly on the checkbox image above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">
        <p>CAPTCHA detected but not supported. Please wait or refresh.</p>
        <button onClick={() => setChallenge(null)} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded">Dismiss</button>
      </div>
    </div>
  );
}