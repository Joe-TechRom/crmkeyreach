'use client'
import { keyframes } from '@emotion/react'
import {
  Box, Container, Heading, Text, SimpleGrid, VStack, 
  useColorModeValue, Image, Button, Icon
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiArrowRight } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

// Define animations
const shimmer = keyframes`
  from { background-position: 0 0; }
  to { background-position: 200% 0; }
`

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const MotionBox = motion(Box)

export default function Overview() {
  const router = useRouter()  // Enhanced color system
  const colors = {
    primary: {
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
      hover: 'linear-gradient(135deg, #FF9A5C 0%, #FF6B2C 100%)'
    },
    secondary: {
      gradient: 'linear-gradient(135deg, #231745 0%, #4923B4 100%)'
    }
  }

  // Modern glass morphism effect
  const glassEffect = {
    background: useColorModeValue(
      'rgba(255, 255, 255, 0.9)',
      'rgba(26, 32, 44, 0.8)'
    ),
    backdropFilter: 'blur(20px)',
    border: '1px solid',
    borderColor: useColorModeValue(
      'rgba(255, 107, 44, 0.1)',
      'rgba(255, 154, 92, 0.1)'
    )
  }

  return (
    <Box 
      minH="100vh"
      bgGradient={useColorModeValue(
        'radial-gradient(circle at 0% 0%, rgba(255,107,44,0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(35,23,69,0.08) 0%, transparent 50%)',
        'linear-gradient(to bottom right, rgba(26,32,44,0.8), rgba(45,55,72,0.8))'
      )}
      position="relative"
      overflow="hidden"
    >
      {/* Hero Section */}
      <Container maxW="8xl" pt={32} pb={20}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={20} alignItems="center">
          {/* Left Content */}
          <MotionBox
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
                  1000
                ]}
                wrapper="h1"
                cursor={true}
                repeat={Infinity}
                style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  background: colors.primary.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              />
              
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                KeyReach CRM empowers real estate professionals with intelligent tools
                and seamless integrations for enhanced productivity and growth.
              </Text>

              <Button
  size="lg"
  bgGradient={colors.primary.gradient}
  color="white"
  px={8}
  h={14}
  onClick={() => router.push('/pricing')}
  _hover={{
    bgGradient: colors.primary.hover,
    transform: 'translateY(-2px)'
  }}
  rightIcon={<Icon as={FiArrowRight} />}
>
  Sign Up Now
</Button>
            </VStack>
          </MotionBox>

          {/* Right Image */}
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              position="relative"
              _after={{
                content: '""',
                position: 'absolute',
                inset: 0,
                bgGradient: colors.primary.gradient,
                opacity: 0.1,
                borderRadius: '2xl'
              }}
            >
              <Image
                src="/images/crm-overview.jpg"
                 alt="KeyReach CRM Overview"
                rounded="2xl"
                shadow="2xl"
                animation={`${float} 6s ease-in-out infinite`}
              />
            </Box>
          </MotionBox>
        </SimpleGrid>
      </Container>

      {/* Features Grid */}
      <Container maxW="8xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {features.map((feature, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                p={8}
                rounded="2xl"
                {...glassEffect}
                _hover={{
                  transform: 'translateY(-8px)',
                  shadow: 'xl'
                }}
                transition="all 0.3s"
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
                  <Heading size="md">{feature.title}</Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.300')}>
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
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
    gradient: 'linear(to-r, #FF6B2C, #FF9A5C)'
  },
  {
    icon: '📱',
    title: 'Social Media Integration',
    description: 'Create and post social media ads on Facebook, Instagram, and Google with one click.',
    gradient: 'linear(to-r, #4267B2, #E1306C)'
  },
  {
    icon: '💬',
    title: 'Client Communication',
    description: 'Stay connected with clients using email templates and integrated SMS.',
    gradient: 'linear(to-r, #00B2FF, #006AFF)'
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Schedule meetings, set reminders, and sync tasks with Google Calendar.',
    gradient: 'linear(to-r, #34A853, #4285F4)'
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Monitor sales, lead conversions, and ROI with the powerful analytics dashboard.',
    gradient: 'linear(to-r, #7928CA, #FF0080)'
  },
  {
    icon: '☁️',
    title: 'Cloud Sync',
    description: 'Enjoy secure cloud backup with multi-device sync for seamless collaboration.',
    gradient: 'linear(to-r, #0052CC, #2684FF)'
  }
]
