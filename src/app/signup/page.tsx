'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Grid,
  InputGroup,
  InputRightElement,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const SignupPage = () => {
  // Move all hooks to the top
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone_number: phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
        },
      });

      if (signUpError) throw signUpError;
      
      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      onOpen(); // Open modal
      
      // Clear form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setPhoneNumber('');
    } catch (error: any) {
      setError(error.message);
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
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />

      <Container maxW="7xl" position="relative" zIndex="1" px={{ base: 4, lg: 8 }} py={12}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10}>
            {/* Left side - Welcome content */}
            <motion.div variants={itemVariants}>
              <Stack spacing={8} py={12}>
                <Box
                  bg={bgColor}
                  backdropFilter="blur(10px)"
                  rounded="full"
                  px={5}
                  py={3}
                  width="fit-content"
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

                <Heading
                  fontSize={{ base: '4xl', md: '5xl' }}
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                >
                 The Ultimate Real Estate Solution!
                </Heading>

                <Stack spacing={6}>
                  <Text fontSize="xl" color={subTextColor}>
                    What You Get:
                  </Text>
                  
                  <Stack spacing={4}>
                    {[
                      '🏠 IDX & MLS Integration',
                      '🤖 Social Media & Zapier Automation',
                      '📝 E-Signature & Document Management',
                      '📱 Mobile-Friendly, Easy to Use & More'
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Text fontSize="lg" color={subTextColor}>{feature}</Text>
                      </motion.div>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </motion.div>

            {/* Right side - Sign up form */}
            <Card
              bg={bgColor}
              backdropFilter="blur(10px)"
              boxShadow="lg"
              border="1px solid"
              borderColor={borderColor}
              rounded="xl"
            >
              <CardBody>
                {error && (
                  <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSignUp}>
                  <Stack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <Button
                      size="lg"
                      bgGradient={colors.orange.gradient}
                      color="white"
                      isLoading={loading}
                      type="submit"
                      rightIcon={<ArrowForwardIcon />}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                    >
                      Create Account
                    </Button>
                  </Stack>
                </form>

                <Text mt={6} textAlign="center" color={subTextColor}>
                  Already have an account?{' '}
                  <Link href="/signin" style={{ color: colors.orange.main }}>
                    Sign in here
                  </Link>
                </Text>
              </CardBody>
            </Card>
          </Grid>
        </motion.div>
      </Container>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🎓 Registration Successful!</ModalHeader>
          <ModalBody>
            <Text>{successMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              bgGradient={colors.orange.gradient}
              color="white"
              onClick={onClose}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'md',
              }}
            >
              Got it!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SignupPage;
