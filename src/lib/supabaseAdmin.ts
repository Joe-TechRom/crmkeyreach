import { stripe } from '@/utils/stripe';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables.');
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined.');
}

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined.');
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Function to handle errors and log them (reusable)
const handleSupabaseError = (error: any, context: string) => {
  if (error) {
    console.error(`Supabase error in ${context}:`, error);
    throw new Error(`Supabase error in ${context}: ${error.message}`);
  }
};

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Database['public']['Tables']['products']['Insert'] = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabaseAdmin
    .from('products')
    .upsert([productData]); // No onConflict needed, upsert handles it
  handleSupabaseError(error, 'upsertProductRecord');
  console.log(`Product ${product.id} upserted successfully.`);
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Database['public']['Tables']['prices']['Insert'] = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : price.product.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]); // No onConflict needed
  handleSupabaseError(error, 'upsertPriceRecord');
  console.log(`Price ${price.id} upserted successfully.`);
};

export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', uuid)
      .maybeSingle(); // maybeSingle is safer

    if (error) {
        handleSupabaseError(error, 'createOrRetrieveCustomer - fetch');
    }


    if (!data?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          supabaseUUID: uuid,
        },
      });
      const { error: insertError } = await supabaseAdmin
        .from('customers')
        .insert([{ id: uuid, stripe_customer_id: customer.id }]);
      handleSupabaseError(insertError, 'createOrRetrieveCustomer - insert');

      console.log(`Customer ${customer.id} created and linked to Supabase UUID ${uuid}.`);
      return customer.id;
    }
    return data.stripe_customer_id;
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: customerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single(); // MUST use single() here

  if (customerError) {
    console.error(`Error fetching customer with Stripe ID ${customerId}:`, customerError);
    throw new Error(`Error fetching customer: ${customerError.message}`);
  }

  if (!customerData) {
      throw new Error(`Customer not found with Stripe ID: ${customerId}`);
  }

  const userId = customerData.id;

  // Retrieve the subscription from Stripe.
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });

  // Extract userCount and additionalUsers from subscription metadata.
  const userCount = parseInt(subscription.metadata.userCount || '1', 10);
  const additionalUsers = Math.max(0, userCount - 1); // Ensure it's not negative

    // Get price and product details
    const priceId = subscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId);
    const product = await stripe.products.retrieve(typeof price.product === 'string' ? price.product : price.product.id);

    // Upsert product and price records.
    await upsertProductRecord(product);
    await upsertPriceRecord(price);

  // Prepare subscription data for Supabase.
  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
    id: subscription.id,
    user_id: userId,
    status: subscription.status,
    metadata: subscription.metadata,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    created_at: new Date(subscription.created * 1000),
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  };

  // Upsert the subscription data.
  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);  // No onConflict needed
  handleSupabaseError(upsertError, 'manageSubscriptionStatusChange - upsert subscription');

  console.log(`Subscription ${subscription.id} ${createAction ? 'created' : 'updated'} for user ${userId}`);

  // Update the user's profile.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
        subscription_status: subscription.status,
        subscription_tier: subscription.metadata?.plan_type || null,
        billing_cycle: price.interval, // Use the interval from the price
        user_count: userCount,
        additional_users: additionalUsers,
        subscription_period_end: new Date(subscription.current_period_end * 1000),
        stripe_subscription_id: subscription.id,
    })
    .eq('user_id', userId);

  handleSupabaseError(profileError, 'manageSubscriptionStatusChange - update profile');
  console.log(`Profile updated for user ${userId}`);
};
