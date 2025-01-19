import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const supabaseSession = cookieStore.get('sb-access-token');

    if (!supabaseSession) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(supabaseSession.value);

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return new NextResponse('Error fetching user', { status: 500 });
    }

    const { data: userData, error: userDataError } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData || !userData.stripe_customer_id) {
      console.error('Error fetching user data:', userDataError);
      return new NextResponse('Error fetching user data', { status: 500 });
    }

    const { stripe_customer_id } = userData;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return new NextResponse('Error creating portal session', { status: 500 });
  }
}
