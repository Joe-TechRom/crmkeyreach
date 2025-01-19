import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Check if the user is trying to access a dashboard route
  if (pathname.startsWith('/dashboard/')) {
    const session = req.cookies.get('sb-access-token')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(session);

      if (userError || !user) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('tier')
        .eq('id', user.id)
        .single();

      if (userDataError || !userData || !userData.tier) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const userTier = userData.tier;

      // Redirect to the correct dashboard based on the user's tier
      if (
        (userTier === 'basic' && pathname !== '/dashboard/single-user') ||
        (userTier === 'team' && pathname !== '/dashboard/team') ||
        (userTier === 'corporate' && pathname !== '/dashboard/corporate')
      ) {
        return NextResponse.redirect(new URL(`/dashboard/${userTier}`, req.url));
      }
    } catch (error) {
      console.error('Error in middleware:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
