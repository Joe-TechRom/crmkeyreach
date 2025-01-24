'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import supabase from '@/lib/supabaseClient';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Divider,
  HStack,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';

function SignupPage() {
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const planType = searchParams.get('plan') || 'single_user';

  const checkEmailExists = async (email) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();
    return !!data;
  };

  useEffect(() => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else if (formData.password && formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (formData.password && !/[A-Z]/.test(formData.password)) {
      setPasswordError('Password must contain at least one uppercase letter');
    } else if (formData.password && !/[a-z]/.test(formData.password)) {
      setPasswordError('Password must contain at least one lowercase letter');
    } else if (formData.password && !/[0-9]/.test(formData.password)) {
      setPasswordError('Password must contain at least one number');
    } else if (formData.password && !/[^A-Za-z0-9]/.test(formData.password)) {
      setPasswordError('Password must contain at least one special character');
    } else {
      setPasswordError('');
    }
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (user?.email) {
        const emailExists = await checkEmailExists(user.email);
        if (emailExists) {
          toast({
            title: 'Account exists',
            description: 'An account with this email already exists. Please sign in instead.',
            status: 'error',
            duration: 5000,
          });
          router.push('/signin');
          return;
        }
      }

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?tier=${planType}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) throw authError;

    } catch (error) {
      console.error('Google signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during Google signup',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (passwordError) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the password errors.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        toast({
          title: 'Email already registered',
          description: 'This email is already registered. Please sign in or use a different email.',
          status: 'error',
          duration: 5000,
        });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?tier=${planType}`,
          data: {
            plan_type: planType,
            full_name: formData.name,
            phone_number: formData.phoneNumber,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Verification email sent',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
      });
      router.push('/auth/verify-email');

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={12}>
      <VStack spacing={8}>
        <Stack align="center" spacing={2}>
          <Heading size="xl" color={textColor}>
            Create Your Account
          </Heading>
          <Text color={textColor} textAlign="center">
            Complete your registration to continue with your {planType} plan
          </Text>
        </Stack>

        <Box
          w="full"
          bg={bgColor}
          rounded="lg"
          shadow="lg"
          p={8}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6}>
            <Button
              w="full"
              size="lg"
              onClick={handleGoogleSignup}
              isLoading={isGoogleLoading}
              loadingText="Connecting..."
              variant="outline"
              borderColor={borderColor}
              color={textColor}
              leftIcon={<Icon as={FcGoogle} boxSize={6} />}
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.700'),
              }}
            >
              Sign up with Google
            </Button>

            <HStack w="full">
              <Divider />
              <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                or continue with email
              </Text>
              <Divider />
            </HStack>

            <form onSubmit={handleSignup} style={{ width: '100%' }}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired isInvalid={!!passwordError}>
                  <FormLabel color={textColor}>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      borderColor={borderColor}
                      color={textColor}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired isInvalid={!!passwordError}>
                  <FormLabel color={textColor}>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      borderColor={borderColor}
                      color={textColor}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {passwordError && (
                    <FormErrorMessage>{passwordError}</FormErrorMessage>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                  w="full"
                >
                  Create Account & Continue to Payment
                </Button>
              </Stack>
            </form>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default SignupPage;
