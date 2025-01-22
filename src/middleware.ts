import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (request.nextUrl.pathname.startsWith('/auth/')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return res
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}
