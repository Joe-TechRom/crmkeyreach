'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient'; // Import client-side client
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Flex,
  Circle,
  HStack,
  useToast,
  Input,
  FormControl,
  FormLabel,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { MdSync, MdDevices, MdSecurity, MdSpeed } from 'react-icons/md';
import { motion } from 'framer-motion';
import useUser from '@/lib/hooks/useUser';
import { redirectDashboard } from '@/lib/utils/dashboard';

const MotionBox = motion(Box);

const SignInContent = () => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const { user, loading: userLoading } = useUser();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!userLoading && user) {
        setRedirecting(true);
        await redirectDashboard(user).finally(() => setRedirecting(false));
      }
    };
    handleRedirect();
  }, [user, userLoading]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        },
      });
      if (error) throw error;
      router.push('/checkout');
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/checkout');
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: MdSync, title: 'Real-time Sync', description: 'Instant data synchronization across devices' },
    { icon: MdSecurity, title: 'Secure Access', description: 'Enterprise-grade security protocols' },
    { icon: MdSpeed, title: 'Fast Performance', description: 'Optimized for speed and reliability' },
    { icon: MdDevices, title: 'Multi-device', description: 'Seamless experience across all platforms' },
  ];

  return (
    <Container maxW="7xl" py={20}>
      <Stack spacing={16} align="center">
        <VStack spacing={6} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Welcome to KeyReach CRM
            </Heading>
          </MotionBox>
          <Text fontSize="xl" color={textColor}>
            Your all-in-one solution for real estate management
          </Text>
        </VStack>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={10} w="full" justify="center">
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            w={{ base: 'full', lg: '40%' }}
          >
            <Box
              bg={bgColor}
              rounded="2xl"
              shadow="2xl"
              p={8}
              borderWidth="1px"
              borderColor="gray.100"
              _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
              transition="all 0.3s"
            >
              <VStack spacing={6}>
                <VStack spacing={4}>
                  <Heading size="lg">Sign In</Heading>
                  <Text color={textColor}>
                    Access your workspace securely
                  </Text>
                </VStack>
                <form onSubmit={handleEmailSignIn} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Flex justify="flex-end" mt={2}>
                        <Button
                          variant="link"
                          color="blue.400"
                          size="sm"
                          onClick={() => router.push('/auth/reset-password')}
                        >
                          Forgot Password?
                        </Button>
                      </Flex>
                    </FormControl>
                    <Button
                      type="submit"
                      w="full"
                      size="lg"
                      colorScheme="blue"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                    >
                      Sign in with Email
                    </Button>
                  </VStack>
                </form>
                <HStack w="full">
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <Button
                  w="full"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  leftIcon={<FcGoogle />}
                  variant="outline"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Google
                </Button>
              </VStack>
            </Box>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            w={{ base: 'full', lg: '50%' }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={6}
                  bg={bgColor}
                  rounded="xl"
                  shadow="lg"
                  _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
                  transition="all 0.3s"
                >
                  <VStack align="start" spacing={4}>
                    <Circle size="40px" bg="blue.50">
                      <Icon as={feature.icon} w={5} h={5} color="blue.500" />
                    </Circle>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold">{feature.title}</Text>
                      <Text color={textColor} fontSize="sm">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Flex>
      </Stack>
      {redirecting && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          zIndex="9999"
        >
          <Spinner size="xl" color="white" />
        </Box>
      )}
    </Container>
  );
};

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <Container maxW="7xl" py={20}>
          <VStack spacing={16}>
            <Stack spacing={8} textAlign="center">
              <Heading size="2xl">Loading...</Heading>
            </Stack>
          </VStack>
        </Container>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
