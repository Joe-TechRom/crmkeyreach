'use client'

import { keyframes } from '@emotion/react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Image,
  Button,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiArrowRight } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

// Define animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const Overview = () => {
  const router = useRouter()

  // Enhanced color system (same as Hero)
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  }

  // Hero-like background gradient
  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `

  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')

  // Glass morphism effect (slightly adjusted)
  const glassEffect = {
    background: useColorModeValue(
      'rgba(255, 255, 255, 0.8)', // Slightly less opaque in light mode
      'rgba(26, 32, 44, 0.7)' // Slightly less opaque in dark mode
    ),
    backdropFilter: 'blur(20px)',
    border: '1px solid',
    borderColor: useColorModeValue(
      'rgba(255, 107, 44, 0.15)', // Slightly more visible border in light mode
      'rgba(255, 154, 92, 0.15)' // Slightly more visible border in dark mode
    ),
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      {/* Hero-like background effect */}
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />
      {/* Hero Section */}
      <Container maxW="7xl" pt={32} pb={20} position="relative" zIndex="1">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={20} alignItems="center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VStack align="flex-start" spacing={8}>
              <TypeAnimation
                sequence={[
                  'Transform Your Real Estate Business',
                  1000,
                  'Streamline Your Workflow',
                  1000,
                  'Boost Your Productivity',
                  1000,
                ]}
                wrapper="h1"
                cursor={true}
                repeat={Infinity}
                style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  background: colors.orange.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              />
              <Text fontSize="xl" color={subTextColor}>
                KeyReach CRM empowers real estate professionals with intelligent tools
                and seamless integrations for enhanced productivity and growth.
              </Text>
              <Button
                size="lg"
                bgGradient={colors.orange.gradient}
                color="white"
                px={8}
                h={14}
                onClick={() => router.push('/pricing')}
                _hover={{
                  bgGradient: 'linear-gradient(135deg, #FF9A5C 0%, #FF6B2C 100%)',
                  transform: 'translateY(-2px)',
                  shadow: 'xl',
                }}
                rightIcon={<Icon as={FiArrowRight} />}
                rounded="2xl"
              >
                View Pricing
              </Button>
            </VStack>
          </motion.div>
          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              position="relative"
              rounded="2xl"
              overflow="hidden"
              boxShadow="2xl"
              _after={{
                content: '""',
                position: 'absolute',
                inset: 0,
                bgGradient: colors.orange.gradient,
                opacity: 0.1,
                borderRadius: '2xl',
              }}
            >
              <Image
                src="/images/crm-overview.jpg"
                alt="KeyReach CRM Overview"
                width={768} // Adjusted width for better responsiveness
                height={512} // Adjusted height for better responsiveness
                style={{
                  animation: `${float} 6s ease-in-out infinite`,
                  width: '100%', // Make image responsive
                  height: 'auto', // Maintain aspect ratio
                }}
              />
            </Box>
          </motion.div>
        </SimpleGrid>
      </Container>

      {/* Features Grid */}
      <Container maxW="7xl" py={20} position="relative" zIndex="1">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.7)'),
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: useColorModeValue('rgba(255, 107, 44, 0.15)', 'rgba(255, 154, 92, 0.15)'),
                borderRadius: '1rem',
                padding: '2rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                _hover: {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <VStack align="flex-start" spacing={6}>
                <Box
                  p={3}
                  bg={useColorModeValue('orange.50', 'whiteAlpha.100')}
                  rounded="xl"
                  color="orange.500"
                >
                  {feature.icon}
                </Box>
                <Heading size="md" color={textColor}>
                  {feature.title}
                </Heading>
                <Text color={subTextColor}>{feature.description}</Text>
              </VStack>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

const features = [
  {
    icon: '🎯',
    title: 'Advanced Lead Management',
    description: 'Track and assign leads at various stages, while effortlessly updating property details and statuses.',
  },
  {
    icon: '📱',
    title: 'Social Media Integration',
    description: 'Create and post social media ads on Facebook, Instagram, and Google with one click.',
  },
  {
    icon: '💬',
    title: 'Client Communication',
    description: 'Stay connected with clients using email templates and integrated SMS.',
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Schedule meetings, set reminders, and sync tasks with Google Calendar.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Monitor sales, lead conversions, and ROI with the powerful analytics dashboard.',
  },
  {
    icon: '☁️',
    title: 'Cloud Sync',
    description: 'Enjoy secure cloud backup with multi-device sync for seamless collaboration.',
  },
]

export default Overview
