// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Icon,
  Card,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ArrowForwardIcon, StarIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons';
import { useUser } from '@/lib/hooks/useUser'; // Assuming you have a user hook

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

export default function DashboardPage() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
    // Update greeting every minute
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const stats = [
    { label: 'Active Leads', value: '247', icon: StarIcon },
    { label: 'Properties Viewed', value: '1,234', icon: ViewIcon },
    { label: 'Time Saved', value: '45hrs', icon: TimeIcon },
  ];

  return (
    <Box
      position="relative"
      minH="100vh"
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

      <Container
        maxW="7xl"
        position="relative"
        zIndex="1"
        py={8}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack spacing={8}>
            <Box
              bg={useColorModeValue('whiteAlpha.900', 'whiteAlpha.100')}
              backdropFilter="blur(10px)"
              rounded="full"
              px={5}
              py={3}
              width="fit-content"
              boxShadow="lg"
              border="1px solid"
              borderColor={useColorModeValue('orange.100', 'whiteAlpha.200')}
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                bgGradient={colors.orange.gradient}
                bgClip="text"
              >
                {`${greeting}, ${user?.firstName || 'User'}`}
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card
                    bg={cardBg}
                    p={6}
                    boxShadow="xl"
                    border="1px solid"
                    borderColor={useColorModeValue('gray.100', 'gray.700')}
                    borderRadius="2xl"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-2px)' }}
                  >
                    <Stack spacing={3}>
                      <Icon as={stat.icon} w={6} h={6} color={colors.orange.main} />
                      <Stat>
                        <StatLabel color={subTextColor}>{stat.label}</StatLabel>
                        <StatNumber
                          fontSize="3xl"
                          fontWeight="bold"
                          bgGradient={colors.orange.gradient}
                          bgClip="text"
                        >
                          {stat.value}
                        </StatNumber>
                      </Stat>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>

            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  p={6}
                  boxShadow="xl"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                >
                  <Heading size="md" mb={4} color={textColor}>
                    Recent Activity
                  </Heading>
                  <Text color={subTextColor}>
                    No recent activity to display.
                  </Text>
                  {/* Add your activity content here */}
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  p={6}
                  boxShadow="xl"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                >
                  <Heading size="md" mb={4} color={textColor}>
                    Quick Actions
                  </Heading>
                  <Stack spacing={4}>
                    <Button
                      size="lg"
                      bgGradient={colors.orange.gradient}
                      color="white"
                      rightIcon={<ArrowForwardIcon />}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: '2xl'
                      }}
                    >
                      New Lead
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      color={textColor}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                    >
                      View Properties
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      color={textColor}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                    >
                      Manage Team
                    </Button>
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
