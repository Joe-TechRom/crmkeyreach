import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(priceId, planId, billingType) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, planId, billingType }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
}
