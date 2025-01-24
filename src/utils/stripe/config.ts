// /src/utils/stripe/config.ts
import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    apiVersion: '2023-10-16', // Use a specific API version
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'KeyReach CRM', // Update with your app name
      version: '0.1.0', // Update with your app version
      url: 'http://localhost:3000', // Update with your app URL
    },
  }
);
