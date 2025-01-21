import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature')
  const supabase = createRouteHandlerClient({ cookies })

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret
    )
  } catch (error) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  switch (event.type) {
    case 'checkout.session.completed': {
      const customerId = session.customer as string
      const userId = session.metadata?.userId
      const subscriptionTier = session.metadata?.tier

      const dashboardRoutes = {
        single_user: '/dashboard/single-user',
        team: '/dashboard/team',
        corporate: '/dashboard/corporate'
      }

      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          subscription_status: 'active',
          subscription_tier: subscriptionTier,
          subscription_period_end: new Date(session.expires_at! * 1000).toISOString()
        })
        .eq('id', userId)

      return NextResponse.json({
        success: true,
        redirectUrl: dashboardRoutes[subscriptionTier as keyof typeof dashboardRoutes]
      })
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('stripe_customer_id', customerId)

      return NextResponse.json({ success: true })
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('profiles')
        .update({
          subscription_status: 'inactive',
          subscription_period_end: new Date().toISOString()
        })
        .eq('stripe_customer_id', customerId)

      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ received: true })
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
