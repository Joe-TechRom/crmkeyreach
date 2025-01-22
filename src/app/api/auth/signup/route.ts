import { NextResponse } from 'next/server'
import supabaseClient from '../../../lib/supabaseClient.ts'

export async function POST(request: Request) {
  try {
    const { email, password, name, phoneNumber, planType } = await request.json()

    const { data: { user }, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phoneNumber,
          subscription_tier: planType,
        },
        emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
      },
    })

    if (signUpError) throw signUpError

    if (user) {
      const { error: userError } = await supabaseClient
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: name,
          phone_number: phoneNumber,
          subscription_tier: planType,
          subscription_status: 'trialing',
          created_at: new Date().toISOString(),
        })

      if (userError) throw userError
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Signup endpoint ready' })
}
