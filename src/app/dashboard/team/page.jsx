'use client';

import { useState, useEffect } from 'react';
import { Button, useToast, Box, Heading, Text, Flex, Spinner } from '@chakra-ui/react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const TeamDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      if (error || !authUser) {
        router.push('/login');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError || !userData) {
        router.push('/login');
        return;
      }

      setUser(userData);
    };

    fetchUser();
  }, [supabase, router]);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create portal session');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create portal session',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={4}>Welcome, {user.name}!</Heading>
      <Text mb={4}>You are on the Team plan.</Text>
      <Button
        onClick={handleManageSubscription}
        isLoading={isLoading}
        loadingText="Loading..."
        colorScheme="blue"
      >
        Manage Subscription
      </Button>
    </Box>
  );
};

export default TeamDashboardPage;
