'use client';

import { useState } from 'react';
import { Box, VStack, Heading, Text, Container, useColorModeValue, Button, useToast } from '@chakra-ui/react';
import { FiMail, FiRefreshCw } from 'react-icons/fi';
import supabase from '@/lib/supabaseClient';

export default function VerifyEmail() {
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const boxShadow = useColorModeValue('lg', 'dark-lg');

const handleResendVerification = async () => {
  setIsResending(true);
  
  // Get the current user's email
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
    options: {
      emailRedirectTo: `${window.location.origin}/checkout`
    }
  });

  if (error) {
    toast({
      title: 'Error sending verification email',
      description: error.message,
      status: 'error',
      duration: 5000,
    });
  } else {
    toast({
      title: 'Verification email sent!',
      description: 'Please check your inbox',
      status: 'success',
      duration: 5000,
    });
  }
  setIsResending(false);
};


  return (
    <Container maxW="container.md" py={20}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow={boxShadow}
        textAlign="center"
      >
        <VStack spacing={6}>
          <Box
            bg="blue.50"
            p={4}
            borderRadius="full"
            color="blue.500"
          >
            <FiMail size="2.5rem" />
          </Box>

          <Heading size="xl" color={textColor}>
            Verify your email
          </Heading>

          <Text fontSize="lg" color={textColor}>
            We've sent you an email verification link. Please check your inbox and click the link to verify your email address.
          </Text>

          <Text fontSize="md" color="gray.500">
            Once verified, you'll be automatically redirected to complete your payment.
          </Text>

          <Button
            leftIcon={<FiRefreshCw />}
            colorScheme="blue"
            onClick={handleResendVerification}
            isLoading={isResending}
            loadingText="Sending..."
            variant="outline"
            size="lg"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
          >
            Resend Verification Email
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
