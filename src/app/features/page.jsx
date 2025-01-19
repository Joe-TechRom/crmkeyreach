'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Stack, Heading, Text, Icon, useColorModeValue, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, SimpleGrid } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSecurity, MdGroup, MdHomeWork, MdCampaign, MdMessage, MdCalendarToday, MdInsights, MdCloud, MdArrowForward, MdSearch, MdNotifications, MdMap, MdAutoAwesome, MdCalculate, MdFolder, MdPeople } from 'react-icons/md'
import NextLink from 'next/link'
import Image from 'next/image'

const FeaturedSection = ({ title, description, icon: Icon, image, index }) => {
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900')
  
  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg={useColorModeValue('white', 'whiteAlpha.50')}
      rounded="xl"
      overflow="hidden"
      shadow="xl"
      _hover={{ 
        transform: 'translateY(-4px)', 
        shadow: '2xl',
        transition: 'all 0.3s'
      }}
    >
      <Box h="200px" position="relative">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === 0}
          style={{ objectFit: 'cover' }}
          quality={90}
        />
      </Box>
      <Stack p={6} spacing={4}>
        <Stack direction="row" align="center" spacing={4}>
          <Icon
            w={8}
            h={8}
            color="blue.400"
          />
          <Heading size="md" color={textColor}>{title}</Heading>
        </Stack>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>
          {description}
        </Text>
      </Stack>
    </Box>
  )
}

const FeatureSection = ({ title, features, icon: SectionIcon }) => {
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900')
  const hoverBg = useColorModeValue('blue.50', 'whiteAlpha.100')

  return (
    <AccordionItem border="none" mb={4}>
      <AccordionButton
        p={6}
        bg={useColorModeValue('white', 'whiteAlpha.50')}
        rounded="xl"
        _hover={{ bg: hoverBg }}
        transition="all 0.3s"
      >
        <Stack direction="row" align="center" flex="1">
          <Icon
            as={SectionIcon}
            w={8}
            h={8}
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            p={1.5}
            rounded="lg"
          />
          <Heading size="md" color={textColor}>{title}</Heading>
        </Stack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} px={6}>
        <Stack spacing={4}>
          {features?.map((feature, idx) => (
            <Stack
              key={idx}
              direction="row"
              align="flex-start"
              spacing={4}
              p={4}
              rounded="lg"
              _hover={{ bg: hoverBg }}
              transition="all 0.2s"
            >
              <Icon as={feature.icon} w={6} h={6} color="blue.400" mt={1} />
              <Box>
                <Text fontWeight="semibold" color={textColor} mb={1}>
                  {feature.title}
                </Text>
                <Text color={useColorModeValue('gray.600', 'gray.300')}>
                  {feature.description}
                </Text>
              </Box>
            </Stack>
          ))}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}

