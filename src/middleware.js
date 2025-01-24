import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { getSubscriptionFromProfile } from '@/lib/utils/subscription';
import { logError } from '@/lib/utils/log'; // Import a logging utility

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // 1. Get Session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      logError('Session error:', sessionError.message);
      if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/billing')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      return res;
    }

    // 2. Handle Unauthenticated Users
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // 3. Handle Authenticated Users
    if (session) {
      const serverSupabase = createSupabaseServerClient();
      const userId = session.user.id;

      // 3.1 Fetch Profile and Subscription Data
      const profile = await getSubscriptionFromProfile(userId);

      if (profile.error) {
        logError('Profile fetch error:', profile.error, profile.details);
        return res;
      }

      // 3.2 Handle Active Subscriptions
      if (profile?.subscription_status === 'active' && (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname === '/')) {
        const tier = profile.subscription_tier;
        return NextResponse.redirect(new URL(`/dashboard/${tier}`, req.url));
      }

      // 3.3 Handle Expired Subscriptions
      if (profile?.subscription_status === 'active' && profile?.subscription_period_end && new Date(profile.subscription_period_end) < new Date()) {
        return NextResponse.redirect(new URL('/billing/update', req.url));
      }
    }

    return res;
  } catch (error) {
    logError('Middleware error:', error.message, error);
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/', '/billing/:path*'],
};
