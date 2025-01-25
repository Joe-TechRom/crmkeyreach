// /src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tier = requestUrl.searchParams.get('tier')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=Authentication failed`)
    }

    if (data?.session?.user) {
      const user = data.session.user;
      const userMetadata = user.user_metadata || {};

      // Log the user and userMetadata to check what's available
      console.log('User:', user);
      console.log('User Metadata:', userMetadata);

      // Create or update user profile in the 'profiles' table
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: user.id,
        email: user.email,
        subscription_tier: tier || null,
        name: userMetadata.full_name || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

      if (profileError) {
        console.error('Error upserting profile:', profileError)
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=Profile update failed`)
      }

      return NextResponse.redirect(`${requestUrl.origin}/checkout?tier=${tier}`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth?error=No user data found`)
}
