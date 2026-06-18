import { createClient } from '@/src/lib/supabase/server';
import { NextResponse } from 'next/server';

const DEFAULT_AUTH_REDIRECT = '/plans/my';

const getSafeNextPath = (nextPath: string | null) => {
  if (!nextPath) return DEFAULT_AUTH_REDIRECT;
  if (!nextPath.startsWith('/')) return DEFAULT_AUTH_REDIRECT;
  if (nextPath.startsWith('//') || nextPath.includes('://')) return DEFAULT_AUTH_REDIRECT;

  return nextPath;
};

const getRedirectOrigin = (request: Request, origin: string) => {
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (process.env.NODE_ENV === 'development' || !forwardedHost) {
    return origin;
  }

  return `https://${forwardedHost}`;
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  console.log('code', code);
  const error = searchParams.get('error_description') ?? searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);

    console.log('exchangeError', exchangeError, data);
    if (!exchangeError) {
      const nextPath = getSafeNextPath(searchParams.get('next'));
      const redirectOrigin = getRedirectOrigin(request, origin);
      console.log('redirecting to', `${redirectOrigin}${nextPath}`);

      return NextResponse.redirect(`${redirectOrigin}${nextPath}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`,
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent('Missing OAuth callback code.')}`,
  );
}
