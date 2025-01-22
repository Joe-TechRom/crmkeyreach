import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient'; // Import server-side client

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }); // Use the middleware client

  try {
    // Get session with better error handling
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Protected routes handling
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (session) {
      // Enhanced profile fetch with subscription check
      const serverSupabase = createSupabaseServerClient(); // Create server-side client
      const { data: profile, error: profileError } = await serverSupabase
        .from('profiles')
        .select(`
          subscription_tier,
          subscription_status,
          subscriptions (
            status,
            current_period_end
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
        return res;
      }

      // Enhanced subscription routing logic
      if (profile?.subscription_status === 'active') {
        const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
        const isHomePage = req.nextUrl.pathname === '/';

        if (isAuthRoute || isHomePage) {
          const tier = profile.subscription_tier;
          return NextResponse.redirect(new URL(`/dashboard/${tier}`, req.url));
        }
      }

      // Check for expired subscriptions
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
