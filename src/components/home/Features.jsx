'use client'
import { motion } from 'framer-motion'
import { Box, Container, SimpleGrid, Icon, Text, Stack, Flex, useColorModeValue, Heading, VStack } from '@chakra-ui/react'
import { customTheme } from '@/styles/theme'
import { keyframes } from '@emotion/react'

// Add gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

// Add floating animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-10px) }
  100% { transform: translateY(0px) }
`

const features = [
  {
    id: 1,
    title: 'Lead Management',
    text: 'Track and nurture leads through your sales pipeline with automated follow-ups and task management.',
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Property Management',
    text: 'Organize and track all your property listings with detailed information, photos, and documents in one place.',
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Task Automation',
    text: 'Automate repetitive tasks and workflows to save time and increase productivity across your team.',
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Analytics Dashboard',
    text: 'Get real-time insights into your business performance with customizable reports and analytics.',
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Team Collaboration',
    text: 'Work seamlessly with your team through shared calendars, task assignments, and communication tools.',
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'Document Management',
    text: 'Securely store and manage all your real estate documents with easy access and sharing capabilities.',
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    )
  }
]

const FeatureCard = ({ title, text, icon }) => {
  const colors = {
    primary: customTheme.colors.primary.main,
    cardBg: useColorModeValue('white', 'neutral.800'),
    title: useColorModeValue('neutral.800', 'white'),
    text: useColorModeValue('neutral.600', 'neutral.300'),
    iconBg: useColorModeValue(`${customTheme.colors.primary.main}10`, `${customTheme.colors.primary.main}20`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
    >
      <Stack
        bg={colors.cardBg}
        rounded="2xl"
        p={{ base: 6, md: 8 }}
        spacing={4}
        height="full"
        shadow="lg"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.100', 'neutral.700')}
        transition="all 0.3s ease"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgGradient: 'linear(to-r, orange.400, red.400)',
          transform: 'scaleX(0)',
          transformOrigin: '0 0',
          transition: 'transform 0.3s ease',
        }}
        _hover={{
          shadow: '2xl',
          borderColor: 'transparent',
          _before: {
            transform: 'scaleX(1)',
          }
        }}
      >
        <Flex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          rounded={'2xl'}
          mb={2}
          position="relative"
          sx={{
            '& svg': {
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }
          }}
        >
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-r, orange.400, red.400)"
            opacity={0.15}
            rounded="2xl"
            filter="blur(8px)"
          />
          <Icon 
            as={icon} 
            w={8} 
            h={8} 
            color="orange.400"
            sx={{
              stroke: 'url(#gradient)',
              strokeWidth: '1.5px',
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B2C" />
                <stop offset="100%" stopColor="#FF9A5C" />
              </linearGradient>
            </defs>
          </svg>
        </Flex>
        <Text 
          fontWeight={700} 
          fontSize={{ base: "lg", md: "xl" }}
          letterSpacing="tight"
          bgGradient="linear(to-r, orange.400, red.400)"
          bgClip="text"
          transition="all 0.3s ease"
        >
          {title}
        </Text>
        <Text 
          color={colors.text}
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="tall"
        >
          {text}
        </Text>
      </Stack>
    </motion.div>
  )
}

export default function Features() {
  return (
    <Box py={{ base: 16, md: 20, lg: 28 }}>
      <Container maxW={'7xl'}>
        <VStack spacing={{ base: 8, md: 12 }}>
          <VStack spacing={4} textAlign="center">
            <Heading
              fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, orange.400, red.400)"
              bgClip="text"
              letterSpacing="tight"
            >
              Powerful Features
            </Heading>
            <Text
              fontSize={{ base: 'md', sm: 'lg', lg: 'xl' }}
              color={useColorModeValue('neutral.600', 'neutral.300')}
              maxW="2xl"
              textAlign="center"
            >
              Everything you need to manage your real estate business efficiently
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 8, md: 10, lg: 12 }}
            w="full"
            pt={{ base: 8, md: 12 }}
          >
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                text={feature.text}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}