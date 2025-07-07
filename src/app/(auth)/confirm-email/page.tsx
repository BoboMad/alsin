// app/confirm/page.tsx or pages/confirm.tsx depending on your routing system
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Missing email or token.');
      return;
    }

    const confirmEmail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Email confirmation failed.');
        setStatus('success');
        setMessage('Your email has been successfully confirmed!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Something went wrong.');
      }
    };

    confirmEmail();
  }, [email, token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      {status === 'loading' && (
        <div className="animate-spin text-primary">
          <Loader2 size={48} />
          <p className="mt-4">Confirming your email...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="text-green-600">
          <CheckCircle2 size={48} />
          <p className="mt-4 text-lg font-semibold">{message}</p>
          <Link href="/login">
            <Button className="mt-4">Go to Login</Button>
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div className="text-red-600">
          <XCircle size={48} />
          <p className="mt-4 text-lg font-semibold">{message}</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">Back to Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
