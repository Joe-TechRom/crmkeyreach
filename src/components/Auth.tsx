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
    if (isAuthenticated) {
      const returnTo = searchParams.get('return_to');
      const userTier = user?.tier || 'single-user';
      router.push(returnTo || `/dashboard/${userTier}`);
    }
  }, [isAuthenticated, router, searchParams, user]);

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
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        toast({
          title: 'Error fetching user data',
          description: userError.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return null;
      }

      const userWithData = {
        id: data.user.id,
        email: data.user.email,
        ...userData,
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
        const returnTo = searchParams.get('return_to');
        const userTier = user?.tier || 'single-user';
        router.push(returnTo || `/dashboard/${userTier}`);
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
        const returnTo = searchParams.get('return_to');
        const userTier = user?.tier || 'single-user';
        router.push(returnTo || `/dashboard/${userTier}`);
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
