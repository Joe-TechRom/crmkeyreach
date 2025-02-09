import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the request is for an API route
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Authentication logic for API routes
    if (!session && req.nextUrl.pathname.startsWith('/api/create-checkout-session')) {
      // Redirect to login or return an unauthorized response
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
  }

  return res;
}

// Optionally, configure the middleware to run on specific paths
export const config = {
  matcher: ['/api/:path*'], // Protect all API routes
};

