import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logError } from '@/lib/utils/log';
import { updateSubscriptionInProfile } from '@/lib/utils/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature!, webhookSecret);
  } catch (err: any) {
    logError('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;
    const billingCycle = session.metadata?.billingCycle;
    let additionalUsers = session.metadata?.additionalUsers;
    const subscriptionPeriodEnd = session.subscription?.current_period_end;

    if (!userId) {
      logError('Error: userId is missing in metadata.');
      return NextResponse.json({ error: 'userId is missing in metadata.' }, { status: 400 });
    }

    if (typeof additionalUsers !== 'string' || isNaN(parseInt(additionalUsers, 10))) {
      logError('Error: additionalUsers is not a valid number, setting to 0.');
      additionalUsers = 0;
    } else {
      additionalUsers = parseInt(additionalUsers, 10);
    }

    try {
      const subscriptionData = {
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_tier: tier,
        billing_cycle: billingCycle,
        additional_users: additionalUsers,
        subscription_period_end: subscriptionPeriodEnd ? new Date(subscriptionPeriodEnd * 1000).toISOString() : null,
      };

      const updatedProfile = await updateSubscriptionInProfile(userId, subscriptionData);

      if (updatedProfile.error) {
        logError('Error updating profile:', updatedProfile.error, updatedProfile.details);
        return NextResponse.json({ error: `Error updating profile: ${updatedProfile.error}` }, { status: 500 });
      }

      console.log(`User ${userId} subscription updated successfully.`);
      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
      logError('Error processing webhook:', error);
      return NextResponse.json({ error: `Error processing webhook: ${error.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
