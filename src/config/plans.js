export const subscriptionPlans = {
  single_user: {
    id: 'single_user',
    name: 'Single User',
    monthlyPrice: '49.99',
    yearlyPrice: '539.89',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_YEARLY,
    features: [
      { text: 'All core CRM features', included: true },
      { text: 'Lead CRUD operations', included: true },
      { text: 'Lead stage tracking', included: true },
      { text: 'Property tracking', included: true },
      { text: 'Ad creation tools', included: true },
      { text: 'Multi-platform posting', included: true },
      { text: 'Email integration', included: true },
      { text: 'Basic reporting', included: true },
      { text: 'Social Media Integration', included: true },
    ],
  },
  team: {
    id: 'team',
    name: 'Team',
    monthlyPrice: '99.99',
    yearlyPrice: '1079.89',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY,
    additionalUserMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_ADDITIONAL_USER_MONTHLY,
    additionalUserYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_ADDITIONAL_USER_YEARLY,
    popular: true,
    additionalUserPrice: 10.00,
    features: [
      { text: 'Everything in Single User, plus:', included: true },
      { text: 'Up to 20 team members', included: true },
      { text: 'Team member assignment', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'Performance analytics', included: true },
      { text: 'Advanced reporting', included: true },
      { text: 'API access', included: true },
      { text: 'Priority support', included: true },
      { text: 'Additional Users ($10/month each)', included: true },
    ],
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    monthlyPrice: '195.99',
    yearlyPrice: '2116.99',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_YEARLY,
    additionalUserMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_ADDITIONAL_USER_MONTHLY,
    additionalUserYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_ADDITIONAL_USER_YEARLY,
    additionalUserPrice: 7.99,
    features: [
      { text: 'Everything in Team, plus:', included: true },
      { text: 'Up to 150 team members', included: true },
      { text: 'Enterprise-grade security', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom analytics dashboard', included: true },
      { text: 'White-label options', included: true },
      { text: 'SLA guarantees', included: true },
      { text: 'Premium support 24/7', included: true },
      { text: 'Onboarding assistance', included: true },
      { text: 'Additional Users ($7.99/month each)', included: true },
    ],
  },
};
