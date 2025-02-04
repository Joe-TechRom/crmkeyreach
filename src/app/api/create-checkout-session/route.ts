import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Get user session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { priceId } = await request.json();
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: {
        userId: session.user.id
      },
      customer_email: session.user.email
    });

    return Response.json({ sessionId: checkoutSession.id });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
