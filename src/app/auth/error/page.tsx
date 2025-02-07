'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSession } from '@supabase/auth-helpers-react';

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const supabase = createClientComponentClient();
  const session = useSession();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles') // Assuming you have a profiles table linked to auth.users
            .select('email')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user email:', error);
            return;
          }

          setUserEmail(data?.email || null);
        } catch (err) {
          console.error('Error fetching user email:', err);
        }
      }
    };

    fetchUserEmail();
  }, [session, supabase]);

  const handleResendVerificationEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      if (!userEmail) {
        throw new Error('Email address not found. Please sign up again.');
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'email',
        email: userEmail,
      });

      if (resendError) {
        throw new Error(resendError.message);
      }

      setResendSuccess(true);
    } catch (err: any) {
      console.error('Error resending verification email:', err);
      alert(err.message || 'Failed to resend verification email.'); // Display error in an alert
    } finally {
      setIsResending(false);
    }
  };

  const isExpiredLink = error === 'invalid flow state, flow state has expired';

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      minH="100vh"
      py={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container
        maxW="container.md"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="xl"
        rounded="md"
        p={8}
        textAlign="center"
      >
        <Heading as="h1" size="xl" mb={6}>
          Authentication Error
        </Heading>

        {error ? (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>
              {isExpiredLink
                ? 'The verification link has expired. Please request a new one.'
                : `Error: ${error}`}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle>Unexpected Error</AlertTitle>
            <AlertDescription>
              An unexpected error occurred during authentication.
            </AlertDescription>
          </Alert>
        )}

        {isExpiredLink && (
          <>
            {resendSuccess ? (
              <Alert status="success" mb={4}>
                <AlertIcon />
                Verification email resent successfully! Please check your inbox.
              </Alert>
            ) : (
              <Button
                colorScheme="teal"
                onClick={handleResendVerificationEmail}
                isLoading={isResending}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    Resending <Spinner size="sm" ml={2} />
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AuthErrorPage;
