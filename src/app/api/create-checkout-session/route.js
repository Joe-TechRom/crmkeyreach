import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, additionalUserPriceId, additionalUsers, userId, planType, billingCycle, session_id, getSession } = await req.json();

    if (getSession && session_id) {
      // Retrieve session details
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session || session.mode !== 'subscription' || session.status !== 'complete') {
          return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
        }

        const subscriptionId = session.subscription;

        if (!subscriptionId) {
          return NextResponse.json({ error: 'No subscription found for this session' }, { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const product = await stripe.products.retrieve(price.product);

        const planName = product.name;
        const billingCycle = price.recurring?.interval;

        return NextResponse.json({ planName, billingCycle });
      } catch (error) {
        console.error('Error retrieving session details:', error);
        return NextResponse.json({ error: 'Failed to retrieve session details', details: error.message }, { status: 500 });
      }
    } else {
      // Create a new checkout session
      const lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];

      if (additionalUserPriceId && additionalUsers > 0) {
        lineItems.push({
          price: additionalUserPriceId,
          quantity: additionalUsers,
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        client_reference_id: userId,
        metadata: {
          userId,
          additionalUsers: additionalUsers || 0,
        },
        subscription_data: {
          metadata: {
            userId,
            additionalUsers: additionalUsers || 0,
          },
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}
