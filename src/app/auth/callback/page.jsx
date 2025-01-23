'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL
        const code = searchParams.get('code');
        const tier = searchParams.get('tier') || 'single_user';

        if (code) {
          // Exchange code for session
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (sessionError) throw sessionError;

          if (data?.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('subscription_status, subscription_tier')
              .eq('id', data.user.id)
              .single();

            // Determine redirect path based on subscription status
            if (profile?.subscription_status === 'active') {
              const userTier = profile?.subscription_tier || tier;
              router.push(`/dashboard/${userTier}`);
            } else {
              router.push(`/checkout?session_id=${data.user.id}&tier=${tier}`);
            }
          }
        } else {
          // No code present, redirect to login
          router.push('/auth');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError(error.message);
        // Wait briefly before redirecting on error
        setTimeout(() => router.push('/auth'), 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="red.500">Authentication error. Redirecting...</Text>
          <Spinner size="xl" color="blue.500" />
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Text>Finalizing authentication...</Text>
        <Spinner size="xl" color="blue.500" />
      </VStack>
    </Box>
  );
}
