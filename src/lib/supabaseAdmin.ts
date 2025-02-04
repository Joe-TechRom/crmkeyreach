import { stripe } from './stripe';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    persistSession: false
  }
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
      metadata: product.metadata
    };

    const { error } = await supabaseAdmin
      .from('products')
      .upsert([productData], { onConflict: ['id'] });

    handleSupabaseError(error, 'upsertProductRecord');
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
      metadata: price.metadata
    };

    const { error } = await supabaseAdmin
      .from('prices')
      .upsert([priceData], { onConflict: ['id'] });

    handleSupabaseError(error, 'upsertPriceRecord');
    console.log(`Price ${price.id} upserted successfully.`);
  } catch (error: any) {
    console.error('Error upserting price record:', error);
    throw error;
  }
};

export const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', uuid)
      .single();

    handleSupabaseError(error, 'createOrRetrieveCustomer - select');

    if (data?.stripe_customer_id) {
      return data.stripe_customer_id;
    }

    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        supabaseUUID: uuid
      }
    });

    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);

    handleSupabaseError(supabaseError, 'createOrRetrieveCustomer - insert');
    console.log(`Customer ${customer.id} created and linked to Supabase UUID ${uuid}.`);
    return customer.id;
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
    const { data: customerData, error: noCustomerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    handleSupabaseError(noCustomerError, 'manageSubscriptionStatusChange - customer lookup');

    if (!customerData) throw new Error(`Customer not found with Stripe ID: ${customerId}`);

    const { data: subscription, error: getSubscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .select('status, metadata')
      .eq('id', subscriptionId)
      .single();

    handleSupabaseError(getSubscriptionError, 'manageSubscriptionStatusChange - subscription lookup');

    const { data: priceData, error: getPriceError } = await supabaseAdmin
      .from('prices')
      .select('product_id')
      .eq('id', subscription.metadata.price_id)
      .single();

    handleSupabaseError(getPriceError, 'manageSubscriptionStatusChange - price lookup');

    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        user_id: customerData.id,
        status: subscription.status,
        product_id: priceData.product_id
      })
      .eq('id', subscriptionId);

    handleSupabaseError(subscriptionError, 'manageSubscriptionStatusChange - subscription update');

    console.log(`Subscription ${subscriptionId} updated for user ${customerData.id}.`);

    if (createAction && subscription) {
      console.log(`New subscription for customer ${customerId} created.`);
    }
  } catch (error: any) {
    console.error('Error managing subscription status change:', error);
    throw error;
  }
};
