export const subscriptionPlans = {
  singleUser: {
    id: 'single_user',
    name: 'Single User',
    price: 49.99,
    features: [
      'All core CRM features',
      'Lead CRUD operations',
      'Lead stage tracking',
      'Property tracking',
      'Ad creation tools',
      'Multi-platform posting',
      'Email integration',
      'Basic reporting',
      'Social Media Integration'
    ],
  },
  team: {
    id: 'team',
    name: 'Team',
    price: 99.99,
    popular: true,
    features: [
      'Everything in Single User, plus:',
      'Up to 20 team members',
      'Team member assignment',
      'Team collaboration tools',
      'Performance analytics',
      'Advanced reporting',
      'API access',
      'Priority support',
      '$10/month per additional user'
    ],
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    price: 195.99,
    features: [
      'Everything in Team, plus:',
      'Up to 150 team members',
      'Enterprise-grade security',
      'Custom integrations',
      'Dedicated account manager',
      'Custom analytics dashboard',
      'White-label options',
      'SLA guarantees',
      'Premium support 24/7',
      'Onboarding assistance',
      '$7.99/month per additional user'
    ],
  }
};
