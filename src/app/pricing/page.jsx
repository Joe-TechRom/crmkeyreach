'use client';

import { keyframes } from '@emotion/react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import {
  MdTrendingUp,
  MdGroup,
  MdInsights,
  MdAutoGraph,
  MdCheckCircle,
} from 'react-icons/md';
import { subscriptionPlans } from '@/config/plans'; // Import plan data
import PriceCheckout from '@/components/home/PriceCheckout'; // Import PriceCheckout

const shimmer = keyframes`
  from {background-position: 0 0;}
  to {background-position: 200% 0;}
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const textShimmer = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionText = motion(Text);

function PricingPage() {
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

  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900');

  const features = [
    {
      icon: MdTrendingUp,
      title: 'Lead Management',
      description: 'Manage leads effectively and efficiently.',
    },
    {
      icon: MdAutoGraph,
      title: 'Ad Creation',
      description: 'Automated ad creation across multiple platforms.',
    },
    {
      icon: MdGroup,
      title: 'Team Collaboration',
      description: 'Seamless team collaboration for enhanced productivity.',
    },
    {
      icon: MdInsights,
      title: 'Analytics & Reporting',
      description: 'Comprehensive analytics and reporting for informed decisions.',
    },
  ];

  const FeatureCard = ({ icon: FeatureIcon, title, description }) => {
    const glassEffect = {
      backgroundColor: useColorModeValue(
        'rgba(255, 255, 255, 0.9)',
        'rgba(26, 32, 44, 0.8)'
      ),
      backdropFilter: 'blur(10px)',
      borderWidth: '1px',
      borderColor: useColorModeValue('gray.200', 'whiteAlpha.100'),
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        viewport={{ once: true }}
      >
        <Box
          p={8}
          {...glassEffect}
          rounded="xl"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            bgGradient: colors.orange.gradient,
            opacity: 0.2,
          }}
        >
          <Stack spacing={4}>
            <Icon as={FeatureIcon} w={10} h={10} color={colors.orange.main} />
            <Heading size="md" color={textColor}>
              {title}
            </Heading>
            <Text color={textColor} lineHeight="tall">
              {description}
            </Text>
          </Stack>
        </Box>
      </motion.div>
    );
  };

  const accordionData = [
    {
      title: 'Seamless IDX Integration',
      content: 'Get real-time MLS listings directly on your website and capture leads effortlessly.',
    },
    {
      title: 'Built-in Social Media Marketing',
      content: 'Advertise on Facebook, Instagram, and Google Ads with just one click.',
    },
    {
      title: 'Automated Workflows',
      content: 'Our Zapier integration connects you to 5,000+ apps, saving you hours of manual work.',
    },
    {
      title: 'E-Signature & Document Management',
      content: 'Send, track, and sign contracts digitally without leaving the CRM.',
    },
    {
      title: 'User-Friendly & Mobile-Optimized',
      content: 'Manage your business from anywhere with an intuitive, sleek interface.',
    },
    {
      title: 'Affordable & Scalable',
      content: 'We offer competitive pricing without sacrificing quality, making it perfect for solo agents and large teams.',
    },
  ];

  return (
    <Box
      position="relative"
      overflow="hidden"
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
      <Box minH="100vh" pb={20} boxShadow="0 4px 12px rgba(0,0,0,0.1)">
        <Container maxW="7xl" pt={20} position="relative" zIndex="1">
          <Stack spacing={20}>
            <Stack textAlign="center" spacing={8}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TypeAnimation
                  sequence={[
                    'Unlock Your Real Estate Potential',
                    1000,
                    'Maximize Your Real Estate Success',
                    1000,
                    'Transform Your Real Estate Business',
                    1000,
                  ]}
                  wrapper="h1"
                  cursor={true}
                  repeat={Infinity}
                  style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    background: `linear-gradient(-45deg, ${colors.orange.main}, ${colors.orange.light}, #FF8F6B, #FFB088)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '300% 300%',
                    animation: `${textShimmer} 5s ease infinite`,
                  }}
                />
              </MotionBox>
              <MotionText
                fontSize={{ base: 'lg', md: 'xl' }}
                color={useColorModeValue('gray.600', 'gray.300')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Streamline your real estate business with KeyReach CRM.
              </MotionText>
            </Stack>

            <Stack spacing={12}>
              <Stack textAlign="center" spacing={4}>
                <Heading size="2xl" color={textColor}>
                  Key Features
                </Heading>
                <Text
                  fontSize="xl"
                  color={useColorModeValue('gray.600', 'gray.300')}
                >
                  Explore the powerful features of KeyReach CRM
                </Text>
              </Stack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </SimpleGrid>
            </Stack>

            {/* Replace Image with PriceCheckout */}
            <PriceCheckout />

            {/* New Section: Why KeyReach CRM */}
            <Stack spacing={12} textAlign="center">
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Heading
                  size="2xl"
                  color={textColor}
                  mb={4}
                >
                  Why KeyReach CRM is the Best Choice for Real Estate Professionals
                </Heading>
                <Text
                  fontSize="lg"
                  color={useColorModeValue('gray.600', 'gray.300')}
                >
                  At KeyReach CRM, we understand the challenges real estate professionals face in managing leads, listings, and client relationships. That’s why we built a modern, all-in-one CRM designed specifically for real estate agents, brokers, and teams.
                </Text>
              </MotionBox>

              {/* Accordion Component */}
              <Accordion allowMultiple width="100%">
                {accordionData.map((item, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <AccordionItem
                      border="none"
                      _first={{ borderTop: '1px solid', borderColor: useColorModeValue('gray.200', 'whiteAlpha.300') }}
                      _last={{ borderBottom: '1px solid', borderColor: useColorModeValue('gray.200', 'whiteAlpha.300') }}
                      bg={useColorModeValue('whiteAlpha.50', 'blackAlpha.300')}
                      rounded="xl"
                      overflow="hidden"
                    >
                      <h2>
                        <AccordionButton
                          p={5}
                          _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.200') }}
                        >
                          <Box flex="1" textAlign="left" fontWeight="semibold" color={textColor}>
                            {item.title}
                          </Box>
                          <AccordionIcon color={colors.orange.main} />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4} color={useColorModeValue('gray.600', 'gray.400')}>
                        {item.content}
                      </AccordionPanel>
                    </AccordionItem>
                  </MotionBox>
                ))}
              </Accordion>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Heading size="lg" color={textColor} mt={8}>
                  Ready to Elevate Your Real Estate Business?
                </Heading>
                <Text
                  fontSize="md"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  mb={4}
                >
                  Don’t settle for outdated systems or overpriced software. Join KeyReach CRM today and take control of your real estate business with powerful tools designed for success.
                </Text>
                <Text
                  fontSize="md"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontWeight="bold"
                >
                  Sign up now and start closing more deals effortlessly!
                </Text>
              </MotionBox>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default PricingPage;
