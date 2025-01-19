'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Switch,
  VStack,
  HStack,
  Button,
  useToast,
  Divider,
  useColorModeValue,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaCookie, FaShieldAlt, FaChartBar, FaBullhorn } from 'react-icons/fa'

const CookieSettings = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences')
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const handleToggle = (type) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    toast({
      title: 'Preferences Saved',
      description: 'Your cookie preferences have been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const switchTrackColor = "blue.700"
  const gradientButton = `linear(to-r, blue.600, blue.800)`

  return (
    <Box bg={bgColor} minH="100vh" pt={32} pb={20}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Icon as={FaCookie} w={12} h={12} color="blue.700" mb={4} />
            <Heading size="2xl" mb={4}>Cookie Settings</Heading>
            <Text fontSize="lg" color="gray.500">
              Manage your cookie preferences and control how we use data to enhance your experience.
            </Text>
          </Box>

          <Box bg={cardBg} p={8} rounded="xl" shadow="lg">
            <Accordion allowMultiple defaultIndex={[0]}>
              <AccordionItem border="none">
                <AccordionButton px={4} py={6}>
                  <HStack flex="1">
                    <Icon as={FaShieldAlt} color="green.500" />
                    <Box flex="1">
                      <Heading size="sm">Necessary Cookies</Heading>
                      <Text fontSize="sm" color="gray.500">Required for the website to function</Text>
                    </Box>
                    <Switch 
                      isChecked={cookiePreferences.necessary} 
                      isDisabled 
                      size="lg"
                      colorScheme="blue"
                    />
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.
                </AccordionPanel>
              </AccordionItem>

              <Divider />

              <AccordionItem border="none">
                <AccordionButton px={4} py={6}>
                  <HStack flex="1">
                    <Icon as={FaCookie} color="blue.700" />
                    <Box flex="1">
                      <Heading size="sm">Functional Cookies</Heading>
                      <Text fontSize="sm" color="gray.500">Enhanced functionality and preferences</Text>
                    </Box>
                    <Switch 
                      isChecked={cookiePreferences.functional}
                      onChange={() => handleToggle('functional')}
                      size="lg"
                      colorScheme="blue"
                    />
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  These cookies enable enhanced functionality and personalization. They may be set by us or third-party providers whose services we've added to our pages.
                </AccordionPanel>
              </AccordionItem>

              <Divider />

              <AccordionItem border="none">
                <AccordionButton px={4} py={6}>
                  <HStack flex="1">
                    <Icon as={FaChartBar} color="purple.500" />
                    <Box flex="1">
                      <Heading size="sm">Analytics Cookies</Heading>
                      <Text fontSize="sm" color="gray.500">Help us understand how you use our site</Text>
                    </Box>
                    <Switch 
                      isChecked={cookiePreferences.analytics}
                      onChange={() => handleToggle('analytics')}
                      size="lg"
                    />
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
                </AccordionPanel>
              </AccordionItem>

              <Divider />

              <AccordionItem border="none">
                <AccordionButton px={4} py={6}>
                  <HStack flex="1">
                    <Icon as={FaBullhorn} color="orange.500" />
                    <Box flex="1">
                      <Heading size="sm">Marketing Cookies</Heading>
                      <Text fontSize="sm" color="gray.500">Used for personalized advertising</Text>
                    </Box>
                    <Switch 
                      isChecked={cookiePreferences.marketing}
                      onChange={() => handleToggle('marketing')}
                      size="lg"
                    />
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          <Box textAlign="center" py={8}>
            <Button
              bgGradient={gradientButton}
              _hover={{
                bgGradient: 'linear(to-r, blue.700, blue.900)',
              }}
              color="white"
              size="lg"
              px={12}
              onClick={savePreferences}
            >
              Save Preferences
            </Button>
          </Box>

          <Box bg={cardBg} p={8} rounded="xl" shadow="lg">
            <Heading size="md" mb={4}>About Our Cookie Policy</Heading>
            <Text color="gray.500">
              We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. 
              By clicking 'Save Preferences' you accept the use of these cookies for the categories you've enabled. 
              You can update these preferences at any time by returning to this page.
              For more information about how we use cookies, please see our Cookie Policy.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default CookieSettings
