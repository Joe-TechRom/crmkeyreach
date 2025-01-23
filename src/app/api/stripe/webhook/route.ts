// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event; // Explicitly type the event variable

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Checkout Session Completed Event Metadata:", session.metadata); // ADDED LOGGING

      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      let userId = session.metadata?.userId;

      // Type checking and error handling for userId
      if (!userId || typeof userId !== 'string') {
        console.error('Invalid or missing User ID in session metadata:', userId);
        return NextResponse.json({ error: 'Invalid or missing User ID' }, { status: 400 });
      }

      const tier = session.metadata?.tier || 'single_user';

      console.log('checkout.session.completed Webhook received:', {
        customerId,
        userId,
        subscriptionId,
        tier,
        session
      });

      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: 'active', // Assuming 'active' upon completion
            subscription_tier: tier,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Supabase profile update failed:', error);
          return NextResponse.json({ error: 'Supabase profile update failed' }, { status: 500 });
        }

        console.log('Supabase profile updated successfully:', data);
        return NextResponse.json({ received: true });
      } catch (error) {
        console.error('Error updating Supabase profile:', error);
        return NextResponse.json({ error: 'Error updating Supabase profile' }, { status: 500 });
      }

    // case 'payment_intent.succeeded':  // Example of handling another event
    //   // Handle payment_intent.succeeded event
    //   break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
