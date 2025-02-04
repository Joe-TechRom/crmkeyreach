'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Card, Heading, Text, VStack, Spinner, Box } from '@chakra-ui/react';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { session } = useSessionContext();

  useEffect(() => {
    const processSubscription = async () => {
      setLoading(true);

      try {
        if (!session) {
          console.log('No session found, redirecting to signin');
          const returnUrl = encodeURIComponent(`/payment/success?session_id=${sessionId}`);
          router.push(`/auth/signin?redirect=${returnUrl}`);
          return;
        }

        if (!sessionId) {
          console.log('No session ID found');
          router.push('/');
          return;
        }

        const response = await fetch('/api/stripe/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setSubscriptionData(data.profileData);
      } catch (error) {
        console.error('Subscription processing error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    processSubscription();
  }, [sessionId, router, session, supabase]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" p={4}>
      <Card p={8} maxW="md" w="full" textAlign="center">
        <VStack spacing={6}>
          <Heading size="lg">🎉 Welcome to KeyReach!</Heading>
          <Text fontSize="xl">Thank you for your subscription</Text>
          
          <VStack spacing={2} align="start" w="full">
            <Text>Plan: {subscriptionData?.subscription_tier || 'Loading...'}</Text>
            <Text>Billing: {subscriptionData?.billing_cycle || 'Loading...'}</Text>
            <Text>Status: {subscriptionData?.subscription_status || 'Loading...'}</Text>
          </VStack>

          <Text fontSize="sm" color="gray.500">
            Your subscription is now active and ready to use
          </Text>
        </VStack>
      </Card>
    </Box>
  );
}
