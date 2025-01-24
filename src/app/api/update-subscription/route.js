import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
      planType,
      billingCycle,
    } = await req.json();

    console.log(
      'Updating subscription for userId:',
      userId,
      'planType:',
      planType,
      'billingCycle:',
      billingCycle
    );

    if (!userId || !planType) {
      console.error('Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let subscriptionPeriodEnd;
    const now = new Date();

    if (billingCycle === 'monthly') {
      subscriptionPeriodEnd = new Date(now.setMonth(now.getMonth() + 1));
    } else if (billingCycle === 'yearly') {
      subscriptionPeriodEnd = new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      console.warn('Invalid billing cycle:', billingCycle);
      subscriptionPeriodEnd = null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: planType,
        subscription_period_end: subscriptionPeriodEnd
          ? subscriptionPeriodEnd.toISOString()
          : null,
      })
      .eq('user_id', userId)
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
