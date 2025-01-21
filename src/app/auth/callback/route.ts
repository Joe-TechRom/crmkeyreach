import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tier = requestUrl.searchParams.get('tier') || 'single_user'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      )
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier')
        .eq('id', data.user.id)
        .single()

      if (profile?.subscription_status === 'active') {
        const dashboardRoutes = {
          single_user: '/dashboard/single-user',
          team: '/dashboard/team',
          corporate: '/dashboard/corporate'
        }
        return NextResponse.redirect(
          `${requestUrl.origin}${dashboardRoutes[profile.subscription_tier]}`
        )
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/checkout?session_id=${data.user.id}&tier=${tier}`
      )
    }
  }

  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/account`,
      'Success!',
      'You are now signed in.'
    )
  )
}
