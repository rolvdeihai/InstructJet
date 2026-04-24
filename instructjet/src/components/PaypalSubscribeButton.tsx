// src/components/PaypalSubscribeButton.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

// Extend Window interface to include PayPal
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style: { shape: string; color: string; label: string };
        createSubscription: (data: unknown, actions: unknown) => Promise<string>;
        onApprove: (data: { subscriptionID: string }, actions: unknown) => Promise<void>;
        onError: (err: Error) => void;
      }) => {
        render: (element: HTMLDivElement) => void;
      };
    };
  }
}

interface PayPalSubscribeButtonProps {
  userId: string;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
}

export default function PayPalSubscribeButton({
  userId,
  onSuccess,
  onError,
}: PayPalSubscribeButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [userId]);

  useEffect(() => {
    if (!loaded || !window.paypal || !paypalRef.current) return;

    window.paypal.Buttons({
      style: { shape: 'rect', color: 'gold', label: 'subscribe' },
      createSubscription: async (_data, _actions) => {
        const response = await fetch('/api/paypal/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, planType: 'monthly' }),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.error);
        return json.subscriptionId;
      },
      onApprove: async (data, _actions) => {
        try {
          // Call confirm endpoint with user email (you can pass email as prop instead)
          const userRes = await fetch('/api/user/profile');
          const userData = await userRes.json();
          await fetch('/api/paypal/confirm-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscriptionID: data.subscriptionID,
              userEmail: userData.user.email,
            }),
          });
          onSuccess(data.subscriptionID);
        } catch (err) {
          onError(err instanceof Error ? err.message : 'Unknown error');
        }
      },
      onError: (err: Error) => {
        console.error(err);
        onError('Payment failed. Please try again.');
      },
    }).render(paypalRef.current);
  }, [loaded, userId, onSuccess, onError]);

  return <div ref={paypalRef} />;
}