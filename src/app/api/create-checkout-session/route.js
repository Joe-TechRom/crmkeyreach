import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, additionalUserPriceId, additionalUsers, userId, planType, billingCycle } = await req.json();

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
      metadata: {
        userId,
        tier: planType,
        billingCycle,
        additionalUsers: additionalUsers || 0,
      },
    });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message }, 
      { status: 500 }
    );
  }
}
