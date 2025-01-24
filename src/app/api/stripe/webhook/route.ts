// src/app/api/stripe/webhook/route.js
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'customer.created':
      // Handle customer created event
      console.log('Customer Created Event:', event.data.object);
      const customer = event.data.object;
      const userId = customer.metadata?.userId;
      if (userId) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customer.id,
            })
            .eq('user_id', userId);
          if (error) {
            console.error('Error updating customer ID:', error);
          }
        } catch (error) {
          console.error('Error updating customer ID:', error);
        }
      } else {
        console.error('Invalid or missing User ID in session metadata:', customer.metadata);
      }
      break;
    case 'customer.subscription.created':
      // Handle subscription created event
      console.log('Subscription Created Event:', event.data.object);
      const subscription = event.data.object;
      const userIdSub = subscription.metadata?.userId;
      if (userIdSub) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              stripe_subscription_id: subscription.id,
            })
            .eq('user_id', userIdSub);
          if (error) {
            console.error('Error updating subscription ID:', error);
          }
        } catch (error) {
          console.error('Error updating subscription ID:', error);
        }
      } else {
        console.error('Invalid or missing User ID in session metadata:', subscription.metadata);
      }
      break;
    case 'customer.subscription.updated':
      // Handle subscription updated event
      console.log('Subscription Updated Event:', event.data.object);
      break;
    case 'checkout.session.completed':
      // Handle checkout session completed event
      console.log('Checkout Session Completed Event Metadata:', event.data.object.metadata);
      break;
    case 'payment_intent.succeeded':
      // Handle payment intent succeeded event
      console.log('Payment Intent Succeeded Event:', event.data.object);
      break;
    case 'payment_intent.created':
      // Handle payment intent created event
      console.log('Payment Intent Created Event:', event.data.object);
      break;
    case 'invoice.created':
      // Handle invoice created event
      console.log('Invoice Created Event:', event.data.object);
      break;
    case 'invoice.finalized':
      // Handle invoice finalized event
      console.log('Invoice Finalized Event:', event.data.object);
      break;
    case 'charge.succeeded':
      // Handle charge succeeded event
      console.log('Charge Succeeded Event:', event.data.object);
      break;
    case 'invoice.updated':
      // Handle invoice updated event
      console.log('Invoice Updated Event:', event.data.object);
      break;
    case 'invoice.paid':
      // Handle invoice paid event
      console.log('Invoice Paid Event:', event.data.object);
      break;
    case 'invoice.payment_succeeded':
      // Handle invoice payment succeeded event
      console.log('Invoice Payment Succeeded Event:', event.data.object);
      break;
    case 'payment_method.attached':
      // Ignore payment method attached event
      console.log('Payment Method Attached Event Ignored:', event.data.object);
      break;
    case 'customer.updated':
      // Ignore customer updated event
      console.log('Customer Updated Event Ignored:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
