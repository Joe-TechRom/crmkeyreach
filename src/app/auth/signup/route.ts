import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  return NextResponse.redirect(`${requestUrl.origin}/auth/signup`)
}

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const supabase = createRouteHandlerClient({ cookies })

    const formData = await request.formData()
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const name = String(formData.get('name'))
    const phoneNumber = String(formData.get('phoneNumber'))
    const planType = String(formData.get('planType') || 'single_user')

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phoneNumber,
          subscription_tier: planType
        },
        emailRedirectTo: `${requestUrl.origin}/auth/callback`
      }
    })

    if (signUpError || !user) {
      return NextResponse.json(
        { error: signUpError?.message || 'Signup failed' },
        { status: 400 }
      )
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: email,
        full_name: name,
        phone_number: phoneNumber,
        subscription_tier: planType,
        subscription_status: 'trialing',
        created_at: new Date().toISOString(),
        subscription_period_end: null,
        stripe_customer_id: null
      })

    if (profileError) {
      await supabase.auth.admin.deleteUser(user.id)
      return NextResponse.json(
        { error: 'Profile creation failed' },
        { status: 400 }
      )
    }

    return NextResponse.redirect(
      `${requestUrl.origin}/checkout?session_id=${user.id}&tier=${planType}`
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
