import { supabaseAdmin, manageSubscriptionStatusChange } from '@/lib/supabaseAdmin';
import { stripe } from '@/utils/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        await supabaseAdmin
          .from('customers')
          .upsert([{ 
            id: customer.metadata.supabaseUUID,
            stripe_customer_id: customer.id 
          }]);
        break;
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        await supabaseAdmin
          .from('profiles')
          .update({ 
            stripe_customer_id: customer.id,
            subscription_status: 'active' 
          })
          .eq('user_id', customer.metadata.supabaseUUID);
        break;
      }

      case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;
  const subscriptionId = session.subscription as string;
  const userId = session.metadata?.user_id;
  const additionalUsers = parseInt(session.metadata?.additionalUsers || '0');

  // Retrieve full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price']
  });

  // Update both profiles and subscriptions tables
  await Promise.all([
    supabaseAdmin
      .from('profiles')
      .update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_tier: session.metadata?.plan_type,
        billing_cycle: session.metadata?.billing_cycle,
        additional_users: additionalUsers,
        subscription_period_end: new Date(subscription.current_period_end * 1000)
      })
      .eq('user_id', userId),

    manageSubscriptionStatusChange(
      subscriptionId,
      session.customer as string,
      true
    )
  ]);
  break;
}

      case 'invoice.created':
      case 'invoice.finalized':
      case 'invoice.updated':
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (typeof invoice.subscription === 'string') {
          await manageSubscriptionStatusChange(
            invoice.subscription,
            invoice.customer as string,
            false
          );
        }
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        if (charge.customer) {
          const customer = await stripe.customers.retrieve(charge.customer as string);
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('user_id', customer.metadata.supabaseUUID);
        }
        break;
      }

      case 'payment_intent.created':
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (paymentIntent.customer) {
          const customer = await stripe.customers.retrieve(paymentIntent.customer as string);
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('user_id', customer.metadata.supabaseUUID);
        }
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
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
