'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/client';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import Spinner from '@/src/components/ui/Spinner';

type Status = 'loading' | 'success' | 'error';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let isActive = true;

    const confirm = async () => {
      const rawError = searchParams.get('error_description') || searchParams.get('error');
      if (rawError) {
        const decodedError = (() => {
          try {
            return decodeURIComponent(rawError);
          } catch {
            return rawError;
          }
        })();
        if (!isActive) return;
        setStatus('error');
        setErrorMessage(decodedError);
        return;
      }

      const supabase = createClient();
      const code = searchParams.get('code');
      const hasHashToken =
        typeof window !== 'undefined' && window.location.hash.includes('access_token=');

      try {
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
          if (!isActive) return;
          setHasSession(Boolean(data.session));
          setStatus('success');
        } else {
          const { data } = await supabase.auth.getSession();
          if (!isActive) return;
          if (data.session) {
            setHasSession(true);
            setStatus('success');
          } else if (hasHashToken) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const { data: retry } = await supabase.auth.getSession();
            if (!isActive) return;
            if (retry.session) {
              setHasSession(true);
              setStatus('success');
            } else {
              setStatus('error');
              setErrorMessage('This confirmation link is invalid or has expired.');
            }
          } else {
            setStatus('error');
            setErrorMessage('This confirmation link is invalid or has expired.');
          }
        }
      } catch (error: unknown) {
        if (!isActive) return;
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to confirm email.');
      } finally {
        if (typeof window !== 'undefined') {
          const cleanUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    };

    confirm();

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Confirming email'}
              {status === 'success' && 'Email confirmed'}
              {status === 'error' && 'Confirmation failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' &&
                'Hang tight while we verify your email. This takes a moment.'}
              {status === 'success' &&
                (hasSession
                  ? 'Your email is confirmed and you are signed in.'
                  : 'Your email is confirmed. Please log in to continue.')}
              {status === 'error' &&
                'We could not verify this confirmation link. It may have already been used or expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'loading' && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner size="sm" />
                Confirming your email...
              </div>
            )}
            {status === 'error' && errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            {status === 'success' && (
              <div className="flex flex-col gap-3">
                <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                  {hasSession
                    ? 'You are all set. You can continue to your plans.'
                    : 'For security, please sign in to continue.'}
                </div>
                <Button
                  className="w-full"
                  onClick={() => router.push(hasSession ? '/plans/my' : '/auth/login')}>
                  {hasSession ? 'Go to my plans' : 'Go to login'}
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            )}
            {status === 'error' && (
              <div className="flex flex-col gap-3">
                <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                  If you clicked an old link, sign up again to receive a new confirmation email.
                </div>
                <Button className="w-full" onClick={() => router.push('/auth/login')}>
                  Back to login
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/auth/sign-up">Back to sign up</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
