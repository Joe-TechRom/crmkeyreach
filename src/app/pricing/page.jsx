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
  Button,
  Switch,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  MdCheckCircle,
  MdTrendingUp,
  MdGroup,
  MdInsights,
  MdAutoGraph,
} from 'react-icons/md';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const yearlyDiscount = 0.10;
  const bgGradient = useColorModeValue(
    'radial-gradient(circle at 0% 0%, rgba(0, 102, 255, 0.1) 0%, transparent 30%), radial-gradient(circle at 100% 100%, rgba(91, 142, 239, 0.1) 0%, transparent 30%)',
    'radial-gradient(circle at 0% 0%, rgba(26, 32, 44, 0.3) 0%, transparent 30%), radial-gradient(circle at 100% 100%, rgba(45, 55, 72, 0.3) 0%, transparent 30%)'
  );
  const cardBg = useColorModeValue('white', 'whiteAlpha.100');
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900');

  const handleStartTrial = async (planId) => {
    router.push(`/auth/signup?plan=${planId}`);
  };

  const calculatePrice = (monthlyPrice) => {
    if (isYearly) {
      const yearlyPrice = monthlyPrice * 12 * (1 - yearlyDiscount);
      return [Number((yearlyPrice / 12).toFixed(2)), Number(yearlyPrice.toFixed(2))];
    }
    return [Number(monthlyPrice), Number((monthlyPrice * 12).toFixed(2))];
  };

  const features = [
    {
      icon: MdTrendingUp,
      title: 'Lead Management',
      description: 'Try our complete lead management system free for 7 days',
    },
    {
      icon: MdAutoGraph,
      title: 'Ad Creation',
      description: 'Experience automated ad creation across platforms',
    },
    {
      icon: MdGroup,
      title: 'Team Collaboration',
      description: 'Test drive our team collaboration features',
    },
    {
      icon: MdInsights,
      title: 'Analytics & Reporting',
      description: 'Access comprehensive analytics during your trial',
    },
  ];

  const pricingPlans = [
    {
      name: 'Single User',
      price: 49.99,
      id: 'basic',
      features: [
        'All core CRM features',
        'Lead CRUD operations',
        'Lead stage tracking',
        'Property tracking',
        'Ad creation tools',
        'Multi-platform posting',
        'Email integration',
        'Basic reporting',
        'Social Media Integration',
      ],
    },
    {
      name: 'Team',
      price: 99.99,
      id: 'team',
      popular: true,
      features: [
        'Everything in Single User, plus:',
        'Up to 20 team members',
        'Team member assignment',
        'Team collaboration tools',
        'Performance analytics',
        'Advanced reporting',
        'API access',
        'Priority support',
        '$10/month per additional user',
      ],
    },
    {
      name: 'Corporate',
      price: 195.99,
      id: 'corporate',
      features: [
        'Everything in Team, plus:',
        'Up to 150 team members',
        'Enterprise-grade security',
        'Custom integrations',
        'Dedicated account manager',
        'Custom analytics dashboard',
        'White-label options',
        'SLA guarantees',
        'Premium support 24/7',
        'Onboarding assistance',
        '$7.99/month per additional user',
      ],
    },
  ];

  const PricingCard = ({ plan, isYearly, monthlyPrice, yearlyPrice, isPopular }) => {
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
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Box
          {...glassEffect}
          rounded="2xl"
          overflow="hidden"
          position="relative"
          borderWidth={isPopular ? '2px' : '1px'}
          borderColor={isPopular ? 'blue.400' : 'transparent'}
          shadow="xl"
          _hover={{ shadow: '2xl' }}
          transition="all 0.3s"
        >
          {isPopular && (
            <Badge
              position="absolute"
              top={4}
              right={4}
              colorScheme="blue"
              variant="solid"
              rounded="full"
              px={3}
              py={1}
            >
              Most Popular
            </Badge>
          )}
          <Box p={8}>
            <Stack spacing={6}>
              <Stack spacing={4}>
                <Heading size="lg" color={textColor}>
                  {plan.name}
                </Heading>
                <Stack direction="row" align="flex-start" spacing={2}>
                  <Text
                    fontSize="5xl"
                    fontWeight="900"
                    color={textColor}
                    lineHeight="1"
                  >
                    ${monthlyPrice.toFixed(2)}
                  </Text>
                  <Stack spacing={0}>
                    <Text color={textColor} pt={2}>
                      /month
                    </Text>
                    {isYearly && (
                      <Text color="green.500" fontSize="sm">
                        ${yearlyPrice.toFixed(2)}/year
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Stack>
              <Box
                h="1px"
                bgGradient="linear(to-r, transparent, blue.200, transparent)"
                opacity={0.5}
              />
              <Stack spacing={4}>
                {plan.features.map((feature, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={4}
                    align="center"
                    _hover={{ bg: useColorModeValue('blue.50', 'whiteAlpha.100') }}
                    p={2}
                    rounded="md"
                    transition="all 0.2s"
                  >
                    <Icon
                      as={MdCheckCircle}
                      color={isPopular ? 'blue.400' : 'green.500'}
                      w={5}
                      h={5}
                    />
                    <Text color={textColor}>{feature}</Text>
                  </Stack>
                ))}
              </Stack>
              <Stack spacing={3}>
                <Button
                  size="lg"
                  onClick={() => handleStartTrial(plan.id)}
                  w="full"
                  py={7}
                  bgGradient={
                    isPopular
                      ? 'linear(135deg, #0066FF 0%, #5B8DEF 100%)'
                      : 'none'
                  }
                  color={isPopular ? 'white' : 'blue.400'}
                  variant={isPopular ? 'solid' : 'outline'}
                  borderColor={isPopular ? 'none' : 'blue.400'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'xl',
                    bgGradient: isPopular
                      ? 'linear(135deg, #0052CC 0%, #4B7BE0 100%)'
                      : 'none',
                    bg: !isPopular && 'blue.50',
                  }}
                >
                  Signup now
                </Button>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  No commitment required
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </motion.div>
    );
  };

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
            bgGradient: 'linear(to-r, blue.400, purple.500)',
            opacity: 0.2,
          }}
        >
          <Stack spacing={4}>
            <Icon as={FeatureIcon} w={10} h={10} color="blue.400" />
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

  return (
    <Box bg={bgGradient} minH="100vh" pb={20} boxShadow="0 4px 12px rgba(0,0,0,0.1)">
      <Container maxW="7xl" pt={20}>
        <Stack spacing={20}>
          <Stack textAlign="center" spacing={8}>
            <MotionBox
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              bgClip="text"
              bgGradient="linear(to-r, blue.400, purple.500)"
              style={{
                backgroundSize: '200% auto',
                animation: `${textShimmer} 5s linear infinite`,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Unlock Your Real Estate Potential
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
          <Stack spacing={12}>
            <Stack textAlign="center" spacing={4}>
              <Heading size="2xl" color={textColor}>
                Choose Your Plan
              </Heading>
              <Text
                fontSize="xl"
                color={useColorModeValue('gray.600', 'gray.300')}
              >
                Select the perfect plan for your business needs
              </Text>
              <HStack justify="center" align="center" spacing={4}>
                <Text>Monthly</Text>
                <Switch
                  size="lg"
                  colorScheme="blue"
                  colorScheme="blue"
                  isChecked={isYearly}
                  onChange={() => setIsYearly(!isYearly)}
                />
                <Text>Yearly</Text>
                <Text
                  as="span"
                  fontSize="sm"
                  color="green.500"
                  fontWeight="bold"
                >
                  (10% off)
                </Text>
              </HStack>
            </Stack>
            <SimpleGrid
              columns={{ base: 1, lg: 3 }}
              spacing={{ base: 8, lg: 12 }}
              w="full"
            >
              {pricingPlans.map((plan, index) => {
                const [monthlyPrice, yearlyPrice] = calculatePrice(plan.price)
                return (
                  <PricingCard
                    key={plan.name}
                    plan={plan}
                    isYearly={isYearly}
                    monthlyPrice={monthlyPrice}
                    yearlyPrice={yearlyPrice}
                    isPopular={plan.popular}
                  />
                )
              })}
            </SimpleGrid>
            <MotionBox
              initial={{ opacity: 0, y: 20, scale: 1 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', justifyContent: 'center' }}
              rounded="2xl"
              overflow="hidden"
            >
              <Image
                src="/images/hero.jpg"
                alt="KeyReach CRM Hero Image"
                maxW="600px"
                style={{ animation: `${float} 5s ease-in-out infinite` }}
                rounded="2xl"
              />
            </MotionBox>
          </Stack>
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            bg={cardBg}
            rounded="3xl"
            p={{ base: 8, md: 16 }}
            shadow="2xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              inset: 0,
              bgGradient: 'linear(135deg, #2D5BFF 0%, #6B8EFF 100%)',
              opacity: 0.05,
              borderRadius: '3xl',
            }}
          >
            <Stack spacing={8} position="relative">
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="medium"
                color={textColor}
                lineHeight="tall"
              >
                Start your 7-day free trial today and experience how KeyReach CRM can revolutionize your real estate business. Cancel anytime before 7 days. No commitment required.
              </Text>
              <Stack spacing={4}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Try all premium features risk-free for 7 days.
                </Text>
                <Text fontSize="lg" color={textColor}>
                  Join thousands of successful real estate professionals who trust
                  KeyReach CRM to grow their business.
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default PricingPage
