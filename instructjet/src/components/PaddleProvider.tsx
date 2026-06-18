// app/components/PaddleProvider.tsx
'use client';
import { useEffect } from 'react';

export function PaddleProvider() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      (window as any).Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox');
      (window as any).Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      });
    };
    document.body.appendChild(script);
  }, []);
  return null;
}