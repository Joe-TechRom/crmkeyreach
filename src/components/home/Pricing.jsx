// pricing/page.jsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { customTheme } from '@/styles/theme'
import { subscriptionPlans } from '@/config/plans'

const PriceCard = ({ title, price, features, isPopular, isYearly, planId }) => {
  const router = useRouter()
  const bgColor = useColorModeValue('white', 'neutral.800')
  const borderColor = useColorModeValue('neutral.200', 'neutral.700')
  const yearlyPrice = (price * 12 * 0.9).toFixed(2)
  const displayPrice = isYearly ? yearlyPrice : price
  const billingPeriod = isYearly ? 'per year' : 'per month'

  const handleStartTrial = () => {
    router.push(`/auth/signup?plan=${planId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Box
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
        rounded="xl"
        p={8}
        position="relative"
        shadow="lg"
        _hover={{
          transform: 'translateY(-4px)',
          shadow: '2xl',
          transition: 'all 0.2s',
        }}
      >
        <Stack spacing={4} textAlign="center">
          <Heading size="lg">{title}</Heading>
          {isPopular && (
            <Badge
              colorScheme="blue"
              position="absolute"
              top="-3"
              right="-3"
              rounded="full"
              px={3}
              py={1}
            >
              Most Popular
            </Badge>
          )}
          <Stack spacing={1}>
            <Text fontSize="4xl" fontWeight="bold">
              ${displayPrice}
            </Text>
            <Text fontSize="sm" color={useColorModeValue('neutral.600', 'neutral.400')}>
              {billingPeriod}
            </Text>
            {isYearly && (
              <Text fontSize="sm" color={customTheme.colors.primary.main} fontWeight="semibold">
                Save 10%
              </Text>
            )}
          </Stack>
          <List spacing={3} textAlign="left">
            {features.map((feature, index) => (
              <ListItem key={index}>
                <ListIcon as={CheckIcon} color={customTheme.colors.primary.main} />
                {feature.text} {/* Access the text property */}
              </ListItem>
            ))}
          </List>
          <Stack spacing={3}>
            <Button
              w="full"
              bgGradient={customTheme.colors.primary.gradient}
              color="white"
              onClick={handleStartTrial}
              _hover={{
                transform: 'translateY(-2px)',
              }}
            >
              Get Started
            </Button>
            <Text fontSize="sm" color={useColorModeValue('neutral.600', 'neutral.400')}>
              Start your 7-day free trial today
            </Text>
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  )
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      title: 'Single User',
      price: '49.99',
      planId: 'Basic',
      features: subscriptionPlans.singleUser.features
    },
    {
      title: 'Team',
      price: '99.99',
      planId: 'Team',
      features: [...subscriptionPlans.team.features], // Create a new array
      isPopular: true
    },
    {
      title: 'Corporate',
      price: '195.99',
      planId: 'Corporate',
      features: [...subscriptionPlans.corporate.features] // Create a new array
    }
  ]

  return (
    <Box py={20}>
      <Container maxW="7xl">
        <Stack spacing={4} textAlign="center" mb={12}>
          <Heading
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            color={useColorModeValue('neutral.800', 'white')}
          >
            Simple, Transparent Pricing
          </Heading>
          <Text
            fontSize={{ base: 'lg', lg: 'xl' }}
            color={useColorModeValue('neutral.600', 'neutral.400')}
            maxW="3xl"
            mx="auto"
          >
            Choose the plan that best fits your needs. All plans include a 7-day free trial.
          </Text>
          <Flex justify="center" align="center" gap={4}>
            <Text>Monthly</Text>
            <Switch
              size="lg"
              colorScheme="blue"
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
            <PriceCard
              key={index}
              {...plan}
              isYearly={isYearly}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
