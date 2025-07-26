'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmEmail } from '@/lib/api/auth/post-confirm-email';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: confirmEmailRequest } = useConfirmEmail({
    config: {
      onSuccess: () => {
        router.push('/login?confirmed=true');
      },
      onError: error => {
        setError(error.response?.data?.message || 'Email confirmation failed.');
        setLoading(false);
      },
    },
  });

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setError('Invalid confirmation link.');
      setLoading(false);
      return;
    }

    confirmEmailRequest({ email, token });
  }, [searchParams, router, confirmEmailRequest]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen gap-2">
        <Spinner /> Confirming email...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/login')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Go to Login
        </button>
      </div>
    );
  }

  return null; // Redirect handles the success case
}
