// src/app/success/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiAward } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, VStack, Heading, Text, Spinner, Center, List, ListItem,
  useToast, Button, useColorModeValue, HStack, Icon,
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

interface SessionData {
  plan: {
    name: string;
    interval: string;
    amount: number;
  };
  status: string;
  customerId: string;
  subscriptionId: string;
  profile: {
    subscription_tier: string;
    stripe_customer_id: string;
  }
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
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
    if (sessionData) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4299E1', '#FF9A5C', '#805AD5'],
      });
    }
  }, [sessionData]);

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) return;

      const maxAttempts = 15;
      let attempts = 0;

      const checkStatus = async () => {
        try {
          const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
          const data = await response.json();
          console.log('Success Page Data:', data);

          if (data.status === 'active' || data.status === 'trialing') {
            setSessionData(data);
            setLoading(false);
            toast({
              title: '🎉 Subscription Activated!',
              description: 'Welcome to your premium subscription',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top',
            });
          } else if (attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000));
            await checkStatus();
          } else {
            setLoading(false);
          }
        } catch (error) {
          if (attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000));
            await checkStatus();
          } else {
            setLoading(false);
          }
        }
      };

      checkStatus();
    }

    verifySession();
  }, [sessionId, toast]);

  const renderPlanDetails = () => {
    if (!sessionData?.plan) return null;

    const planDetails = [
      { label: 'Plan', value: sessionData.plan.name || 'Premium Plan' },
      { label: 'Billing Cycle', value: sessionData.plan.interval === 'month' ? 'Monthly' : 'Yearly' },
      { label: 'Status', value: sessionData.status || 'Active' },
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

  const handleGoToDashboard = () => {
    if (sessionData?.profile?.subscription_tier === 'single_user') {
      router.push('/dashboard');
    } else if (sessionData?.profile?.subscription_tier === 'premium') {
      router.push('/premium-dashboard');
    } else {
      router.push('/pricing');
    }
  };

  return (
    <AnimatePresence>
      <Center minH="100vh" bgGradient={gradientBg} p={4}>
        {loading ? (
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color={highlightColor} />
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

            {sessionData && (
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
                        bgGradient: "linear(to-r, blue.500, orange.500, purple.600)",
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
