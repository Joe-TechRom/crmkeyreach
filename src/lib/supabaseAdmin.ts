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

// Function to handle errors and log them
const handleSupabaseError = (error: any, context: string) => {
  if (error) {
    console.error(`Supabase error in ${context}:`, error);
    throw new Error(`Supabase error in ${context}: ${error.message}`);
  }
};

export const upsertProductRecord = async (product: Stripe.Product) => {
  try {
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
      .upsert([productData], { onConflict: ['id'] });

    if (error) {
      console.error(`Supabase error in upsertProductRecord:`, error);
      throw new Error(`Supabase error in upsertProductRecord: ${error.message}`);
    }

    console.log(`Product ${product.id} upserted successfully.`);
  } catch (error: any) {
    console.error('Error upserting product record:', error);
    throw error;
  }
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  try {
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
      .upsert([priceData], { onConflict: ['id'] });

    if (error) {
      console.error(`Supabase error in upsertPriceRecord:`, error);
      throw new Error(`Supabase error in upsertPriceRecord: ${error.message}`);
    }

    console.log(`Price ${price.id} upserted successfully.`);
  } catch (error: any) {
    console.error('Error upserting price record:', error);
    throw error;
  }
};

export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', uuid)
      .maybeSingle(); // Changed from single() to maybeSingle()

    // If no customer exists, create one
    if (!data?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          supabaseUUID: uuid,
        },
      });
      const { error: insertError } = await supabaseAdmin
        .from('customers')
        .insert([{ id: uuid, stripe_customer_id: customer.id }]);
      if (insertError) throw insertError;
      console.log(`Customer ${customer.id} created and linked to Supabase UUID ${uuid}.`);
      return customer.id;
    }
    return data.stripe_customer_id;
  } catch (error: any) {
    console.error('Error creating or retrieving customer:', error);
    throw error;
  }
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  try {
    // Fetch subscription and related data from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    // Get price and product details from Stripe
    const price = await stripe.prices.retrieve(priceId);
    const product = await stripe.products.retrieve(price.product as string);

    // Create product and price records if they don't exist
    await upsertProductRecord(product);
    await upsertPriceRecord(price);

    const { data: customerData, error: noCustomerError } = await supabaseAdmin
      .from('customers')
      .select('id') // Select the user ID
      .eq('stripe_customer_id', customerId)
      .single(); // Use single() to get a single row

    if (noCustomerError) {
      console.error("Error fetching customer:", noCustomerError);
      throw noCustomerError;
    }
    if (!customerData) {
      throw new Error(`Customer not found with Stripe ID: ${customerId}`);
    }

    // Prepare subscription data
    const subscriptionData = {
      id: subscription.id,
      user_id: customerData.id,
      status: subscription.status,
      subscription_status: subscription.status,
      price_id: priceId,
      quantity: subscription.items.data[0].quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      created_at: new Date(subscription.created * 1000),
      ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      metadata: subscription.metadata
    };

    // Upsert the subscription
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .upsert([subscriptionData]);

    if (subscriptionError) {
      console.error("Error upserting subscription:", subscriptionError);
      throw subscriptionError;
    }

    // Update user profile if the subscription is active
    if (subscription.status === 'active') {
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('id', customerData.id);

      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError);
      } else {
        console.log(`Profile updated for user ${customerData.id}`);
      }
    }

    console.log(`Subscription ${subscription.id} ${createAction ? 'created' : 'updated'} for user ${customerData.id}`);

  } catch (error: any) {
    console.error('Error managing subscription status change:', error);
    throw error;
  }
};
