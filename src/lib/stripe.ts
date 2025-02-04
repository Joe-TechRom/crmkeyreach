import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Stripe secret key is not defined in environment variables.');
  throw new Error('Stripe secret key is not defined.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});
