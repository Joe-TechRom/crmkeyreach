
import { supabase } from '@/lib/supabaseClient';

/**
 * Creates a new subscription record in the database.
 *
 * @param {string} stripeSubscriptionId - The Stripe subscription ID.
 * @param {object} otherSubscriptionData - An object containing other subscription data.
 * @returns {Promise<object|null>} - A promise that resolves to the created subscription data or null if an error occurs.
 */
export async function createSubscription(stripeSubscriptionId, otherSubscriptionData = {}) {
  try {
    // 1. Get the current user
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      return null; // Return null to indicate failure
    }

    if (!user) {
      console.error("No user found");
      return null; // Return null to indicate failure
    }

    // 2. Insert subscription data with the user ID
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id, // Automatically populate user_id
        stripe_subscription_id: stripeSubscriptionId,
        status: 'active', // Default status
        ...otherSubscriptionData, // Spread other subscription data
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error("Error inserting subscription:", subscriptionError);
      return null; // Return null to indicate failure
    }

    console.log("Subscription created:", subscriptionData);
    return subscriptionData; // Return the created subscription data
  } catch (error) {
    console.error("Error creating subscription:", error);
    return null; // Return null to indicate failure
  }
}
