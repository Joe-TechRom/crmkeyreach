import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getDashboardRoute } from './lib/utils/dashboard'; // Import the getDashboardRoute function

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.set({ name, value: '', ...options }),
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const returnTo = req.nextUrl.searchParams.get('return_to');

  // 1. Authentication Check and Redirect to Sign-in
  if (pathname.startsWith('/dashboard') && !session) {
    const signInUrl = new URL('/auth/signin', req.url);
    if (returnTo) {
      signInUrl.searchParams.set('return_to', returnTo);
    }
    return NextResponse.redirect(signInUrl);
  }

  // 2. Redirect Authenticated Users Away from Auth Pages
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Tier-Based Dashboard Routing
  if (session && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', session.user.id)
      .single();

    const user = { ...session.user, tier: profile?.tier };
    const dashboardRoute = getDashboardRoute(user);

    if (pathname !== dashboardRoute) {
      const redirectUrl = new URL(dashboardRoute, req.url);
      if (returnTo) {
        redirectUrl.searchParams.set('return_to', returnTo);
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
