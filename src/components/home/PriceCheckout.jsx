// src/components/home/PriceCheckout.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Switch,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { customTheme } from '@/styles/theme';
import { subscriptionPlans } from '@/config/plans';

const PriceCard = ({ title, price, features, isPopular, isYearly, planId }) => {
  const router = useRouter();
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };
  const bgColor = useColorModeValue('white', 'neutral.800');
  const borderColor = useColorModeValue('gray.100', 'neutral.700');
  const yearlyPrice = (price * 12 * 0.9).toFixed(2);
  const displayPrice = isYearly ? yearlyPrice : price;
  const billingPeriod = isYearly ? 'per year' : 'per month';
  const handleSignup = () => {
    router.push('/signup/');
  };

  // Check if features is defined before mapping
  const featureList = features ? features : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        rounded="2xl"
        p={8}
        position="relative"
        shadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
        transition="all 0.3s ease"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgGradient: colors.orange.gradient,
          transform: 'scaleX(0)',
          transformOrigin: '0 0',
          transition: 'transform 0.3s ease',
        }}
        _hover={{
          shadow: '2xl',
          borderColor: 'transparent',
          _before: {
            transform: 'scaleX(1)',
          },
        }}
      >
        <Stack spacing={4} textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight={700}
            bgGradient={colors.orange.gradient}
            bgClip="text"
          >
            {title}
          </Text>
          {isPopular && (
            <Badge
              position="absolute"
              top={4}
              right={4}
              rounded="full"
              px={3}
              py={1}
              bgGradient={colors.orange.gradient}
              color="white"
            >
              Most Popular
            </Badge>
          )}
          <Stack spacing={1}>
            <Text fontSize="5xl" fontWeight="bold">
              ${displayPrice}
            </Text>
            <Text fontSize="sm" color={useColorModeValue('neutral.600', 'neutral.400')}>
              {billingPeriod}
            </Text>
            {isYearly && (
              <Text
                fontSize="sm"
                bgGradient={colors.orange.gradient}
                bgClip="text"
                fontWeight="semibold"
              >
                Save 10%
              </Text>
            )}
          </Stack>
          <List spacing={3} textAlign="left">
            {featureList.map((feature, index) => (
              <ListItem key={index}>
                <ListIcon
                  as={CheckIcon}
                  bgGradient={colors.orange.gradient}
                  bgClip="text"
                />
                {feature.text}
              </ListItem>
            ))}
          </List>
          <Button
            w="full"
            h={12}
            bgGradient={colors.orange.gradient}
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
              bgGradient: 'linear-gradient(135deg, #FF9A5C 0%, #FF6B2C 100%)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            onClick={handleSignup}
          >
            Sign Up Now
          </Button>
        </Stack>
      </Stack>
    </motion.div>
  );
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const plans = [
    {
      title: 'Single User',
      price: '49.99',
      planId: 'Basic',
      features: subscriptionPlans.single_user?.features, // Use optional chaining
    },
    {
      title: 'Team',
      price: '99.99',
      planId: 'Team',
      features: [...(subscriptionPlans.team?.features || [])], // Use optional chaining and default to empty array
      isPopular: true,
    },
    {
      title: 'Corporate',
      price: '195.99',
      planId: 'Corporate',
      features: [...(subscriptionPlans.corporate?.features || [])], // Use optional chaining and default to empty array
    },
  ];

  return (
    <Box py={20}>
      <Container maxW="7xl">
        <Stack spacing={4} textAlign="center" mb={12}>
          <Heading
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            color={useColorModeValue('neutral.800', 'white')}
          >
            Flexible Plans, and Powerful Features
          </Heading>
          <Text
            fontSize={{ base: 'lg', lg: 'xl' }}
            color={useColorModeValue('neutral.600', 'neutral.400')}
            maxW="3xl"
            mx="auto"
          >
            Affordable pricing tailored for real estate professionals at every stage of growth!.
          </Text>
          <Flex justify="center" align="center" gap={4}>
            <Text>Monthly</Text>
            <Switch
              size="lg"
              colorScheme="orange"
              isChecked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
            />
            <Text>Yearly (Save 10%)</Text>
          </Flex>
        </Stack>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={8}
          align="stretch"
          justify="center"
        >
          {plans.map((plan, index) => (
            <PriceCard key={index} {...plan} isYearly={isYearly} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
