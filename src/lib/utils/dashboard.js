import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export async function redirectDashboard(user) {
  console.log("redirectDashboard called with user:", user);

  if (!user) {
    console.log("No user found, returning");
    return;
  }

  const hasActiveSubscription = await checkUserSubscription(user.id);
  console.log("hasActiveSubscription:", hasActiveSubscription);

  if (hasActiveSubscription) {
    console.log("Redirecting to dashboard");
    redirect('/dashboard');
  } else {
    console.log("Redirecting to pricing");
    redirect('/pricing');
  }
}

async function checkUserSubscription(userId) {
  console.log("checkUserSubscription called with userId:", userId);
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    console.log("Subscription data:", data, "error:", error);

    if (error) {
      console.error("Error fetching subscription:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}
