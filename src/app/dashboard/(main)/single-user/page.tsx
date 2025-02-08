'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Text, 
  Heading, 
  useColorModeValue,
  VStack,
  HStack,
  Icon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiSun, FiMoon, FiSunrise } from 'react-icons/fi';

const MotionBox = motion(Box);

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Guest');
  const supabase = createClientComponentClient();

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

  const boxShadow = useColorModeValue(
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 4px 12px rgba(0, 0, 0, 0.4)'
  );

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
        console.log('Session:', session);

        if (session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          console.log('Profile:', profile);

          if (profile?.name) {
            setUserName(profile.name);
          } else {
            setUserName(session.user.email?.split('@')[0] || 'Guest');
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

  return (
    <Box 
      position="relative" 
      minH="100vh"
      w="100%"
      style={{ background: gradientBg }}
    >
      <Container 
        maxW="container.xl" 
        py={{ base: 6, md: 12 }}
        px={{ base: 4, md: 8 }}
      >
        <VStack spacing={8} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              p={{ base: 6, md: 8 }}
              borderRadius="2xl"
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={boxShadow}
            >
              <HStack spacing={4} mb={4}>
                <Icon as={GreetingIcon} w={8} h={8} color={colors.orange.main} />
                <Heading 
                  size={{ base: "lg", md: "xl" }}
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                >
                  {greeting}, {userName}!
                </Heading>
              </HStack>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color={useColorModeValue('gray.600', 'gray.300')}
              >
                Welcome to your KeyReach CRM dashboard. Here's an overview of your real estate business.
              </Text>
            </Box>
          </MotionBox>

          {/* Add your dashboard widgets here */}
          
        </VStack>
      </Container>
    </Box>
  );
}
