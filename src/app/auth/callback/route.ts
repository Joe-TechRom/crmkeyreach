import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?error=${authError.name}&error_description=${encodeURIComponent(authError.message)}`
      )
    }

    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_status, subscription_tier')
        .eq('id', user.id)
        .single()

      if (userData?.subscription_status === 'active') {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
      
      return NextResponse.redirect(`${requestUrl.origin}/checkout?session_id=${user.id}&tier=${userData?.subscription_tier || 'single_user'}`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
}
