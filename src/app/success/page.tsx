'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiAward } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useRouter, useSearchParams } from 'next/navigation';
import { logError } from '@/lib/utils/log';
import supabase from '@/lib/supabaseClient';
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  Center,
  List,
  ListItem,
  useToast,
  Button,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
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
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    if (subscriptionData) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4299E1', '#FF9A5C', '#805AD5'],
      });
    }
  }, [subscriptionData]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!sessionId) {
        toast({
          title: 'Missing Session ID',
          description: 'Please return to the checkout page and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        router.push('/'); // Redirect to home if no session ID
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          logError('Session error:', sessionError.message, sessionError);
          toast({
            title: 'Authentication Error',
            description: 'Please sign in to view your subscription details.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
          router.push('/auth');
          return;
        }

        if (!session?.user?.id) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to view your subscription details.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
          router.push('/auth');
          return;
        }

        // Fetch Stripe Session and Update Profile
        const updateProfile = async () => {
          try {
            const response = await fetch('/api/get-stripe-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sessionId }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to retrieve Stripe session.');
            }

            const { session: stripeSession } = await response.json();

            const { userId, tier, additionalUsers } = stripeSession.metadata;

            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                subscription_tier: tier,
                additional_users: parseInt(additionalUsers),
                stripe_customer_id: stripeSession.customer,
                stripe_subscription_id: stripeSession.subscription?.id,
                subscription_period_end: stripeSession.subscription?.current_period_end ? new Date(stripeSession.subscription.current_period_end * 1000).toISOString() : null,
              })
              .eq('user_id', userId);

            if (updateError) {
              throw updateError;
            }

            // Fetch updated profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', userId)
              .single();

            if (profileError) {
              logError('Profile fetch error:', profileError.message, profileError);
              toast({
                title: 'Error Fetching Profile',
                description: 'Could not retrieve your subscription details. Please contact support.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
              });
              router.push('/'); // Redirect on error
              return;
            }

            setSubscriptionData(profileData);
            localStorage.removeItem('selectedTier');
            toast({
              title: '🎉 Subscription Activated!',
              description: 'Welcome to your premium subscription',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top',
            });

          } catch (error) {
            logError('Error updating profile:', error);
            toast({
              title: 'Error Activating Subscription',
              description: error.message || 'Failed to activate your subscription. Please contact support.',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top',
            });
            router.push('/'); // Redirect to home or an error page
          } finally {
            setLoading(false);
          }
        };

        await updateProfile();

      } catch (error) {
        logError('Error fetching subscription data:', error);
        toast({
          title: 'Error Verifying Session',
          description: 'Please contact support if the issue persists.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        router.push('/'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [sessionId, router, toast]);

  const handleGoToDashboard = () => {
    if (!subscriptionData) {
      toast({
        title: 'Subscription Details Missing',
        description: 'Please wait for the subscription details to load before navigating to the dashboard.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    const planType = subscriptionData?.plan_type;
    let dashboardRoute = '/dashboard'; // Default route

    switch (planType) {
      case 'single_user':
        dashboardRoute = '/dashboard/single-user';
        break;
      case 'team':
        dashboardRoute = '/dashboard/team';
        break;
      case 'corporate':
        dashboardRoute = '/dashboard/corporate';
        break;
      default:
        logError('Invalid plan type:', planType);
        toast({
          title: 'Invalid Plan Type',
          description: 'Could not determine the correct dashboard. Redirecting to default dashboard.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
    }
    router.push(dashboardRoute);
  };

  const renderPlanDetails = () => {
    if (!subscriptionData) return null;

    const planDetails = [
      { label: 'Full Name', value: subscriptionData.name || 'N/A' },
      { label: 'Plan', value: subscriptionData.subscription_tier || 'N/A' }, // Use subscription_tier
      { label: 'Billing Cycle', value: subscriptionData.billing_cycle || 'N/A' },
      { label: 'Status', value: subscriptionData.subscription_status || 'N/A' },
      { label: 'Email', value: subscriptionData.email || 'N/A' },
    ];

    return (
      <List spacing={4} w="full">
        {planDetails.map((item, index) => (
          <MotionBox key={index} variants={itemVariants}>
            <ListItem
              p={3}
              borderRadius="lg"
              bg={useColorModeValue('gray.50', 'gray.700')}
              color={textColor}
              transition="all 0.2s"
              _hover={{ transform: 'translateX(8px)' }}
            >
              <HStack justify="space-between">
                <Text fontWeight="medium">{item.label}</Text>
                <Text>{item.value}</Text>
              </HStack>
            </ListItem>
          </MotionBox>
        ))}
      </List>
    );
  };

  return (
    <AnimatePresence>
      <Center minH="100vh" bgGradient={gradientBg} p={4}>
        {loading ? (
          <VStack spacing={4}>
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={highlightColor}
            />
            <Text color={textColor} fontSize="lg" fontWeight="medium">
              Processing your subscription...
            </Text>
          </VStack>
        ) : (
          <MotionVStack
            spacing={8}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            maxW="700px"
            w="full"
          >
            <MotionBox variants={itemVariants}>
              <VStack spacing={4}>
                <Icon as={FiAward} w={12} h={12} color={highlightColor} />
                <Heading
                  size="xl"
                  textAlign="center"
                  bgGradient={`linear(to-r, ${highlightColor}, orange.400, purple.500)`}
                  bgClip="text"
                >
                  Welcome to Premium!
                </Heading>
              </VStack>
            </MotionBox>
            {subscriptionData && (
              <MotionBox
                variants={itemVariants}
                w="full"
                p={8}
                borderRadius="2xl"
                bg={cardBg}
                boxShadow="2xl"
                border="1px solid"
                borderColor={borderColor}
              >
                <VStack spacing={6}>
                  <HStack spacing={3}>
                    <Icon as={FiCheck} color="green.400" w={6} h={6} />
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      bgGradient={`linear(to-r, ${highlightColor}, orange.400, purple.500)`}
                      bgClip="text"
                    >
                      Subscription Activated
                    </Text>
                  </HStack>
                  {renderPlanDetails()}
                  <HStack spacing={4} pt={4}>
                    <Button
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      size="lg"
                      colorScheme="blue"
                      rightIcon={<FiArrowRight />}
                      onClick={handleGoToDashboard}
                      bgGradient="linear(to-r, blue.400, orange.400, purple.500)"
                      _hover={{
                        bgGradient:
                          'linear(to-r, blue.500, orange.500, purple.600)',
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>
            )}
          </MotionVStack>
        )}
      </Center>
    </AnimatePresence>
  );
}
