import { stripe } from '@/utils/stripe/config';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract data from session
    const userId = session.metadata?.userId;
    const planType = session.metadata?.tier;
    const additionalUsers = session.metadata?.additionalUsers || 0;
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const customer_email = session.customer_details?.email;

    if (!userId || !planType) {
      console.error('Missing metadata in checkout session.');
      return new NextResponse('Missing metadata', { status: 400 });
    }

    try {
      const supabase = createRouteHandlerClient({ cookies });

      // Get the subscription object to get the period end
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
      const subscription_period_end = new Date(subscription.current_period_end * 1000).toISOString();

      // Update Supabase profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_tier: planType,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          billing_cycle: session.payment_status === 'paid' ? (session.amount_total === session.amount_subtotal ? 'monthly' : 'yearly') : null, // Determine billing cycle
          additional_users: parseInt(additionalUsers as string),
          subscription_period_end: subscription_period_end,
          email: customer_email,
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating Supabase profile:', error);
        return new NextResponse('Error updating Supabase profile', { status: 500 });
      }

      console.log(`Supabase profile updated for user ${userId} with plan ${planType}`);
    } catch (error: any) {
      console.error('Error processing webhook event:', error);
      return new NextResponse('Error processing webhook event', { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
