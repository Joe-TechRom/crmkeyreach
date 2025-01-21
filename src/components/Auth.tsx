'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { useUser } from '@/lib/hooks/useUser';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user, isAuthenticated, setUser } = useUser();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkSubscriptionAndRedirect = async () => {
      if (isAuthenticated && user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_status')
          .eq('id', user.id)
          .single();

        const returnTo = searchParams.get('return_to');
        
        if (profile?.subscription_status === 'active') {
          const dashboardRoutes = {
            single_user: '/dashboard/single-user',
            team: '/dashboard/team',
            corporate: '/dashboard/corporate'
          };
          router.push(returnTo || dashboardRoutes[profile.subscription_tier]);
        } else {
          router.push(`/checkout?session_id=${user.id}&tier=${profile?.subscription_tier}`);
        }
      }
    };

    checkSubscriptionAndRedirect();
  }, [isAuthenticated, user]);

  const handleAuthResponse = async (response, action) => {
    const { data, error } = response;
    
    if (error) {
      toast({
        title: `Error ${action}`,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }

    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userWithData = {
        id: data.user.id,
        email: data.user.email,
        subscription_tier: profile?.subscription_tier || 'single_user',
        subscription_status: profile?.subscription_status || 'trialing',
        ...profile
      };

      setUser(userWithData);
      return userWithData;
    }
    return null;
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      await handleAuthResponse(response, 'signing in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithEmail = async () => {
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      const userData = await handleAuthResponse(response, 'signing in');
      if (userData) {
        if (userData.subscription_status === 'active') {
          const dashboardRoutes = {
            single_user: '/dashboard/single-user',
            team: '/dashboard/team',
            corporate: '/dashboard/corporate'
          };
          router.push(dashboardRoutes[userData.subscription_tier]);
        } else {
          router.push(`/checkout?session_id=${userData.id}&tier=${userData.subscription_tier}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithEmail = async () => {
    setLoading(true);
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      const userData = await handleAuthResponse(response, 'signing up');
      if (userData) {
        router.push(`/checkout?session_id=${userData.id}&tier=single_user`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      p={4}
    >
      <VStack spacing={6} width={{ base: '100%', md: '400px' }}>
        <Button
          isLoading={loading}
          loadingText="Signing in with Google"
          onClick={handleSignInWithGoogle}
          colorScheme="blue"
          width="100%"
          size="lg"
        >
          Sign in with Google
        </Button>
        <Divider />
        
        <Text textAlign="center" color="gray.500">
          Or sign in with email
        </Text>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
          />
        </FormControl>
        <Stack direction="row" spacing={4} width="100%">
          <Button
            isLoading={loading}
            loadingText="Signing in"
            onClick={handleSignInWithEmail}
            colorScheme="blue"
            flex={1}
            size="lg"
          >
            Sign In
          </Button>
          <Button
            isLoading={loading}
            loadingText="Signing up"
            onClick={handleSignUpWithEmail}
            colorScheme="green"
            flex={1}
            size="lg"
          >
            Sign Up
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
}
