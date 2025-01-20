'use client';

// React and Hooks
import React, { useState, useEffect } from 'react';

// Chakra UI Components and Icons
import {
  Box,
  Container,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  SimpleGrid,
  Stack,
  Grid,
  Heading,
  VStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Spacer,
  useColorModeValue,
  SkeletonText,
} from '@chakra-ui/react';

import {
  ArrowForwardIcon,
  StarIcon,
  TimeIcon,
  ViewIcon,
  SettingsIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';

// Animation
import { motion } from 'framer-motion';

// Custom Components - Using default imports
import TaskManagement from '@/components/dashboard/TaskManagement';
import ContactManagement from '@/components/dashboard/ContactManagement';
import IDXIntegration from '@/components/dashboard/IDXIntegration';
import DocumentManagement from '@/components/dashboard/DocumentManagement';
import AIPoweredInsights from '@/components/dashboard/AIPoweredInsights';
import EmailMarketingAutomation from '@/components/dashboard/EmailMarketingAutomation';
import MobileAppIntegration from '@/components/dashboard/MobileAppIntegration';
import ReportingAndAnalytics from '@/components/dashboard/ReportingAndAnalytics';
import LeadManagement from '@/components/dashboard/LeadManagement';
import StripePaymentSubscription from '@/components/dashboard/StripePaymentSubscription';

// UI Components
import Card from '@/components/ui/Card';

// Utils and Data
import { useUser } from '@/lib/hooks/useUser';
import { supabase } from '@/lib/supabaseClient';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';

// Create motion components
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionStack = motion(Stack);



const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

export default function SingleUserDashboard() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setGreeting(getGreeting());
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          { count: activeLeads },
          { count: propertiesViewed },
          { data: appointments },
        ] = await Promise.all([
          supabase.from('leads').select('*', { count: 'exact' }).eq('status', 'active'),
          supabase.from('properties').select('*', { count: 'exact' }),
          supabase.from('appointments').select('*').gte('date', new Date().toISOString()).order('date', { ascending: true }).limit(5),
        ]);
        const totalTimeSaved = appointments?.length * 2;
        setMetrics({
          activeLeads,
          propertiesViewed,
          totalTimeSaved: `${totalTimeSaved}hrs`,
          appointments,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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

  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const stats = [
    { label: 'Active Leads', value: metrics?.activeLeads?.count, icon: StarIcon },
    { label: 'Properties Viewed', value: metrics?.propertiesViewed?.count, icon: ViewIcon },
    { label: 'Time Saved', value: metrics?.totalTimeSaved, icon: TimeIcon },
  ];

  return (
    <Box position="relative" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />
      <Container maxW="7xl" position="relative" zIndex="1" py={8}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Flex align="center" mb={8}>
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
            <Spacer />
            <Flex align="center">
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="lg"
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                >
                  <SettingsIcon boxSize={6} />
                </MenuButton>
                <MenuList>
                  <MenuItem>Settings</MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="lg"
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                >
                  <Avatar size="sm" name={user?.firstName} src={user?.avatar_url} />
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          <Stack spacing={8}>
            {loading ? (
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
                            <SkeletonText noOfLines={1} />
                          </StatNumber>
                        </Stat>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </SimpleGrid>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
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
                            {stat.value || 0}
                          </StatNumber>
                        </Stat>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </SimpleGrid>
            )}
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
                  {loading ? (
                    <VStack align="start" spacing={4}>
                      <SkeletonText noOfLines={2} />
                      <SkeletonText noOfLines={2} />
                      <SkeletonText noOfLines={2} />
                    </VStack>
                  ) : error ? (
                    <Text color="red.500">{error}</Text>
                  ) : metrics?.appointments && metrics.appointments.length > 0 ? (
                    <Stack spacing={4}>
                      {metrics.appointments.map((appointment) => (
                        <Box key={appointment.id} p={3} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
                          <Text>
                            {new Date(appointment.date).toLocaleString()} - {appointment.description}
                          </Text>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text color={subTextColor}>
                      No recent activity to display.
                    </Text>
                  )}
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
                        shadow: '2xl',
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
                        shadow: 'xl',
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
                        shadow: 'xl',
                      }}
                    >
                      Manage Team
                    </Button>
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              <motion.div variants={itemVariants}>
                <Card>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Lead Management
                  </Text>
                  <LeadManagement />
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Task Management
                  </Text>
                  <TaskManagement />
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Contact Management
                  </Text>
                  <ContactManagement />
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    IDX Integration
                  </Text>
                  <IDXIntegration />
                </Card>
              </motion.div>
              {hasFeatureAccess('document_management', user?.tier, features.features) && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Document Management
                    </Text>
                    <DocumentManagement />
                  </Card>
                </motion.div>
              )}
              {hasFeatureAccess('ai_powered_insights', user?.tier, features.features) && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      AI-Powered Insights
                    </Text>
                    <AIPoweredInsights />
                    <AIPoweredInsights />
                  </Card>
                </motion.div>
              )}
              {hasFeatureAccess('email_marketing_automation', user?.tier, features.features) && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Email Marketing Automation
                    </Text>
                    <EmailMarketingAutomation />
                  </Card>
                </motion.div>
              )}
              {hasFeatureAccess('mobile_app_integration', user?.tier, features.features) && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Mobile App Integration
                    </Text>
                    <MobileAppIntegration />
                  </Card>
                </motion.div>
              )}
              {hasFeatureAccess('reporting_and_analytics', user?.tier, features.features) && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Reporting and Analytics
                    </Text>
                    <ReportingAndAnalytics />
                  </Card>
                </motion.div>
              )}
            </Grid>
            <motion.div variants={itemVariants}>
              <Card>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Manage Subscription
                </Text>
                <StripePaymentSubscription />
              </Card>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
