import supabase from '@/lib/supabaseClient';

/**
 * Fetches the subscription status from the profiles table.
 *
 * @param {string} userId - The user ID.
 * @returns {Promise<object|null>} - A promise that resolves to the subscription data or an error object.
 */
export async function getSubscriptionFromProfile(userId) {
  try {
    // 1. Fetch the user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_tier, subscription_period_end, stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return { error: "Error fetching profile", details: profileError };
    }

    if (!profile) {
      console.error("No profile found for user:", userId);
      return { error: "No profile found for user" };
    }

    console.log("Subscription fetched from profile:", profile);
    return profile; // Return the profile data
  } catch (error) {
    console.error("Error fetching subscription from profile:", error);
    return { error: "Error fetching subscription from profile", details: error };
  }
}


/**
 * Updates the subscription record in the profiles table.
 *
 * @param {string} userId - The user ID.
 * @param {object} subscriptionData - An object containing subscription data.
 * @returns {Promise<object|null>} - A promise that resolves to the updated profile data or an error object.
 */
export async function updateSubscriptionInProfile(userId, subscriptionData = {}) {
  try {
    // 1. Update subscription data in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        ...subscriptionData, // Spread subscription data
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return { error: "Error updating profile", details: profileError };
    }

    console.log("Subscription updated in profile:", profileData);
    return profileData; // Return the updated profile data
  } catch (error) {
    console.error("Error updating subscription in profile:", error);
    return { error: "Error updating subscription in profile", details: error };
  }
}
