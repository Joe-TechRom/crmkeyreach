import { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getDashboardRoute(user: User | null): Promise<string> {
  if (!user) {
    return '/signup';
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return '/signup';
  }

  const tier = data?.subscription_tier;

  if (tier === 'single_user') {
    return '/dashboard/single-user';
  } else if (tier === 'team') {
    return '/dashboard/team';
  } else if (tier === 'corporate') {
    return '/dashboard/corporate';
  } else {
    return '/dashboard/free';
  }
}

// Add the new redirectDashboard function that leverages your existing logic
export async function redirectDashboard(user: User | null): Promise<string> {
  const route = await getDashboardRoute(user);
  return route;
}
