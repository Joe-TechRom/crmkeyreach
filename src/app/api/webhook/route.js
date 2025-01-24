import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const userId = session.metadata.userId;
    const tier = session.metadata.tier;
    const billingCycle = session.metadata.billingCycle;
    const additionalUsers = session.metadata.additionalUsers;

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: 'active',
          subscription_tier: tier,
          billing_cycle: billingCycle,
          additional_users: parseInt(additionalUsers, 10),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
      }

      console.log(`User ${userId} subscription updated successfully.`);
      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
