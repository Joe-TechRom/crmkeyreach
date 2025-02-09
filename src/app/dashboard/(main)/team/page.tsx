'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Heading,
  useColorModeValue,
  VStack,
  Icon,
  IconButton,
  Collapse,
  Flex,
  Container,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiSun, FiMoon, FiSunrise, FiX } from 'react-icons/fi';
import { TypeAnimation } from 'react-type-animation';
import { DynamicContent } from '@/components/dashboard/DynamicContent';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const Page: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Guest');
  const [showGreeting, setShowGreeting] = useState(true);
  const supabase = createClientComponentClient();

  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900');
  const bgColor = useColorModeValue('white', 'gray.800'); // Move this outside
  const borderColor = useColorModeValue('orange.100', 'orange.700'); // Move this outside
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: FiSunrise };
    if (hour < 18) return { text: 'Good Afternoon', icon: FiSun };
    return { text: 'Good Evening', icon: FiMoon };
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, name, email')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profile?.name) {
            setUserName(profile.name);
          } else if (profile?.username) {
            setUserName(profile.username);
          } else if (profile?.email) {
            setUserName(profile.email.split('@')[0]);
          } else if (session.user.email) {
            setUserName(session.user.email.split('@')[0]);
          } else {
            setUserName('Guest');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserName('Guest');
      }
    };

    fetchUserProfile();
    const { text } = getTimeBasedGreeting();
    setGreeting(text);
  }, [supabase]);

  const { icon: GreetingIcon } = getTimeBasedGreeting();

  const handleCloseGreeting = () => {
    setShowGreeting(false);
  };

  return (
    <Container maxW="container.xl" p={0}>
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        minH="100vh"
        w="100%"
        p={{ base: 4, md: 6, lg: 8 }}
      >
        <AnimatePresence>
          {userName !== 'Guest' && showGreeting && ( // Conditionally render the entire greeting
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              mb={8}
              w="100%"
              maxW="container.lg"
            >
              <Box
                p={{ base: 6, md: 8 }}
                bg={bgColor} // Use the pre-calculated value
                rounded="xl"
                boxShadow="xl"
                borderWidth="1px"
                borderColor={borderColor} // Use the pre-calculated value
                backdropFilter="blur(10px)"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  bgGradient: colors.orange.gradient,
                  opacity: 0.5,
                }}
              >
                <IconButton
                  aria-label="Close Greeting"
                  icon={<FiX />}
                  size="sm"
                  position="absolute"
                  top="4"
                  right="4"
                  onClick={handleCloseGreeting}
                  variant="ghost"
                  colorScheme="orange"
                  _hover={{ bg: 'orange.50' }}
                />
                <VStack spacing={4} align="center">
                  <Icon
                    as={GreetingIcon}
                    w={{ base: 8, md: 10 }}
                    h={{ base: 8, md: 10 }}
                    color={colors.orange.main}
                  />
                  <TypeAnimation
                    sequence={[
                      `${greeting}, ${userName}!`,
                      1000,
                      'Welcome to Your Dashboard',
                      1000,
                    ]}
                    wrapper="div"
                    cursor={true}
                    repeat={Infinity}
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      background: colors.orange.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  />
                  <Text
                    fontSize={{ base: "sm", md: "md", lg: "lg" }}
                    color={textColor}
                    textAlign="center"
                    maxW="container.md"
                    lineHeight="tall"
                  >
                    Manage your business efficiently and track performance metrics in real-time.
                    Collaborate seamlessly with your team members and achieve your goals together.
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
        <Box
          w="100%"
          maxW="container.xl"
          mt={showGreeting ? 0 : 8}
          transition="margin 0.3s ease"
        >
          <DynamicContent />
        </Box>
      </Flex>
    </Container>
  );
};

export default Page;
