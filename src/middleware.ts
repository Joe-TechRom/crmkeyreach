import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, NextRequest } from 'next/server'; // Corrected import

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError.message);
      // Consider redirecting to /auth/signin only if the user is trying to access a protected route
      if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/billing')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      return res; // Otherwise, just continue
    }

    if (!session && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/billing'))) {
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
        return res; // Continue even if profile fetch fails (handle gracefully in components)
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
    return res; // Continue even if a general error occurs
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/', '/billing/:path*'],
};
