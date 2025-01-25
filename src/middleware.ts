// /src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseClient'
import { getSubscriptionFromProfile } from '@/lib/utils/subscription'
import { logError } from '@/lib/utils/log'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      logError('Session error:', sessionError.message)
      if (
        req.nextUrl.pathname.startsWith('/dashboard') ||
        req.nextUrl.pathname.startsWith('/billing') ||
        req.nextUrl.pathname.startsWith('/checkout')
      ) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      return res
    }

    if (!session) {
      if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/checkout')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      return res
    }

    if (session) {
      const serverSupabase = createSupabaseServerClient()
      const userId = session.user.id
      const profile = await getSubscriptionFromProfile(userId)

      if (profile.error) {
        logError('Profile fetch error:', profile.error, profile.details)
        return res
      }

      if (profile?.subscription_status === 'active') {
        const tier = profile.subscription_tier
        if (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL(`/dashboard/${tier}`, req.url))
        }
        if (req.nextUrl.pathname.startsWith('/dashboard/') && !req.nextUrl.pathname.includes(`/dashboard/${tier}`)) {
          return NextResponse.redirect(new URL(`/dashboard/${tier}`, req.url))
        }
      }

      if (!profile?.subscription_status || profile?.subscription_status === 'inactive') {
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/checkout', req.url))
        }
      }

      if (
        profile?.subscription_status === 'active' &&
        profile?.subscription_period_end &&
        new Date(profile.subscription_period_end) < new Date()
      ) {
        if (!req.nextUrl.pathname.startsWith('/billing/update')) {
          return NextResponse.redirect(new URL('/billing/update', req.url))
        }
      }
    }

    return res
  } catch (error) {
    logError('Middleware error:', error.message, error)
    return res
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/', '/billing/:path*', '/checkout/:path*']
}
