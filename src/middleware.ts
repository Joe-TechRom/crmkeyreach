import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDashboardRoute } from '@/lib/utils/dashboard';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function middleware(req: NextRequest) {
  // Skip middleware for static files and images
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/images') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.') ||
    req.nextUrl.pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extended list of public paths
  const publicPaths = [
    '/',
    '/signup',
    '/signin',
    '/pricing',
    '/about',
    '/contact',
    '/features',
    '/api/stripe/webhook',
    '/terms',
    '/privacy'
  ];

  // Check if the current path is public
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return res;
  }

  // Check if path starts with any public path
  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return res;
  }

  if (!user) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Only redirect to dashboard if explicitly accessing protected routes
  const protectedPaths = ['/dashboard', '/account', '/settings'];
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    const dashboardRoute = await getDashboardRoute(user);
    if (req.nextUrl.pathname !== dashboardRoute) {
      return NextResponse.redirect(new URL(dashboardRoute, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|public).*)',
  ],
};
