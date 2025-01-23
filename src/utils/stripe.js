// /utils/stripe.js

import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const createCheckoutSession = async (priceId, userId, planId, billingCycle, additionalUsers) => {
  try {
    const stripe = await getStripe();

    // Make the API call to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, userId, planId, billingCycle, additionalUsers }),
    });
    const data = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};

export const createPortalSession = async () => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    window.location.href = data.url;
  } catch (error) {
    console.error('Error in createPortalSession:', error);
    throw error;
  }
};

export const formatAmountForStripe = (amount, currency) => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount, currency) => {
  return (amount / 100).toFixed(2);
};
