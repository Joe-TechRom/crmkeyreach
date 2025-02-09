'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  useToast,
  Stack,
} from '@chakra-ui/react';
import { subscriptionPlans } from '@/config/plans';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const MotionDiv = motion.div;

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan');
  const [plan, setPlan] = useState<any>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalUsers, setAdditionalUsers] = useState(0);
  const [isYearly, setIsYearly] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        );
        if (!stripeInstance) {
          setError('Failed to initialize Stripe. Please check your Stripe publishable key.');
          return;
        }
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to load Stripe: ${err.message}. Please check your Stripe publishable key and network connection.`);
      }
    };

    initializeStripe();

    if (planId) {
      if (typeof subscriptionPlans === 'object' && subscriptionPlans !== null && subscriptionPlans.hasOwnProperty(planId)) {
        const selectedPlan = Object.values(subscriptionPlans).find(
          (plan: any) => plan.id === planId
        );
        if (selectedPlan) {
          setPlan(selectedPlan);
        } else {
          setError(`Invalid plan selected. Plan ID "${planId}" not found in subscription plans.`);
        }
      } else {
        setError('Invalid plan selected. Subscription plans are not configured correctly.');
      }
    } else {
      setError('No plan selected. Please select a plan before proceeding to checkout.');
    }
  }, [planId, searchParams, router]);

  const calculateTotalPrice = () => {
    if (!plan) return '0.00';
    const basePriceString = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const basePrice = parseFloat(basePriceString);
    const additionalUserPrice = plan.additionalUserPrice || 0;
    const additionalUsersCost = additionalUsers * additionalUserPrice;
    const totalPrice = isYearly
      ? (basePrice + (additionalUsersCost * 12 * 0.9))
      : (basePrice + additionalUsersCost);
    return totalPrice.toFixed(2);
  };

  const handleCheckout = async () => {
    if (!stripe || !plan) {
      toast({
        title: 'Getting Things Ready',
        description: 'Please try again in a moment.',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    // Determine the user limit based on the plan
    let userLimit = 0;
    if (plan.id === 'team') {
      userLimit = 20;
    } else if (plan.id === 'corporate') {
      userLimit = 75;
    } else if (plan.id === 'single_user') {
      userLimit = 1;
    }

    // Check user limit before proceeding
    const totalUsers = additionalUsers + 1;
    if (userLimit && totalUsers > userLimit) {
      toast({
        title: 'User Limit Exceeded',
        description: `This plan allows a maximum of ${userLimit} users.`,
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      const planIdentifier = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planIdentifier,
          quantity: 1,
          metadata: {
            additionalUsers,
            billingPeriod: isYearly ? 'yearly' : 'monthly',
            plan_type: plan.id,
          },
        }),
      });
      const data = await response.json();

      if (data.sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (result.error) {
          toast({
            title: 'Redirecting to Checkout',
            description: 'Please wait while we prepare your checkout session.',
            status: 'loading',
            duration: 2000,
          });
        }
      } else {
        toast({
          title: 'Quick Update Needed',
          description: 'We\'re refreshing your checkout session. Please try again.',
          status: 'info',
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: 'Just a Moment',
        description: 'We\'re optimizing your checkout experience. Please try again.',
        status: 'info',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)'
    }
  };

  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `;

  const glassEffect = {
    backgroundColor: useColorModeValue(
      'rgba(255, 255, 255, 0.9)',
      'rgba(26, 32, 44, 0.8)'
    ),
    backdropFilter: 'blur(10px)',
    borderWidth: '1px',
    borderColor: useColorModeValue('gray.200', 'whiteAlpha.100'),
  };

  let content;

  if (error) {
    content = (
      <MotionDiv variants={itemVariants}>
        <Alert status="error" rounded="xl" {...glassEffect}>
          <AlertIcon />
          {error}
        </Alert>
        <Button
          onClick={() => router.back()}
          mt={4}
          bgGradient={colors.orange.gradient}
          color="white"
          _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
        >
          Go Back
        </Button>
      </MotionDiv>
    );
  } else if (!plan) {
    content = (
      <MotionDiv variants={itemVariants}>
        <Stack align="center" spacing={4}>
          <Spinner size="xl" color={colors.orange.main} />
          <Text fontSize="lg">Loading plan details...</Text>
        </Stack>
      </MotionDiv>
    );
  } else {
    content = (
      <AnimatePresence>
        <MotionDiv key={plan.id} variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
          <Box
            {...glassEffect}
            rounded="2xl"
            p={8}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              bgGradient: colors.orange.gradient,
              opacity: 0.2,
            }}
          >
            <Stack spacing={8}>
              <MotionDiv variants={itemVariants}>
                <Heading
                  textAlign="center"
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                  fontSize="4xl"
                >
                  Complete Your Purchase
                </Heading>
              </MotionDiv>
              <MotionDiv variants={itemVariants}>
                <Stack spacing={6}>
                  <Text fontSize="xl">
                    You have selected the{' '}
                    <Text as="span" fontWeight="bold" bgGradient={colors.orange.gradient} bgClip="text">
                      {plan.name}
                    </Text>
                    {' '}plan
                  </Text>
                  <Button
                    onClick={() => setIsYearly(!isYearly)}
                    variant={isYearly ? 'solid' : 'outline'}
                    bgGradient={isYearly ? colors.orange.gradient : 'none'}
                    color={isYearly ? 'white' : 'current'}
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  >
                    {isYearly ? 'Yearly Billing (Save 10%)' : 'Monthly Billing'}
                  </Button>
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    ${calculateTotalPrice()}
                    <Text as="span" fontSize="lg" fontWeight="normal">
                      /{isYearly ? 'year' : 'month'}
                    </Text>
                  </Text>
                  {(plan.id === 'team' || plan.id === 'corporate') && (
                    <FormControl>
                      <FormLabel>Additional Users</FormLabel>
                      <NumberInput
                        min={0}
                        max={plan.id === 'team' ? 19 : 74}
                        value={additionalUsers || 0}
                        onChange={(valueString) => {
                          const value = parseInt(valueString) || 0;
                          setAdditionalUsers(value);
                        }}
                      >
                        <NumberInputField {...glassEffect} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        {plan.id === 'team'
                          ? 'Team plan includes up to 20 users.'
                          : 'Corporate plan includes up to 75 users.'}
                      </Text>
                    </FormControl>
                  )}
                  {plan.id === 'single_user' && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Single User plan includes 1 user.
                    </Text>
                  )}
                  {additionalUsers > 0 && (
                    <Stack spacing={2}>
                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        Base price: ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </Text>
                      {additionalUsers <= (plan.id === 'team' ? 19 : 74) && (
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          Additional users: {additionalUsers} × ${plan.additionalUserPrice} =
                          ${(additionalUsers * plan.additionalUserPrice).toFixed(2)}/{isYearly ? 'year' : 'month'}
                        </Text>
                      )}
                      {additionalUsers > (plan.id === 'team' ? 19 : 74) && (
                        <>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            First {plan.id === 'team' ? '19' : '74'} additional users:
                            ${((plan.id === 'team' ? 19 : 74) * plan.additionalUserPrice).toFixed(2)}/{isYearly ? 'year' : 'month'}
                          </Text>
                          <Text fontSize="sm" color="orange.500" textAlign="center">
                            Extra users beyond {plan.id === 'team' ? '19' : '74'}:
                            {additionalUsers - (plan.id === 'team' ? 19 : 74)} × ${plan.additionalUserPrice} =
                            ${((additionalUsers - (plan.id === 'team' ? 19 : 74)) * plan.additionalUserPrice).toFixed(2)}/{isYearly ? 'year' : 'month'}
                          </Text>
                        </>
                      )}
                      {plan.id === 'team' && additionalUsers > 19 && (
                        <Alert status="warning" rounded="md">
                          <AlertIcon />
                          You have selected {additionalUsers + 1} users, which exceeds the Team plan limit of 20.
                          Please reduce the number of additional users.
                        </Alert>
                      )}
                      {plan.id === 'corporate' && additionalUsers > 74 && (
                        <Alert status="warning" rounded="md">
                          <AlertIcon />
                          You have selected {additionalUsers + 1} users, which exceeds the Corporate plan limit of 75.
                          Please reduce the number of additional users.
                        </Alert>
                      )}
                    </Stack>
                  )}
                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    isLoading={loading}
                    bgGradient={colors.orange.gradient}
                    color="white"
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: '2xl'
                    }}
                    height="16"
                    fontSize="lg"
                    isDisabled={
                      (plan.id === 'team' && additionalUsers > 19) ||
                      (plan.id === 'corporate' && additionalUsers > 74)
                    }
                  >
                    Complete Purchase
                  </Button>
                </Stack>
              </MotionDiv>
            </Stack>
          </Box>
        </MotionDiv>
      </AnimatePresence>
    );
  }

  return (
    <Box
      position="relative"
      minH="100vh"
      overflow="hidden"
      bg={useColorModeValue('gray.50', 'gray.900')}
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={{ base: '4', md: '8' }}
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
      <Container
        maxW="container.md"
        py={20}
        position="relative"
        zIndex="1"
      >
        {content}
      </Container>
    </Box>
  );
};

export default CheckoutPage;
