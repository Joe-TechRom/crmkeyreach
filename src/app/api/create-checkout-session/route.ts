import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { getURL } from '@/utils/helpers';
import { subscriptionPlans } from '@/config/plans';
import { createOrRetrieveCustomer } from '@/lib/supabaseAdmin';

const PRICE_ID_MAP = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_MONTHLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_MONTHLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_YEARLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_YEARLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_ADDITIONAL_USER_MONTHLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_ADDITIONAL_USER_MONTHLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_ADDITIONAL_USER_YEARLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_ADDITIONAL_USER_YEARLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_MONTHLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_MONTHLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_YEARLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_YEARLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_ADDITIONAL_USER_MONTHLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_ADDITIONAL_USER_MONTHLY,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_ADDITIONAL_USER_YEARLY]: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_ADDITIONAL_USER_YEARLY,
};

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

    // Base plan line item
    const line_items = [{
      price: planIdentifier,
      quantity: 1
    }];

    // Add additional users line item if applicable
    if (metadata.additionalUsers > 0 && metadata.plan_type) {
      const planKey = metadata.plan_type.toLowerCase();
      const additionalUserPriceKey = metadata.billingPeriod === 'yearly' 
        ? `NEXT_PUBLIC_STRIPE_PRICE_ID_${planKey.toUpperCase()}_ADDITIONAL_USER_YEARLY`
        : `NEXT_PUBLIC_STRIPE_PRICE_ID_${planKey.toUpperCase()}_ADDITIONAL_USER_MONTHLY`;
      
      const additionalUserPriceId = process.env[additionalUserPriceKey];

      if (additionalUserPriceId) {
        line_items.push({
          price: additionalUserPriceId,
          quantity: metadata.additionalUsers
        });
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items,
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          ...metadata,
          user_id: session.user.id
        }
      },
      success_url: `${getURL()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getURL()}/checkout`
    });

    await supabase
      .from('profiles')
      .update({
        subscription_status: 'processing',
        subscription_tier: metadata.plan_type,
        billing_cycle: metadata.billingPeriod
      })
      .eq('user_id', session.user.id);

    return NextResponse.json({ sessionId: checkoutSession.id });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
