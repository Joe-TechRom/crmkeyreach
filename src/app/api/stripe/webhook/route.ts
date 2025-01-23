import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');
  const supabase = createRouteHandlerClient({ cookies });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
   case 'checkout.session.completed': {
  const customerId = session.customer as string;
  const userId = session.metadata?.userId;
  // Get the tier from the subscription data
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const subscriptionTier = subscription.metadata?.tier || session.metadata?.tier || 'single_user';

  const profileData = {
    id: userId,
    stripe_customer_id: customerId,
    subscription_status: 'active',
    subscription_tier: subscriptionTier,
    subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();

  return NextResponse.json({
    success: true,
    userId,
    plan: {
      name: subscriptionTier,
      status: 'active',
      period_end: subscription.current_period_end
    }
  });
}


    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', customerId);

      if (error) {
        console.error('Subscription update failed:', error);
        return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        status: subscription.status,
        period_end: subscription.current_period_end
      });
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'inactive',
          subscription_period_end: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', customerId);

      if (error) {
        console.error('Subscription deletion failed:', error);
        return NextResponse.json({ error: 'Subscription deletion failed' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        status: 'inactive'
      });
    }

    default:
      return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
