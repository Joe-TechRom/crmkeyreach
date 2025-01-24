// src/app/api/verify-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    console.error('Session verification error: No session ID provided');
    return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (!session) {
      console.error('Session verification error: Session not found for ID:', sessionId);
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const subscription = session.subscription as Stripe.Subscription;
    if (!subscription) {
      console.error('Session verification error: No subscription found for session ID:', sessionId);
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
    }

    const customerId = session.customer as string;
    if (!customerId) {
      console.error('Session verification error: No customer ID found for session ID:', sessionId);
      return NextResponse.json({ error: 'No customer ID found' }, { status: 400 });
    }

    const priceId = subscription.items.data[0].price.id;
    if (!priceId) {
      console.error('Session verification error: No price ID found for session ID:', sessionId);
      return NextResponse.json({ error: 'No price ID found' }, { status: 400 });
    }

    const price = await stripe.prices.retrieve(priceId);
    if (!price) {
      console.error('Session verification error: Price not found for price ID:', priceId);
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }

    const product = await stripe.products.retrieve(price.product as string);
    if (!product) {
      console.error('Session verification error: Product not found for product ID:', price.product);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const planName = product.name;
    const planInterval = price.recurring?.interval;
    const planAmount = price.unit_amount;

    console.log('Verify Session Response:', {
      status: subscription.status,
      customerId,
      subscriptionId: subscription.id,
      plan: {
        name: planName,
        interval: planInterval,
        amount: planAmount,
      },
    });

    return NextResponse.json({
      status: subscription.status,
      customerId,
      subscriptionId: subscription.id,
      plan: {
        name: planName,
        interval: planInterval,
        amount: planAmount,
      },
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Session verification failed' }, { status: 400 });
  }
}
