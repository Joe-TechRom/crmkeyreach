// /src/app/api/create-checkout-session/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { stripe } from '@/utils/stripe/config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { priceId, tier } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      metadata: {
        userId: user.id,
        tier: tier
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Error creating checkout session', { status: 500 })
  }
}
