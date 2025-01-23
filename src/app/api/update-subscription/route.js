// src/app/api/update-subscription/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin access
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req) {
  try {
    const {
      userId,
      planId,
      subscriptionId,
      customerId,
      billingCycle,
      additionalUsers,
    } = await req.json();

    console.log(
      'Updating subscription for userId:',
      userId,
      'planId:',
      planId,
      'subscriptionId:',
      subscriptionId,
      'customerId:',
      customerId,
      'billingCycle:',
      billingCycle,
      'additionalUsers:',
      additionalUsers
    );

    // 1. Validate Input (important for security)
    if (!userId || !planId || !subscriptionId || !customerId) {
      console.error('Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 2. Calculate subscription_period_end (example: add 1 month for monthly, 1 year for yearly)
    let subscriptionPeriodEnd;
    const now = new Date();
    if (billingCycle === 'monthly') {
      subscriptionPeriodEnd = new Date(now.setMonth(now.getMonth() + 1));
    } else if (billingCycle === 'yearly') {
      subscriptionPeriodEnd = new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      console.warn('Invalid billing cycle:', billingCycle);
      subscriptionPeriodEnd = null; // Or handle differently
    }

    // 3. Update the profiles table in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active', // Or 'trialing', depending on your logic
        plan_type: planId,
        stripe_customer_id: customerId,
        subscription_tier: planId, // Assuming planId maps directly to tier
        subscription_id: subscriptionId, // Store the Stripe subscription ID
        subscription_period_end: subscriptionPeriodEnd
          ? subscriptionPeriodEnd.toISOString()
          : null,
      })
      .eq('user_id', userId) // Use user_id to identify the profile
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.warn('No profile found for user ID:', userId);
      return NextResponse.json(
        { error: 'No profile found for user' },
        { status: 404 }
      );
    }

    console.log('Profile updated successfully:', data);
    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in update-subscription route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
