'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
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

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, [searchParams]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/signin');
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [success, router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!accessToken) {
        setError('Invalid access token. Please try again from the email link.');
        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
        access_token: accessToken,
      });

      if (error) {
        console.error('Update password error:', error);
        setError('Failed to update password. Please try again.');
      } else {
        console.log('Password updated successfully:', data);
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Update password error:', err);
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
              Update Password
            </Heading>
            <Text
              textAlign="center"
              color={useColorModeValue('gray.600', 'gray.300')}
              mb={8}
            >
              Enter your new password.
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
                Password updated successfully! You will be redirected to the sign-in page.
              </Alert>
            )}
            <form onSubmit={handleUpdatePassword}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  Update Password
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default UpdatePasswordPage;
