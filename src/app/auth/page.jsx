'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  VStack,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Flex,
  FormErrorMessage, // Import FormErrorMessage
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import supabase from '@/lib/supabaseClient';

export default function AuthPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(''); // State for email error
  const [passwordError, setPasswordError] = useState(''); // State for password error

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard'); // Or redirect to tier-specific dashboard
      }
    };
    checkAuth();
  }, [router]);

  const validateEmail = (email) => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Error',
            description: 'Invalid email or password',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw error; // Re-throw for generic error handling
        }
      } else {
        // Redirect to the appropriate dashboard based on user's tier
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', session.user.id)
            .single();

          const tier = profile?.subscription_tier || 'single_user';
          router.push(`/dashboard/${tier}`);
        } else {
          router.push('/dashboard'); // Fallback if session is somehow missing
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="7xl" py={20}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack spacing={8}>
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Welcome Back
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color={useColorModeValue('gray.600', 'gray.300')}>
              Access your dashboard and continue your journey
            </Text>
          </Stack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            rounded="xl"
            shadow="xl"
            p={8}
          >
            <form onSubmit={handleSignIn}>
              <VStack spacing={6}>
                <FormControl isRequired isInvalid={!!emailError}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                  {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                </FormControl>

                <FormControl isRequired isInvalid={!!passwordError}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Signing In"
                >
                  Sign In
                </Button>

                <Flex align="center" w="full">
                  <Box flex="1" h="1px" bg="gray.300" />
                  <Text px={4} color="gray.500">or</Text>
                  <Box flex="1" h="1px" bg="gray.300" />
                </Flex>

                <Button
                  w="full"
                  onClick={() => handleOAuth('google')}
                  variant="outline"
                  leftIcon={<FcGoogle />}
                >
                  Continue with Google
                </Button>

                <Button
                  variant="link"
                  onClick={() => router.push('/auth/signup')}
                  color="blue.400"
                >
                  Don't have an account? Sign Up
                </Button>
              </VStack>
            </form>
          </Box>
        </motion.div>
      </SimpleGrid>
    </Container>
  );
}
