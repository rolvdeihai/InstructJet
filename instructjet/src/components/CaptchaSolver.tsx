'use client';

import { useState, useEffect } from 'react';

interface CaptchaChallenge {
  challenge_id: string;
  type: string;
  image: string;
}

export default function CaptchaSolver({ wsUrl }: { wsUrl: string }) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${wsUrl}/ws/captcha`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChallenge({
        challenge_id: data.challenge_id,
        type: data.type,
        image: `data:image/png;base64,${data.image}`,
      });
    };
    return () => ws.close();
  }, [wsUrl]);

  const sendSolution = (solution: any) => {
    if (!challenge) return;
    const ws = new WebSocket(`${wsUrl}/ws/captcha`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ ...solution, challenge_id: challenge.challenge_id }));
      ws.close();
    };
    setChallenge(null);
    setTextAnswer('');
    setClickCoords(null);
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

  // Fallback for other types
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">
        <p>CAPTCHA detected but not supported. Please wait or refresh.</p>
        <button onClick={() => setChallenge(null)} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded">Dismiss</button>
      </div>
    </div>
  );
}