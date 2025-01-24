import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { logError } from '@/lib/utils/log';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req: Request) {
  const signature = headers().get('stripe-signature');
  const body = await req.text();

  if (!signature) {
    return new NextResponse('No signature', { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logError('Webhook signature verification failed', err);
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;
        const userId = subscription.metadata.userId;
        const planId = subscription.items.data[0].price.product;
        const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
        const product = await stripe.products.retrieve(planId as string);
        const planType = product.name;
        const billingCycle = price.recurring?.interval;
        const additionalUsers = subscription.metadata.additionalUsers;
        const subscriptionStatus = subscription.status;

        console.log('Subscription Created/Updated Event Data:', {
          userId,
          customerId,
          subscriptionId,
          planType,
          billingCycle,
          additionalUsers,
          subscriptionStatus,
        });

        if (!userId) {
          logError('No userId found in subscription metadata');
          return new NextResponse('No userId found in subscription metadata', { status: 400 });
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_id: subscriptionId,
            subscription_status: subscriptionStatus,
            plan_type: planType,
            billing_cycle: billingCycle,
            additional_users: additionalUsers,
          })
          .eq('user_id', userId);

        if (error) {
          logError('Error updating profile:', error);
          return new NextResponse('Error updating profile', { status: 500 });
        }
        break;
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userIdFromSession = session.client_reference_id;
        const customerIdFromSession = session.customer as string;
        const subscriptionIdFromSession = session.subscription as string;

        console.log('Checkout Session Completed Event Data:', {
          userIdFromSession,
          customerIdFromSession,
          subscriptionIdFromSession,
        });

        if (!userIdFromSession) {
          logError('No userId found in checkout session metadata');
          return new NextResponse('No userId found in checkout session metadata', { status: 400 });
        }

        const { error: sessionError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerIdFromSession,
            subscription_id: subscriptionIdFromSession,
            subscription_status: 'active',
          })
          .eq('user_id', userIdFromSession);

        if (sessionError) {
          logError('Error updating profile from session:', sessionError);
          return new NextResponse('Error updating profile from session', { status: 500 });
        }
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError('Webhook processing error:', error);
    return new NextResponse('Webhook processing error', { status: 500 });
  }
}
