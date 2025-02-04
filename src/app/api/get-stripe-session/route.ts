import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables.');
  throw new Error('STRIPE_SECRET_KEY is missing'); // Crash early if missing
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Valid Session ID is required' }, { status: 400 });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription', 'customer'],
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      // Validate session status
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not yet received' }, { status: 400 });
      }

      // Check for subscription and customer expansion
      if (!session.subscription || !session.customer) {
        console.warn('Subscription or customer details not expanded. Ensure "expand" is set correctly.');
      }

      // Basic data validation
      if (!session.metadata) {
        console.warn('Session metadata is missing. Ensure metadata is being passed during checkout session creation.');
      }

      // Type assertion for expanded objects
      const subscription = session.subscription as Stripe.Subscription | null;
      const customer = session.customer as Stripe.Customer | null;

      return NextResponse.json({ session, subscription, customer }); // Return expanded objects
    } catch (stripeError: any) {
      console.error('Stripe session retrieval error:', stripeError);
      return NextResponse.json({ error: stripeError.message || 'Failed to retrieve Stripe session' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Request parsing error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
