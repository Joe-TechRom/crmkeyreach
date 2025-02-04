import { createBrowserClient } from '@/lib/supabaseClient';

export const PRICE_IDS = {
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

export const createCheckoutSession = async (priceId) => {
  const supabase = createBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Authentication required for checkout');
  }

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ priceId }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};