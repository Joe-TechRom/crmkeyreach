// src/pages/api/stripe/get-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { sessionId } = req.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'subscription', 'subscription.plan.product'],
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      const subscription = session.subscription;
      const plan = subscription.plan;
      const product = plan.product;

      res.status(200).json({
        plan: {
          ...plan,
          product: {
            ...product,
            metadata: product.metadata,
          },
        },
        customer: session.customer_details,
        line_items: session.line_items,
      });
    } catch (error) {
      console.error('Error retrieving session:', error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    res.status(405).end();
  }
}
