'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiAward } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useRouter, useSearchParams } from 'next/navigation';
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
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

async function getStripeSession(sessionId: string) {
  const response = await fetch('/api/webhook/stripe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch session');
  }
  
  return response.json();
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
        colors: ['#4299E1', '#FF9A5C', '#805AD5']
      });
    }
  }, [sessionData]);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        router.push('/pricing');
        return;
      }

      try {
        const data = await getStripeSession(sessionId);
        setSessionData(data);
        
        toast({
          title: '🎉 Payment Successful!',
          description: 'Welcome to your premium subscription',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch subscription details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        router.push('/pricing');
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId, toast, router]);

  if (loading) {
    return (
      <Center h="100vh" bgGradient={gradientBg}>
        <VStack spacing={4}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={highlightColor}
          />
          <Text
            color={textColor}
            fontSize="lg"
            fontWeight="medium"
          >
            Processing your subscription...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <AnimatePresence>
      <Center 
        minH="100vh" 
        p={4} 
        bg={useColorModeValue('gray.50', 'gray.900')}
        position="relative"
        overflow="hidden"
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
        <MotionVStack
          spacing={8}
          maxW="700px"
          w="full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          position="relative"
          zIndex="1"
        >
          <MotionBox variants={itemVariants}>
            <VStack spacing={4}>
              <Icon
                as={FiAward}
                w={12}
                h={12}
                color={highlightColor}
              />
              <Heading
                size="xl"
                textAlign="center"
                color={textColor}
                bgGradient={`linear(to-r, ${highlightColor}, orange.400, purple.500)`}
                bgClip="text"
              >
                Welcome to Premium!
              </Heading>
            </VStack>
          </MotionBox>
          
          {sessionData && (
            <MotionBox
              variants={cardVariants}
              w="full"
              p={8}
              borderRadius="2xl"
              boxShadow="2xl"
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '2xl',
                bgGradient: 'linear(to-br, blue.500, orange.400, purple.500)',
                opacity: 0.1,
                zIndex: 0,
              }}
            >
              <VStack spacing={6} align="stretch" position="relative">
                <HStack spacing={3}>
                  <Icon as={FiCheck} color="green.400" w={6} h={6} />
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={textColor}
                    bgGradient={`linear(to-r, ${highlightColor}, orange.400, purple.500)`}
                    bgClip="text"
                  >
                    Subscription Activated
                  </Text>
                </HStack>
                
                <List spacing={4}>
                  {[
                    { label: 'Plan', value: sessionData.plan.name },
                    { label: 'Billing Cycle', value: sessionData.plan.interval === 'month' ? 'Monthly' : 'Yearly' },
                    { label: 'Amount', value: `$${sessionData.plan.amount / 100}/${sessionData.plan.interval}` }
                  ].map((item, index) => (
                    <MotionBox
                      key={index}
                      variants={itemVariants}
                    >
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

                <Text
                  mt={4}
                  color={textColor}
                  fontSize="lg"
                  textAlign="center"
                >
                  Your premium features are now unlocked and ready to use!
                </Text>

                <HStack spacing={4} justify="center" mt={6}>
                  <Button
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    size="lg"
                    colorScheme="blue"
                    rightIcon={<FiArrowRight />}
                    onClick={() => router.push('/dashboard')}
                    bgGradient="linear(to-r, blue.400, orange.400, purple.500)"
                    _hover={{
                      bgGradient: "linear(to-r, blue.500, orange.500, purple.600)",
                    }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    size="lg"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => router.push('/features')}
                  >
                    View Features
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          )}
        </MotionVStack>
      </Center>
    </AnimatePresence>
  );
}
