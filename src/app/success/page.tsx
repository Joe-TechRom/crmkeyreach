'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  VStack,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';

const SuccessPage = () => {
  // All useColorModeValue hooks at the top
  const bgWhite = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const borderColorOrange = useColorModeValue('orange.100', 'whiteAlpha.200');
  const bgGray = useColorModeValue('gray.50', 'whiteAlpha.100');

  // Other hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const supabase = createClientComponentClient();

  // State hooks
  const [customerData, setCustomerData] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Constants
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

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;
        if (!session) throw new Error('No authenticated session found');

        const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('name, email, subscription_tier, billing_cycle')
  .eq('user_id', session.user.id)
  .single();

        if (profileError) throw profileError;

        const { data: userSubscriptions, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id);

        if (subscriptionError) throw subscriptionError;

        setCustomerData(profile);
        setSubscriptions(userSubscriptions);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchCustomerData();
    }
  }, [sessionId, supabase]);

  if (error) {
    return (
      <Box 
        position="relative" 
        overflow="hidden"
        minH="100vh"
        w="100%"
        display="flex"
        alignItems="center"
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
        <Container maxW="container.md" position="relative" zIndex="1">
          <Alert status="error" rounded="xl" boxShadow="xl">
            <AlertIcon />
            {error}
          </Alert>
          <Button 
            mt={4}
            bgGradient={colors.orange.gradient}
            color="white"
            onClick={() => router.push('/')}
            _hover={{
              transform: 'translateY(-2px)',
              shadow: '2xl'
            }}
          >
            Go to Home
          </Button>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box 
        position="relative" 
        overflow="hidden"
        minH="100vh"
        w="100%"
        display="flex"
        alignItems="center"
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
        <Container textAlign="center" position="relative" zIndex="1">
          <Spinner size="xl" color={colors.orange.main} />
          <Text mt={4} fontSize="xl">Loading customer data...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      position="relative" 
      overflow="hidden"
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
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
      
      <Container maxW="container.md" position="relative" zIndex="1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            bg={bgWhite}
            backdropFilter="blur(10px)"
            rounded="2xl"
            p={8}
            boxShadow="2xl"
            border="1px solid"
            borderColor={borderColorOrange}
          >
            <VStack spacing={8}>
              <motion.div variants={itemVariants}>
                <Box
                  bg={bgWhite}
                  backdropFilter="blur(10px)"
                  rounded="full"
                  px={5}
                  py={3}
                  boxShadow="lg"
                  border="1px solid"
                  borderColor={borderColorOrange}
                >
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    bgGradient={colors.orange.gradient}
                    bgClip="text"
                  >
                    ✨ Welcome to KeyReach CRM
                  </Text>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Heading 
                  textAlign="center"
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                  fontSize={{ base: '4xl', md: '5xl' }}
                >
                  Subscription Activated! 🎉
                </Heading>
              </motion.div>

{customerData && (
  <motion.div variants={itemVariants}>
    <Stack spacing={6} width="100%">
      <VStack spacing={2}>
        <Text fontSize="xl" textAlign="center">
          Welcome aboard, <b>{customerData.name || 'Valued Customer'}</b>!
        </Text>
        <Text fontSize="lg" color="gray.600">
          Your {customerData.subscription_tier} plan is ready to power your success
        </Text>
      </VStack>
      
      <Box bg={bgGray} p={6} rounded="xl">
  <Stack spacing={4}>
    <Text>
      <b>Member Name:</b> {customerData.name}
    </Text>
    <Text>
      <b>Email:</b> {customerData.email}
    </Text>
    <Text>
      <b>Plan Type:</b> {customerData.subscription_tier}
    </Text>
    <Text>
      <b>Billing Cycle:</b> {customerData.billing_cycle}
    </Text>
    <Text>
      <b>Additional Team Members:</b> {customerData.additional_users || 0}
    </Text>
    {subscriptions.length > 0 && (
      <Box>
        <Text fontWeight="bold" mb={2}>Subscription Details:</Text>
        {subscriptions.map((sub) => (
          <Text key={sub.id} py={1}>
            Status: <Text as="span" color="green.500" fontWeight="bold">{sub.status}</Text>
          </Text>
        ))}
      </Box>
    )}
  </Stack>
</Box>

    </Stack>
  </motion.div>
)}

<motion.div variants={itemVariants}>
  <Button
    size="lg"
    px={10}
    h={14}
    fontSize="lg"
    bgGradient={colors.orange.gradient}
    color="white"
    rounded="2xl"
    onClick={() => router.push('/signin')}
    _hover={{
      transform: 'translateY(-2px)',
      shadow: '2xl'
    }}
    transition="all 0.2s"
  >
    Access Your Dashboard
  </Button>
</motion.div>


            </VStack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SuccessPage;
