
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })
  const { email, password, name, phoneNumber, planType } = await request.json()

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phoneNumber, subscription_tier: planType },
      emailRedirectTo: `${requestUrl.origin}/auth/callback`
    }
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user })
}
