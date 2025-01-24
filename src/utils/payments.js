const PRICE_IDS = {
  single_user: {
    monthly: 'price_1Qh2SzCXsI8HJmkTjmfrGRcl',
    yearly: 'price_1Qh2ThCXsI8HJmkT14vc4M6j',
  },
  team: {
    monthly: 'price_1Qh2VLCXsI8HJmkTlYgczg6W',
    yearly: 'price_1Qh2VkCXsI8HJmkTRBBLd0dv',
    additionalUserMonthly: 'price_1Qh2WKCXsI8HJmkTa5KXjIic',
    additionalUserYearly: 'price_1Qi1WDCXsI8HJmkTdGwrnyHE',
  },
  corporate: {
    monthly: 'price_1Qh2XjCXsI8HJmkTASiB8nZz',
    yearly: 'price_1Qh2Y2CXsI8HJmkTYmIxLnmB',
    additionalUserMonthly: 'price_1Qi1a7CXsI8HJmkTcnoDrCzr',
    additionalUserYearly: 'price_1QfpfCCXsI8HJmkTuzytJvFP',
  },
};

export async function createCheckoutSession(
  planId,
  isYearly = false,
  additionalUsers = 0,
  userId // Add userId as a parameter
) {
  try {
    // Get the correct price ID based on plan and billing interval
    const plan = PRICE_IDS[planId];
    const billingType = isYearly ? 'yearly' : 'monthly';
    let priceId = plan[billingType];

    // Handle additional users
    let additionalUserPriceId = null;
    if (additionalUsers > 0 && plan.additionalUserMonthly) {
      additionalUserPriceId = isYearly ? plan.additionalUserYearly : plan.additionalUserMonthly;
    }

    console.log('Checkout Details:', {
      planId,
      billingType,
      priceId,
      additionalUsers,
      additionalUserPriceId,
      userId, // Log the userId
    });

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        additionalUserPriceId,
        additionalUsers,
        userId, // Include userId in the request body
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || 'API request failed';
      console.error('Checkout API Error:', message);
      throw new Error(message);
    }

    return data; // Return the data object containing the url
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}
