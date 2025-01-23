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

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    const subscription = session.subscription as Stripe.Subscription;
    const tier = session.metadata?.tier || subscription.metadata?.tier || 'single_user';
    const customerId = session.customer as string;

    // Fetch user profile from Supabase
    const { data: userData } = await supabase.auth.getUser();
    let profile;
    if (userData?.user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        profile = data;
      }
    }

    console.log('Verify Session Response:', {
      status: subscription.status,
      customerId,
      subscriptionId: subscription.id,
      plan: {
        name: tier,
        interval: subscription.items.data[0].plan.interval,
        amount: subscription.items.data[0].plan.amount
      },
      profile
    });

    return NextResponse.json({
      status: subscription.status,
      customerId,
      subscriptionId: subscription.id,
      plan: {
        name: tier,
        interval: subscription.items.data[0].plan.interval,
        amount: subscription.items.data[0].plan.amount
      },
      profile
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Session verification failed' }, { status: 400 });
  }
}
