// src/app/api/create-checkout-session/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Mapping plan IDs to Stripe Price IDs (replace with your actual IDs)
const PRICE_IDS = {
  single_user: {
    monthly: process.env.STRIPE_PRICE_ID_SINGLE_USER_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ID_SINGLE_USER_YEARLY,
  },
  team: {
    monthly: process.env.STRIPE_PRICE_ID_TEAM_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ID_TEAM_YEARLY,
  },
  corporate: {
    monthly: process.env.STRIPE_PRICE_ID_CORPORATE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ID_CORPORATE_YEARLY,
  },
};

// Mapping plan IDs to Stripe Price IDs for additional users
const ADDITIONAL_USER_PRICE_IDS = {
  team: process.env.STRIPE_PRICE_ID_ADDITIONAL_USER_TEAM,
  corporate: process.env.STRIPE_PRICE_ID_ADDITIONAL_USER_CORPORATE,
};

export async function POST(req) {
  try {
    const { planId, additionalUsers, userId, isYearly } = await req.json();

    console.log(
      'Creating checkout session with userId:',
      userId,
      'planId:',
      planId,
      'additionalUsers:',
      additionalUsers,
      'isYearly:',
      isYearly
    ); // ADDED LOGGING

    // 1. Validate Input
    if (!planId || !userId) {
      console.error('Missing planId or userId');
      return NextResponse.json(
        { error: 'Missing planId or userId' },
        { status: 400 }
      );
    }

    // 2. Determine Billing Cycle
    const billingCycle = isYearly ? 'yearly' : 'monthly';

    // 3. Look up Price ID
    const priceId = PRICE_IDS[planId]?.[billingCycle];
    if (!priceId) {
      console.error('Invalid planId or billingCycle:', planId, billingCycle);
      return NextResponse.json(
        { error: 'Invalid planId or billingCycle' },
        { status: 400 }
      );
    }

    // 4.  Additional User Price ID (conditionally)
    let additionalUserPriceId = null;
    if (planId === 'team' || planId === 'corporate') {
      additionalUserPriceId = ADDITIONAL_USER_PRICE_IDS[planId];
      if (!additionalUserPriceId) {
        console.warn('Additional user price ID not found for plan:', planId); // Warning, not an error
      }
    }

    // 5. Construct Line Items
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

    // 6. Get User Email from Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user from Supabase:', userError);
      return NextResponse.json(
        { error: 'Failed to get user from Supabase', details: userError.message },
        { status: 500 }
      );
    }

    // 7. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      customer_email: user?.email, // Use email from Supabase
      metadata: {
        userId: userId.toString(), // Ensure it's a string
        planId: planId,
        billingCycle: billingCycle,
        additionalUsers: additionalUsers || 0,
      },
    });

    console.log('Checkout session created successfully. Session ID:', session.id); // ADDED LOGGING

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
