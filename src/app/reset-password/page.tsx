'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
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
} from '@chakra-ui/react';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false); // Track success state
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success state

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Redirect to update-password page
      });

      if (error) {
        console.error('Reset password error:', error);
        setError('Failed to send reset password email. Please try again.');
      } else {
        console.log('Reset password email sent successfully.');
        setSuccess(true); // Set success state to true
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
      {/* Background styling (same as signup page) */}
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, #FF9A5C15 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, #FF6B2C10 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, #FF9A5C15 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, #FF6B2C10 0%, transparent 50%)
          `,
        }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />
      <Container
        maxW="container.md"
        position="relative"
        zIndex="1"
        px={{ base: 4, lg: 8 }}
        py={12}
      >
        <Card
          bg={useColorModeValue('whiteAlpha.900', 'whiteAlpha.100')}
          backdropFilter="blur(10px)"
          boxShadow="lg"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
          rounded="xl"
        >
          <CardBody>
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              textAlign="center"
              color={useColorModeValue('gray.800', 'white')}
              mb={6}
            >
              Reset Password
            </Heading>
            <Text
              textAlign="center"
              color={useColorModeValue('gray.600', 'gray.300')}
              mb={8}
            >
              Enter your email address to receive a reset password link.
            </Text>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            {success && (
              <Alert status="success" mb={4}>
                <AlertIcon />
                A reset password link has been sent to your email address.
              </Alert>
            )}
            <form onSubmit={handleResetPassword}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <Button
                  bgGradient="linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)"
                  color="white"
                  isLoading={loading}
                  type="submit"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'md',
                  }}
                >
                  Reset Password
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
