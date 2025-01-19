import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const { data: authUser, error: authError } = await supabaseAdmin
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .eq('email', session.customer_details.email)
        .single();

      if (authError || !authUser) {
        console.error('Error fetching user from auth:', authError);
        return new NextResponse('Error fetching user from auth', { status: 500 });
      }

      const { id: userId, raw_user_meta_data } = authUser;
      const name = raw_user_meta_data?.name || null;
      const phoneNumber = raw_user_meta_data?.phoneNumber || null;

      const { data: existingUser, error: selectError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (selectError) {
        console.error('Error checking for existing user:', selectError);
        return new NextResponse('Error checking for existing user', { status: 500 });
      }

      if (!existingUser) {
        const { error: insertError } = await supabaseAdmin.from('users').insert({
          id: userId,
          email: session.customer_details.email,
          name: name,
          phone_number: phoneNumber,
          tier: raw_user_meta_data?.selectedPlan || 'basic',
        });

        if (insertError) {
          console.error('Error inserting user:', insertError);
          return new NextResponse('Error inserting user', { status: 500 });
        }
        console.log(`User created: ${userId}`);
      } else {
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            email: session.customer_details.email,
            name: name,
            phone_number: phoneNumber,
            tier: raw_user_meta_data?.selectedPlan || 'basic',
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating user:', updateError);
          return new NextResponse('Error updating user', { status: 500 });
        }
        console.log(`User updated: ${userId}`);
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
}
