'use client';

import { Button } from '@/src/components/ui/button';
import { createClient } from '@/src/lib/supabase/client';
import type { Provider } from '@supabase/supabase-js';
import { useState } from 'react';

type OAuthProvider = Extract<Provider, 'google' | 'apple'>;

type OAuthButtonsProps = {
  disabled?: boolean;
  onBeforeStart?: () => boolean;
};

const OAUTH_PROVIDERS: Array<{
  label: string;
  provider: OAuthProvider;
  scopes: string;
  icon: React.ReactNode;
}> = [
  {
    label: 'Continue with Google',
    provider: 'google',
    scopes: 'email profile',
    icon: (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
    ),
  },
  {
    label: 'Continue with Apple',
    provider: 'apple',
    scopes: 'name email',
    icon: (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.55 12.14c-.02-2.14 1.76-3.16 1.84-3.21-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.77-3.25.77-.68 0-1.72-.75-2.82-.73-1.45.02-2.79.84-3.54 2.14-1.51 2.62-.39 6.5 1.09 8.62.72 1.04 1.58 2.21 2.71 2.17 1.08-.04 1.49-.7 2.8-.7 1.3 0 1.67.7 2.82.68 1.16-.02 1.9-1.06 2.61-2.1.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.33-.89-2.35-3.52zM14.43 5.86c.59-.72.99-1.72.88-2.72-.85.03-1.89.57-2.5 1.29-.55.64-1.03 1.66-.9 2.64.95.07 1.92-.49 2.52-1.21z" />
      </svg>
    ),
  },
];

export function OAuthButtons({ disabled = false, onBeforeStart }: OAuthButtonsProps) {
  const [activeProvider, setActiveProvider] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: OAuthProvider, scopes: string) => {
    if (onBeforeStart && !onBeforeStart()) return;

    const supabase = createClient();
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', '/plans/my');

    setActiveProvider(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
          scopes,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unable to start OAuth sign in.');
      setActiveProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid gap-2">
        {OAUTH_PROVIDERS.map(({ label, provider, scopes, icon }) => {
          const isActive = activeProvider === provider;
          const isBusy = activeProvider != null;

          return (
            <Button
              key={provider}
              type="button"
              variant="outline"
              className="w-full rounded-full"
              disabled={disabled || isBusy}
              onClick={() => handleOAuthSignIn(provider, scopes)}>
              {icon}
              {isActive ? 'Redirecting...' : label}
            </Button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
