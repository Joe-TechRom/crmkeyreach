import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

const PRICE_IDS = {
  team: {
    monthly: 'price_1Qh2VLCXsI8HJmkTlYgczg6W',
    yearly: 'price_1Qh2VkCXsI8HJmkTRBBLd0dv'
  },
  single_user: {
    monthly: 'price_1Qh2SzCXsI8HJmkTjmfrGRcl',
    yearly: 'price_1Qh2ThCXsI8HJmkT14vc4M6j'
  },
  corporate: {
    monthly: 'price_1Qh2XjCXsI8HJmkTASiB8nZz',
    yearly: 'price_1Qh2Y2CXsI8HJmkTYmIxLnmB'
  }
};

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export async function createCheckoutSession(planId, isYearly = false) {
  try {
    const stripe = await getStripe();
    
    // Get the correct price ID based on plan and billing interval
    const plan = PRICE_IDS[planId];
    const billingType = isYearly ? 'yearly' : 'monthly';
    const priceId = plan[billingType];

    console.log('Checkout Details:', {
      planId,
      billingType,
      priceId
    });

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        planId,
        billingType
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}
