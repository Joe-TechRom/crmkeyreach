import { createBrowserClient } from '@/lib/supabaseClient';

export const createCheckoutSession = async (plan, isYearly) => {
  try {
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: isYearly ? plan.yearlyPriceId : plan.monthlyPriceId,
        planName: plan.name,
        isYearly,
        additionalUsers: 0, // You might want to adjust this based on your logic
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    const { sessionId } = await res.json();
    return { sessionId };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
