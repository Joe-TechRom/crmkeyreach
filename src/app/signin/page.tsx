'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Grid,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const SignInPage = () => {
  // Hooks at the top
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const supabase = useSupabaseClient();
  const router = useRouter();

  // Color modes
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };

  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const trimmedEmail = email.trim().toLowerCase();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
        return;
      }
      setError('Unable to sign in at this time. Please try again.');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      setError('Unable to load your profile. Please try again.');
      return;
    }

    await checkSubscriptionAndRedirect(authData.user.id);

  } catch (err) {
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

const checkSubscriptionAndRedirect = async (userId: string) => {
  try {
    console.log('Checking subscription status for user:', userId);
    
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        id,
        status,
        price_id,
        metadata,
        quantity
      `)
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    console.log('Current subscription:', subscription);

    if (subscription?.status === 'active' || subscription?.status === 'trialing') {
      const priceIdMap = {
        [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_MONTHLY]: 'single_user',
        [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE_USER_YEARLY]: 'single_user',
        [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY]: 'team',
        [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY]: 'team',
        [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_MONTHLY]: 'corporate',
        [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CORPORATE_YEARLY]: 'corporate'
      };

      const tier = priceIdMap[subscription.price_id];
      console.log('Determined tier:', tier);

      const dashboardRoutes = {
        single_user: '/dashboard/single-user',
        team: '/dashboard/team',
        corporate: '/dashboard/corporate'
      };

      const targetRoute = dashboardRoutes[tier] || '/dashboard/default';
      console.log('Redirecting to:', targetRoute);
      
      router.push(targetRoute);
      router.refresh();
    } else {
      console.log('No active subscription found');
      router.push('/dashboard/default');
    }

  } catch (err) {
    console.log('Subscription check error:', err);
    router.push('/dashboard/default');
  }
};

  return (
    <Box
      position="relative"
      overflow="hidden"
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />

      <Container maxW="7xl" position="relative" zIndex="1" px={{ base: 4, lg: 8 }} py={12}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10}>
            {/* Left side - Welcome content */}
            <motion.div variants={itemVariants}>
              <Stack spacing={8} py={12}>
                <Box
                  bg={bgColor}
                  backdropFilter="blur(10px)"
                  rounded="full"
                  px={5}
                  py={3}
                  width="fit-content"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    bgGradient={colors.orange.gradient}
                    bgClip="text"
                  >
                    👋 Welcome Back!
                  </Text>
                </Box>

                <Heading
                  fontSize={{ base: '4xl', md: '5xl' }}
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                >
                  Access Your KeyReach Dashboard
                </Heading>

                <Stack spacing={6}>
                  <Text fontSize="xl" color={subTextColor}>
                    Sign in to manage your real estate business efficiently
                  </Text>
                  
                  <Stack spacing={4}>
                    {[
                      '📊 View Your Analytics',
                      '📱 Access Mobile Dashboard',
                      '📈 Track Your Progress',
                      '🤝 Manage Client Relations'
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Text fontSize="lg" color={subTextColor}>{feature}</Text>
                      </motion.div>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </motion.div>

            {/* Right side - Sign in form */}
            <Card
              bg={bgColor}
              backdropFilter="blur(10px)"
              boxShadow="lg"
              border="1px solid"
              borderColor={borderColor}
              rounded="xl"
            >
              <CardBody>
                {error && (
                  <Alert status="error" mb={6} rounded="lg">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSignIn}>
                  <Stack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          size="lg"
                        />
                        <InputRightElement height="100%">
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <Button
                      size="lg"
                      bgGradient={colors.orange.gradient}
                      color="white"
                      isLoading={loading}
                      type="submit"
                      rightIcon={<ArrowForwardIcon />}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                    >
                      Sign In
                    </Button>
                  </Stack>
                </form>

                <Stack spacing={3} mt={6}>
                  <Text textAlign="center" color={subTextColor}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{ color: colors.orange.main }}>
                      Sign up
                    </Link>
                  </Text>
                  
                  <Text textAlign="center">
                    <Link 
                      href="/reset-password" 
                      style={{ 
                        color: colors.orange.main,
                        textDecoration: 'underline'
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignInPage;
