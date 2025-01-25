// /src/app/api/webhooks/route.ts
import { stripe } from '@/utils/stripe/config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseClient'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return new NextResponse('Webhook signature verification failed', { status: 400 })
  }

  const supabase = createSupabaseServerClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId
    const tier = session.metadata?.tier
    const customerId = session.customer
    const subscriptionId = session.subscription
    const billingCycle = session.current_period_start

    if (userId) {
      try {
        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            billing_cycle: new Date(billingCycle * 1000).toISOString()
          })
          .eq('user_id', userId)
      } catch (error) {
        console.error('Error updating user data:', error)
        return new NextResponse('Error updating user data', { status: 500 })
      }
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const userId = subscription.metadata?.userId
    const subscriptionStatus = subscription.status
    const billingCycle = subscription.current_period_start

    if (userId) {
      try {
        await supabase
          .from('profiles')
          .update({
            subscription_status: subscriptionStatus,
            billing_cycle: new Date(billingCycle * 1000).toISOString()
          })
          .eq('user_id', userId)
      } catch (error) {
        console.error('Error updating subscription status:', error)
        return new NextResponse('Error updating subscription status', { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
