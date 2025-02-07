'use client';

import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { TypeAnimation } from 'react-type-animation';
import DashboardCheckout from '@/components/home/DashboardCheckout';
import {
  MdTrendingUp,
  MdGroup,
  MdInsights,
  MdAutoGraph,
} from 'react-icons/md';
import { subscriptionPlans } from '@/config/plans'; // Import subscriptionPlans
import { useSearchParams } from 'next/navigation';

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

const GreetingCard = ({ name }) => (
  <MotionBox
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('orange.100', 'orange.700')}
      backdropFilter="blur(10px)"
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        bgGradient="linear(to-r, orange.400, orange.600)"
        bgClip="text"
      >
        ✨ Hello, {name || 'Guest'}!
      </Text>
    </Box>
  </MotionBox>
);

const FeatureCard = ({ icon: FeatureIcon, title, description }) => {
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };
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
          <Heading size="md" color={useColorModeValue('neutral.800', 'whiteAlpha.900')}>
            {title}
          </Heading>
          <Text color={useColorModeValue('neutral.800', 'whiteAlpha.900')} lineHeight="tall">
            {description}
          </Text>
        </Stack>
      </Box>
    </motion.div>
  );
};

const contentSections = [
  {
    title: "Welcome to KeyReach CRM",
    content: "You're now inside your KeyReach CRM Dashboard, the all-in-one platform designed to help you manage leads, automate marketing, and close more deals effortlessly."
  },
  {
    title: "Unlock Full Power",
    content: "Right now, you're on the default Tier, giving you a glimpse of what our platform looks like. To access premium features like IDX integration, automated follow-ups, e-signatures, and advanced reporting, upgrade to one of our powerful plans."
  },
  {
    title: "Premium Features",
    content: [
      "Full IDX & MLS integration for real-time listings",
      "Social media automation & one-click ads",
      "Automated workflows & Zapier integrations",
      "E-signatures & document management",
      "Priority support & exclusive training"
    ]
  }
];

const DefaultDashboardPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [name, setName] = useState<string | null>(null);
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
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();
        if (data?.name) {
          setName(data.name);
        } else {
          setName('Guest');
        }
      }
    };
    fetchUserName();
  }, [user, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const handleSubscribe = (planId: string) => {
    if (!planId) {
      toast({
        title: 'Error',
        description: 'Please select a plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

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
      <Flex
        position="absolute"
        top="4"
        right="4"
        zIndex="2"
        alignItems="center"
      >
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="ghost"
            colorScheme="orange"
          />
          <MenuList>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Container maxW="7xl" pt={20} position="relative" zIndex="1">
        <Stack spacing={12}>
          <Flex direction="row" align="flex-start" justify="flex-start">
            <Box mr={4} mt={2}>
              <GreetingCard name={name} />
            </Box>
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              flex="1"
            >
              <TypeAnimation
                sequence={[
                  'Welcome to KeyReach CRM',
                  1000,
                  'Your Real Estate Solution',
                  1000,
                  'Manage. Automate. Grow.',
                  1000,
                ]}
                wrapper="h1"
                cursor={true}
                repeat={Infinity}
                style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  background: `linear-gradient(-45deg, ${colors.orange.main}, ${colors.orange.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '300% 300%',
                  animation: `${textShimmer} 5s ease infinite`,
                }}
              />
            </MotionBox>
          </Flex>
          <Accordion allowMultiple width="100%">
            {contentSections.map((section, index) => (
              <AccordionItem key={index}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">{section.title}</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  {Array.isArray(section.content) ? (
                    <List spacing={3}>
                      {section.content.map((item, idx) => (
                        <ListItem key={idx}>
                          <ListIcon as={CheckIcon} color="orange.500" />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text>{section.content}</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <Stack spacing={12}>
            <Stack textAlign="center" spacing={4}>
              <Heading size="2xl" color={textColor}>
                Key Features
              </Heading>
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
          <Stack spacing={8}>
            <Heading
              size="2xl"
              color={textColor}
              textAlign="center"
            >
              Upgrade to Unlock Full Potential
            </Heading>
            <DashboardCheckout onSubscribe={handleSubscribe} />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default DefaultDashboardPage;
