'use client';

import { useState } from 'react';
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
  Link
} from '@chakra-ui/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { FaHome, FaCalendar, FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const mockClientData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  properties: [
    { id: 1, address: '123 Main St, Anytown, USA', price: '$500,000' },
    { id: 2, address: '456 Oak Ave, Anytown, USA', price: '$750,000' },
  ],
  appointments: [
    { id: 1, date: '2024-08-10', time: '10:00 AM', description: 'Property Viewing' },
    { id: 2, date: '2024-08-15', time: '2:00 PM', description: 'Meeting with Agent' },
  ],
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

function CustomerPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

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

  const handleLogin = () => {
    if (username === 'client' && password === 'password') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleForgotPassword = () => {
    if (resetEmail) {
      setResetSuccess(true);
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
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
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
                    shadow: '2xl'
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
                        shadow: '2xl'
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
    <Box
      minH="100vh"
      w="100%"
      style={{ background: gradientBg }}
      py={10}
    >
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
              <Text 
                fontSize="lg" 
                color={useColorModeValue('gray.600', 'gray.400')}
              >
                {getGreeting()},
              </Text>
              <Heading
                as="h2"
                size="xl"
                bgGradient={colors.orange.gradient}
                bgClip="text"
              >
                {mockClientData.name}
              </Heading>
            </VStack>
            
            <Flex align="center" gap={4}>
              <Icon as={FaUser} w={6} h={6} color={colors.orange.main} />
              <Button
                onClick={() => setIsAuthenticated(false)}
                size="md"
                bgGradient={colors.orange.gradient}
                color="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg'
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
                    {mockClientData.properties.map((property) => (
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
                    ))}
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
                    {mockClientData.appointments.map((appointment) => (
                      <ListItem 
                        key={appointment.id}
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        transition="all 0.2s"
                        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                      >
                        <Text fontWeight="bold">{appointment.description}</Text>
                        <Text>{appointment.date} at {appointment.time}</Text>
                      </ListItem>
                    ))}
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
