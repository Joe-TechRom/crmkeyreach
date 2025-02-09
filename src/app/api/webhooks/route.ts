import { headers } from 'next/headers';
import { manageSubscriptionStatusChange } from '@/lib/supabaseAdmin';
import { stripe } from '@/utils/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`Webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string; // Type assertion

        // We use createAction = true here because the checkout session completes *before*
        // the subscription is created.
        await manageSubscriptionStatusChange(subscriptionId, customerId, true);
        console.log(`Checkout session completed for subscription: ${subscriptionId}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await manageSubscriptionStatusChange(
          subscription.id,
          subscription.customer as string,
          event.type === 'customer.subscription.created'
        );
        console.log(`${event.type} for subscription: ${subscription.id}`);
        break;
      }

      // Handle invoice events.  Important for subscription status updates.
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
      case 'invoice.updated':
        {
          const invoice = event.data.object as Stripe.Invoice;
          if (typeof invoice.subscription === 'string') {
            await manageSubscriptionStatusChange(
              invoice.subscription,
              invoice.customer as string,
              false // Usually false, as subscription should already exist
            );
          }
          break;
        }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

