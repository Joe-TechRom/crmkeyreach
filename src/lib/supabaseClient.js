import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Function to create a client-side Supabase client
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
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Authentication-related methods (moved from supabase-auth.js)
export const signInWithFacebook = async (redirectTo) => {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}${redirectTo || '/auth/callback'}`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const supabase = createBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

export const onAuthStateChange = (callback) => {
  const supabase = createBrowserClient();
  return supabase.auth.onAuthStateChange(callback);
};

export const getSession = async () => {
  const supabase = createBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

export const refreshSession = async () => {
  const supabase = createBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();
  return { session, error };
};
