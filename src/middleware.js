import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          subscription_tier,
          subscription_status,
          subscriptions (
            status,
            current_period_end
          )
        `)
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
        return res;
      }

      if (profile?.subscription_status === 'active') {
        const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
        const isHomePage = req.nextUrl.pathname === '/';

        if (isAuthRoute || isHomePage) {
          const tier = profile.subscription_tier;
          return NextResponse.redirect(new URL(`/dashboard/${tier}`, req.url));
        }
      }

      const subscription = profile?.subscriptions?.[0];
      if (subscription?.status === 'active' && new Date(subscription.current_period_end) < new Date()) {
        return NextResponse.redirect(new URL('/billing/update', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error.message);
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/', '/billing/:path*'],
};
