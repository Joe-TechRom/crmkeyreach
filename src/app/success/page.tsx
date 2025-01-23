'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiAward, FiUser } from 'react-icons/fi';
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
  Container,
  Badge,
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
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
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
    blue: {
      light: '#60A5FA',
      main: '#3B82F6',
    },
    purple: {
      light: '#A78BFA',
      main: '#7C3AED',
    },
  };

  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.blue.light}30 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.purple.light}20 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}25 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.blue.main}15 0%, transparent 50%)
  `;

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.500', 'blue.300');

// In your useEffect hook
useEffect(() => {
  async function fetchSession() {
    if (!sessionId) {
      console.log('No session ID found');
      return; // Remove the redirect to pricing
    }

    try {
      const data = await getStripeSession(sessionId);
      setSessionData(data);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4299E1', '#FF9A5C', '#805AD5'],
      });

      toast({
        title: '🎉 Payment Successful!',
        description: 'Welcome to your premium subscription',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch subscription details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  fetchSession();
}, [sessionId, toast]);

  return (
    <AnimatePresence>
      <Container maxW="container.xl" p={0}>
        <Center
          minH="100vh"
          p={{ base: 4, md: 8 }}
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
            {/* ... (keep existing header section) */}

            {sessionData && (
              <MotionBox
                variants={cardVariants}
                w="full"
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                boxShadow="2xl"
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '2xl',
                  bgGradient: 'linear(to-br, blue.500, purple.500, orange.400)',
                  opacity: 0.1,
                  zIndex: 0,
                }}
              >
                <VStack spacing={6} align="stretch" position="relative">
                  <HStack spacing={3}>
                    <Icon as={FiCheck} color="green.400" w={6} h={6} />
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      bgGradient={`linear(to-r, ${colors.blue.main}, ${colors.purple.main}, ${colors.orange.main})`}
                      bgClip="text"
                    >
                      Your {sessionData.plan.name} Plan is Active!
                    </Text>
                  </HStack>

                  <List spacing={4}>
                    {/* ... (keep existing list items) */}
                  </List>

                  <HStack spacing={4} justify="center" mt={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
                    <Button
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      size="lg"
                      colorScheme="blue"
                      rightIcon={<FiUser />}
                      onClick={() => router.push(`/profile/${sessionData.userId}`)}
                      bgGradient={`linear(to-r, ${colors.blue.main}, ${colors.purple.main})`}
                      _hover={{
                        bgGradient: `linear(to-r, ${colors.blue.light}, ${colors.purple.light})`,
                      }}
                      w={{ base: "full", md: "auto" }}
                      mb={{ base: 2, md: 0 }}
                    >
                      View Profile
                    </Button>
                    <Button
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      size="lg"
                      colorScheme="orange"
                      rightIcon={<FiArrowRight />}
                      onClick={() => router.push(`/dashboard/${sessionData.plan.name.toLowerCase()}`)}
                      bgGradient={`linear(to-r, ${colors.orange.main}, ${colors.purple.main})`}
                      _hover={{
                        bgGradient: `linear(to-r, ${colors.orange.light}, ${colors.purple.light})`,
                      }}
                      w={{ base: "full", md: "auto" }}
                    >
                      Go to Dashboard
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>
            )}
          </MotionVStack>
        </Center>
      </Container>
    </AnimatePresence>
  );
}