import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a client-side Supabase client instance
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'keyreach-auth-key',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

// Function to create a server-side Supabase client
export const createServerClient = (cookie?: string): SupabaseClient | null => {
  if (!supabaseServiceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        ...(cookie ? { 'Cookie': cookie } : {}),
      },
    },
  });
};

// Export types for convenience
export type Supabase = Awaited<ReturnType<typeof createBrowserClient>>;

// Authentication-related methods (moved from supabase-auth.js)
export const signInWithFacebook = async (browserClient: SupabaseClient, redirectTo: string) => {
  const { data, error } = await browserClient.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}${redirectTo || '/auth/callback'}`,
    },
  });
  return { data, error };
};

export const signOut = async (browserClient: SupabaseClient) => {
  const { error } = await browserClient.auth.signOut();
  return { error };
};

export const getCurrentUser = async (browserClient: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await browserClient.auth.getUser();
  return { user, error };
};

export const onAuthStateChange = async (browserClient: SupabaseClient, callback: any) => {
  return browserClient.auth.onAuthStateChange(callback);
};

export const getSession = async (browserClient: SupabaseClient) => {
  const {
    data: { session },
    error,
  } = await browserClient.auth.getSession();
  return { session, error };
};

export const refreshSession = async (browserClient: SupabaseClient) => {
  const {
    data: { session },
    error,
  } = await browserClient.auth.refreshSession();
  return { session, error };
};
