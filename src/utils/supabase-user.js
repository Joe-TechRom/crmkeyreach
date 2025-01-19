import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let subscription = null; // Initialize subscription to null

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        } else {
          setUser(data);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUser();

    const authStateHandler = (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'SIGNED_OUT') {
        fetchUser();
      }
    };

    subscription = supabase.auth.onAuthStateChange(authStateHandler); // Assign the subscription object to subscription

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') { // Check if subscription is defined and has unsubscribe method
        subscription.unsubscribe();
      }
    };
  }, []);

  return { user, isLoading };
};
