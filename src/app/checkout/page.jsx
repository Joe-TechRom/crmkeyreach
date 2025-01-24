'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Badge,
  Icon,
  Switch,
  Flex,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdStar, MdStarBorder } from 'react-icons/md';
import supabase from '@/lib/supabaseClient';
import { createCheckoutSession } from '@/utils/payments';

const PricingCard = ({
  plan,
  features,
  monthlyPrice,
  yearlyPrice,
  isPopular,
  onSelect,
  isYearly,
  additionalUsers,
  setAdditionalUsers,
  isLoading,
}) => {
  const displayPrice = isYearly ? yearlyPrice : monthlyPrice;
  const billingPeriod = isYearly ? '/year' : '/month';
  const hasAdditionalUsers = plan.additionalUserPrice !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        rounded="xl"
        shadow="xl"
        p={8}
        position="relative"
        borderWidth={isPopular ? '2px' : '1px'}
        borderColor={isPopular ? 'blue.400' : 'gray.200'}
        _hover={{
          transform: 'translateY(-8px)',
          shadow: '2xl',
          transition: 'all 0.3s ease',
        }}
      >
        {isPopular && (
          <Badge
            colorScheme="blue"
            position="absolute"
            top="-4"
            right="-4"
            rounded="full"
            px={4}
            py={2}
          >
            Most Popular
          </Badge>
        )}
        <VStack spacing={6} align="stretch">
          <Heading size="lg">{plan.name}</Heading>
          <Stack spacing={1}>
            <Text fontSize="4xl" fontWeight="bold">
              ${displayPrice}
              <Text as="span" fontSize="md" fontWeight="medium">
                {billingPeriod}
              </Text>
            </Text>
            {isYearly && (
              <Text color="green.500" fontSize="sm" fontWeight="semibold">
                Save 10% with yearly billing
              </Text>
            )}
          </Stack>
          <VStack align="start" spacing={4}>
            {features.map((feature, index) => (
              <Stack key={index} direction="row" align="center">
                <Icon
                  as={feature.included ? MdStar : MdStarBorder}
                  color={feature.included ? 'blue.400' : 'gray.400'}
                />
                <Text>{feature.text}</Text>
              </Stack>
            ))}
          </VStack>
          {hasAdditionalUsers && (
            <NumberInput
              defaultValue={0}
              min={0}
              max={150}
              onChange={(value) => setAdditionalUsers(plan.name, value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
          <Button
            size="lg"
            w="full"
            colorScheme={isPopular ? 'blue' : 'gray'}
            onClick={() => onSelect(plan)}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            isLoading={isLoading}
            loadingText="Processing..."
          >
            Select {plan.name}
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalUsers, setAdditionalUsers] = useState({});
  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const searchParams = useSearchParams();
  const planType = searchParams.get('tier') || 'single_user';

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session: supabaseSession } } = await supabase.auth.getSession();
      if (supabaseSession) {
        setSession(supabaseSession);
        setUserId(supabaseSession.user.id);
      }
    };
    fetchSession();
  }, []);

  const handlePlanSelection = async (plan) => {
  try {
    setIsLoading(true);
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to continue',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      router.push('/auth');
      return;
    }

    const checkoutData = {
      planId: plan.id,
      isYearly,
      additionalUsers: Number(additionalUsers[plan.name] || 0),
      userId
    };

    const checkoutSession = await createCheckoutSession(
      checkoutData.planId,
      checkoutData.isYearly,
      checkoutData.additionalUsers,
      userId  // Pass userId here
    );

    if (checkoutSession?.url) {
      window.location.href = checkoutSession.url;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    toast({
      title: 'Checkout Error',
      description: 'Please try selecting your plan again',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleAdditionalUsersChange = (planName, value) => {
    setAdditionalUsers((prev) => ({ ...prev, [planName]: value }));
  };

  const plans = [
    {
      id: 'single_user',
      name: 'Single User',
      monthlyPrice: '49.99',
      yearlyPrice: '539.89',
      features: [
        { text: 'Lead Management', included: true },
        { text: 'Property Tracking', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Email Support', included: true },
      ],
    },
    {
      id: 'team',
      name: 'Team',
      monthlyPrice: '99.99',
      yearlyPrice: '1,079.89',
      additionalUserPrice: 10.00,
      isPopular: true,
      features: [
        { text: 'Everything in Basic', included: true },
        { text: 'Team Collaboration', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Additional Users ($10/month each)', included: true },
      ],
    },
    {
      id: 'corporate',
      name: 'Corporate',
      monthlyPrice: '195.99',
      yearlyPrice: '2,116.99',
      additionalUserPrice: 7.99,
      features: [
        { text: 'Everything in Team', included: true },
        { text: 'Custom Integration', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: '24/7 Phone Support', included: true },
        { text: 'Additional Users ($7.99/month each)', included: true },
      ],
    },
  ];

  return (
    <Container maxW="7xl" py={20}>
      <VStack spacing={12}>
        <Stack textAlign="center" spacing={6}>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Choose Your Plan
          </Heading>
          <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
            Select the perfect plan for your business needs
          </Text>
          <Flex justify="center" align="center" gap={4}>
            <Text>Monthly</Text>
            <Switch
              size="lg"
              colorScheme="blue"
              isChecked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
            />
            <Text>Yearly (Save 10%)</Text>
          </Flex>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              features={plan.features}
              monthlyPrice={plan.monthlyPrice}
              yearlyPrice={plan.yearlyPrice}
              isPopular={plan.isPopular}
              isYearly={isYearly}
              onSelect={handlePlanSelection}
              additionalUsers={additionalUsers[plan.name] || 0}
              setAdditionalUsers={handleAdditionalUsersChange}
              isLoading={isLoading}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
