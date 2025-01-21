import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // Ensure profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
            phone_number: user.user_metadata.phone_number,
            subscription_tier: user.user_metadata.subscription_tier || 'single_user',
            subscription_status: 'trialing',
            created_at: new Date().toISOString()
          })

        if (profileError) {
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/error?message=${encodeURIComponent(profileError.message)}`
          )
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}/checkout?session_id=${user.id}`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
}