const featureSections = [
  {
    icon: MdSecurity,
    title: 'User Management',
    description: 'Efficient user management with secure login, role assignment, and authentication.',
    image: '/images/features/user-management.jpg'
  },
  {
    icon: MdGroup,
    title: 'Lead Management',
    description: 'Track and manage leads effortlessly with stage tracking and team assignment capabilities.',
    image: '/images/features/lead-management.jpg'
  },
  {
    icon: MdHomeWork,
    title: 'Property Listings',
    description: 'Easily manage property listings with detailed information and status updates.',
    image: '/images/features/property-listings.jpg'
  },
  {
    icon: MdCampaign,
    title: 'Social Media Advertising',
    description: 'Create and manage multi-platform social media campaigns with integrated analytics.',
    image: '/images/features/social-media.jpg'
  },
  {
    icon: MdMessage,
    title: 'Communication Tools',
    description: 'Stay connected with email templates, push notifications, and SMS integration.',
    image: '/images/features/communication.jpg'
  },
  {
    icon: MdCalendarToday,
    title: 'Calendar & Task Management',
    description: 'Manage schedules and tasks with Google Calendar integration and reminders.',
    image: '/images/features/calendar.jpg'
  },
  {
    title: 'IDX Integration',
    icon: MdSearch,
    features: [
      {
        icon: MdSearch,
        title: 'Advanced Property Search',
        description: 'Powerful search functionality with filters for location, price range, property type, and more.'
      },
      {
        icon: MdNotifications,
        title: 'Automated Property Alerts',
        description: 'Send automated email or SMS alerts about new listings, price changes, and open houses.'
      },
      {
        icon: MdMap,
        title: 'Interactive Maps',
        description: 'Visual property locations with nearby amenities, schools, and transportation hubs.'
      }
    ]
  },
 
  {
    title: 'Workflow Automation',
    icon: MdAutoAwesome,
    features: [
      {
        icon: MdAutoAwesome,
        title: 'Zapier Integration',
        description: 'Create automated workflows connecting your CRM with external tools and services.'
      },
      {
        icon: MdGroup,
        title: 'Lead Management',
        description: 'Automatically capture and distribute leads from various sources to your team.'
      },
      {
        icon: MdCalendarToday,
        title: 'Task Automation',
        description: 'Schedule automated tasks and follow-ups based on lead activities and property updates.'
      }
    ]
  },
  {
    title: 'Financial Tools',
    icon: MdCalculate,
    features: [
      {
        icon: MdCalculate,
        title: 'Mortgage Calculator',
        description: 'Customizable mortgage scenarios with down payment, interest rate, and loan term calculations.'
      },
      {
        icon: MdInsights,
        title: 'ROI Analysis',
        description: 'Generate detailed investment analysis reports for properties and marketing campaigns.'
      },
      {
        icon: MdHomeWork,
        title: 'Property Valuation',
        description: 'Automated property valuations based on market data and comparable properties.'
      }
    ]
  },
  {
    title: 'Document Management',
    icon: MdFolder,
    features: [
      {
        icon: MdFolder,
        title: 'Secure Storage',
        description: 'Centralized document storage for contracts, disclosures, and permits with version control.'
      },
      {
        icon: MdCloud,
        title: 'Cloud Sync',
        description: 'Automatic cloud backup and synchronization across all devices.'
      },
      {
        icon: MdSecurity,
        title: 'Access Control',
        description: 'Role-based document access and sharing permissions for team members.'
      }
    ]
  },
  {
    title: 'Team Collaboration',
    icon: MdPeople,
    features: [
      
      {
        icon: MdCalendarToday,
        title: 'Shared Calendar',
        description: 'Team calendar integration with task assignment and deadline tracking.'
      },
      {
        icon: MdCampaign,
        title: 'Activity Feed',
        description: 'Live updates on team activities, property changes, and client interactions.'
      }
    ]
  }
]

const FeaturesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const bgGradient = useColorModeValue(
    'linear(to bottom right, white, gray.50, white)',
    'linear(to bottom right, #1A1B1E, #141517, #1A1B1E)'
  )
  const cardBg = useColorModeValue('white', 'whiteAlpha.50')
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900')
  const boxBg = useColorModeValue('white', 'whiteAlpha.50')
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const featuredSections = featureSections.slice(0, 6)
  const accordionSections = featureSections.slice(6)

  return (
    <Box 
      py={28}
      mt={20}
      bg={bgGradient}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="7xl" position="relative">
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Stack spacing={16}>
                <Stack spacing={8} textAlign="center">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Heading
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      bgClip="text"
                      fontSize={{ base: '4xl', md: '6xl' }}
                      fontWeight="bold"
                      letterSpacing="tight"
                    >
                      Powerful Features for Real Estate Success
                    </Heading>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <Text
                      fontSize={{ base: 'lg', md: '2xl' }}
                      color={textColor}
                      maxW="3xl"
                      mx="auto"
                      lineHeight="tall"
                    >
                      Experience a comprehensive suite of tools designed to streamline your real estate business operations and drive growth.
                    </Text>
                  </motion.div>
                </Stack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                  {featuredSections.map((section, index) => (
                    <FeaturedSection key={index} {...section} />
                  ))}
                </SimpleGrid>

                <Accordion allowMultiple>
                  {accordionSections.map((section, index) => (
                    <FeatureSection key={index} {...section} />
                  ))}
                </Accordion>

                <Box
                  as={motion.div}
                  bg={boxBg}
                  p={12}
                  rounded="3xl"
                  shadow="2xl"
                  textAlign="center"
                  position="relative"
                  overflow="hidden"
                >
                  <Stack spacing={6} position="relative">
                    <Text
                      fontSize={{ base: '2xl', md: '3xl' }}
                      fontWeight="bold"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      bgClip="text"
                    >
                      Ready to Transform Your Real Estate Business?
                    </Text>
                    <Text 
                      color={textColor}
                      fontSize={{ base: 'lg', md: 'xl' }}
                    >
                      Start your 7-day free trial today and experience the power of KeyReach CRM.
                    </Text>
                    <Button
                      as={NextLink}
                      href="/pricing"
                      size="lg"
                      fontSize="xl"
                      px={10}
                      py={7}
                      rounded="full"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      color="white"
                      _hover={{
                        bgGradient: "linear(to-r, blue.500, purple.600)",
                        transform: "translateY(-2px)",
                        shadow: "xl"
                      }}
                      rightIcon={<MdArrowForward />}
                      alignSelf="center"
                    >
                      Get Started Now
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  )
}

export default FeaturesPage
