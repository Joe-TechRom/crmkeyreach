'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import {
  Text,
  VStack,
  Heading,
  List,
  ListItem,
  Container,
  Box,
  Grid,
  useColorModeValue,
  Icon,
  Flex,
  Link,
  useToast,
} from '@chakra-ui/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { FaHome, FaCalendar, FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { logError } from '@/lib/utils/log';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

function CustomerPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [profile, setProfile] = useState(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
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

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        fetchProfile(session.user.id);
      }
    };
    fetchSession();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logError('Error fetching profile:', error.message, error);
        toast({
          title: 'Error fetching profile',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        return;
      }
      setProfile(data);
    } catch (error) {
      logError('Error fetching profile:', error);
      toast({
        title: 'Error fetching profile',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });
      if (error) {
        setLoginError(error.message);
        logError('Login error:', error.message, error);
        return;
      }
      setIsAuthenticated(true);
      setLoginError('');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetchProfile(session.user.id);
      }
    } catch (error) {
      logError('Login error:', error);
      setLoginError('An unexpected error occurred.');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        logError('Forgot password error:', error.message, error);
        toast({
          title: 'Error resetting password',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        return;
      }
      setResetSuccess(true);
      toast({
        title: 'Reset link sent',
        description: 'Please check your email for password reset instructions.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      logError('Forgot password error:', error);
      toast({
        title: 'Error resetting password',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setProfile(null);
      router.push('/auth/signin');
    } catch (error) {
      logError('Logout error:', error);
      toast({
        title: 'Error logging out',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxW="100vw" h="100vh" p={0} m={0}>
        <Box
          w="full"
          h="full"
          style={{ background: gradientBg }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            maxW="md"
            w="90%"
            p={8}
            borderRadius="2xl"
            boxShadow="2xl"
            bg={useColorModeValue('white', 'gray.800')}
          >
            {!isForgotPassword ? (
              <VStack spacing={6} align="stretch">
                <Heading
                  as="h2"
                  size="xl"
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                  textAlign="center"
                >
                  Customer Portal
                </Heading>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="lg"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                />
                {loginError && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {loginError}
                  </Text>
                )}
                <Button
                  onClick={handleLogin}
                  size="lg"
                  bgGradient={colors.orange.gradient}
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: '2xl',
                  }}
                  h={16}
                  fontSize="lg"
                  rounded="2xl"
                >
                  Login
                </Button>
                <Link
                  color={colors.orange.main}
                  textAlign="center"
                  onClick={() => setIsForgotPassword(true)}
                  cursor="pointer"
                  _hover={{ textDecoration: 'none', opacity: 0.8 }}
                >
                  Forgot Password?
                </Link>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                <Heading
                  as="h2"
                  size="xl"
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                  textAlign="center"
                >
                  Reset Password
                </Heading>
                {!resetSuccess ? (
                  <>
                    <Text textAlign="center" color={useColorModeValue('gray.600', 'gray.300')}>
                      Enter your email address to receive password reset instructions.
                    </Text>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      size="lg"
                    />
                    <Button
                      onClick={handleForgotPassword}
                      size="lg"
                      bgGradient={colors.orange.gradient}
                      color="white"
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: '2xl',
                      }}
                      h={16}
                      fontSize="lg"
                      rounded="2xl"
                    >
                      Send Reset Link
                    </Button>
                  </>
                ) : (
                  <Text textAlign="center" color="green.500">
                    Password reset instructions have been sent to your email.
                  </Text>
                )}
                <Link
                  color={colors.orange.main}
                  textAlign="center"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  cursor="pointer"
                  _hover={{ textDecoration: 'none', opacity: 0.8 }}
                >
                  Back to Login
                </Link>
              </VStack>
            )}
          </MotionCard>
        </Box>
      </Container>
    );
  }

  return (
    <Box minH="100vh" w="100%" style={{ background: gradientBg }} py={10}>
      <Container maxW="7xl">
        <VStack spacing={10} align="stretch">
          <Flex
            justify="space-between"
            align="center"
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                {getGreeting()},
              </Text>
              <Heading
                as="h2"
                size="xl"
                bgGradient={colors.orange.gradient}
                bgClip="text"
              >
                {profile?.full_name || 'User'}
              </Heading>
            </VStack>

            <Flex align="center" gap={4}>
              <Icon as={FaUser} w={6} h={6} color={colors.orange.main} />
              <Button
                onClick={handleLogout}
                size="md"
                bgGradient={colors.orange.gradient}
                color="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                leftIcon={<Icon as={FiLogOut} />}
                rounded="xl"
              >
                Logout
              </Button>
            </Flex>
          </Flex>
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                p={6}
                h="full"
                borderRadius="2xl"
                boxShadow="2xl"
                bg={useColorModeValue('white', 'gray.800')}
              >
                <VStack align="stretch" spacing={4}>
                  <Flex align="center" gap={2}>
                    <Icon as={FaHome} w={6} h={6} color={colors.orange.main} />
                    <Heading as="h3" size="md">Your Properties</Heading>
                  </Flex>
                  <List spacing={4}>
                    {profile?.properties?.map((property) => (
                      <ListItem
                        key={property.id}
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        transition="all 0.2s"
                        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                      >
                        <Text fontWeight="bold">{property.address}</Text>
                        <Text color={colors.orange.main} fontSize="lg">{property.price}</Text>
                      </ListItem>
                    )) || <Text>No properties found.</Text>}
                  </List>
                </VStack>
              </Card>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                p={6}
                h="full"
                borderRadius="2xl"
                boxShadow="2xl"
                bg={useColorModeValue('white', 'gray.800')}
              >
                <VStack align="stretch" spacing={4}>
                  <Flex align="center" gap={2}>
                    <Icon as={FaCalendar} w={6} h={6} color={colors.orange.main} />
                    <Heading as="h3" size="md">Your Appointments</Heading>
                  </Flex>
                  <List spacing={4}>
                    {profile?.appointments?.map((appointment) => (
                      <ListItem
                        key={appointment.id}
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        transition="all 0.2s"
                        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                      >
                        <Text fontWeight="bold">{appointment.description}</Text>
                        <Text>
                          {appointment.date} at {appointment.time}
                        </Text>
                      </ListItem>
                    )) || <Text>No appointments found.</Text>}
                  </List>
                </VStack>
              </Card>
            </MotionBox>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}

export default CustomerPortal;
