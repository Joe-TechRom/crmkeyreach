import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { sessionId } = await request.json();

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent', 'subscription'],
    });

    const subscription = stripeSession.subscription as Stripe.Subscription;
    const customer = stripeSession.customer as Stripe.Customer;

    if (!subscription || !customer) {
      console.error('Missing subscription or customer data in Stripe session');
      return NextResponse.json({ error: 'Incomplete Stripe session data' }, { status: 400 });
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Supabase session error:', sessionError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        email: customer.email,
        name: customer.name,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_tier: stripeSession.metadata?.tier,
        billing_cycle: stripeSession.metadata?.billing_cycle,
        plan_type: stripeSession.metadata?.plan_type,
        payment_status: stripeSession.payment_status,
        currency: stripeSession.currency,
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        additional_users: parseInt(stripeSession.metadata?.additional_users || '0'),
        address: customer.address,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ profileData: profile });
  } catch (error: any) {
    console.error('Stripe success route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
