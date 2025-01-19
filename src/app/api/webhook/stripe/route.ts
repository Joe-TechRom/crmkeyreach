// src/app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer', 'line_items']
    });

    const formattedData = {
      plan: {
        name: session.line_items?.data[0]?.description,
        interval: session.mode === 'subscription' ? 'month' : 'one-time',
        amount: session.amount_total
      },
      customer: session.customer_details,
      subscription: session.subscription
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Stripe session fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session details' },
      { status: 500 }
    );
  }
}
