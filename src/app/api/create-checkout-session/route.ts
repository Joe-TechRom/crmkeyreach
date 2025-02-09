import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';
import { subscriptionPlans } from '@/config/plans';
import { createOrRetrieveCustomer } from '@/lib/supabaseAdmin';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { plan: planIdentifier, quantity = 1, metadata = {} } = await req.json();
    
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const customer = await createOrRetrieveCustomer({
      uuid: session.user.id,
      email: session.user.email || ''
    });

    const planDetails = Object.values(subscriptionPlans).find(
      (plan) =>
        plan.monthlyPriceId === planIdentifier || plan.yearlyPriceId === planIdentifier
    );

    if (!planDetails) {
      return NextResponse.json({ error: 'Invalid plan identifier' }, { status: 400 });
    }

    if (metadata.additionalUsers > 0 && planDetails.userLimit) {
      const totalUsers = metadata.additionalUsers + 1;
      if (totalUsers > planDetails.userLimit) {
        return NextResponse.json(
          { error: `User limit exceeded for ${planDetails.name}. Maximum ${planDetails.userLimit} users allowed.` },
          { status: 400 }
        );
      }
    }

    const line_items = [{
      price: planIdentifier,
      quantity: 1,
    }];

  if (metadata.additionalUsers > 0) {
  const billingPeriod = metadata.billingPeriod === 'yearly' ? 'yearly' : 'monthly';
  
  const additionalUserPriceId = billingPeriod === 'yearly' 
    ? planDetails.additionalUserYearlyPriceId 
    : planDetails.additionalUserMonthlyPriceId;

  console.log('Additional User Price ID:', additionalUserPriceId);
  
  if (additionalUserPriceId) {
    line_items.push({
      price: additionalUserPriceId,
      quantity: Number(metadata.additionalUsers)
    });
  }
}

console.log('Final line items:', line_items);


    const checkoutSession = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  billing_address_collection: 'required',
  customer,
  line_items,
  mode: 'subscription',
  allow_promotion_codes: true,
  subscription_data: {
    trial_from_plan: true,
    metadata: {
      ...metadata,
      user_id: session.user.id,
      userCount: metadata.additionalUsers ? metadata.additionalUsers + 1 : 1,
      additionalUsers: metadata.additionalUsers || 0  // Add this line
    },
  },
  success_url: `${getURL()}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${getURL()}/checkout`,
});

    await supabase
      .from('profiles')
      .update({
        subscription_status: 'processing',
        subscription_tier: metadata.plan_type,
        billing_cycle: metadata.billingPeriod,
      })
      .eq('user_id', session.user.id);  // Use session.user instead of user

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
