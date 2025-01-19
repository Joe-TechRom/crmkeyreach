import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  
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
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Get user's subscription tier
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single()

    const tier = profile?.subscription_tier

    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // Basic features - all tiers
      if (req.nextUrl.pathname.startsWith('/dashboard/basic')) {
        return res
      }

      // Team features
      if (req.nextUrl.pathname.startsWith('/dashboard/team')) {
        if (tier === 'team' || tier === 'corporate') {
          return res
        }
        return NextResponse.redirect(new URL('/dashboard/basic', req.url))
      }

      // Corporate features
      if (req.nextUrl.pathname.startsWith('/dashboard/corporate')) {
        if (tier === 'corporate') {
          return res
        }
        return NextResponse.redirect(new URL('/dashboard/basic', req.url))
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/basic', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}
