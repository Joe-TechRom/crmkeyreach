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
  Link,
  Flex,
  Spacer,
  Tooltip,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  FaCookie,
  FaShieldAlt,
  FaChartBar,
  FaBullhorn,
  FaQuestionCircle,
} from 'react-icons/fa'

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
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'white')

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences')
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const handleToggle = (type) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
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

  const switchTrackColor = 'blue.700'
  const gradientButton = `linear(to-r, blue.600, blue.800)`

  const CookieDescription = ({ children }) => (
    <Text fontSize="sm" color={textColor}>
      {children}
    </Text>
  )

  return (
    <Box bg={bgColor} minH="100vh" pt={16} pb={20}>
      <Container maxW="5xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Icon as={FaCookie} w={12} h={12} color="blue.700" mb={4} />
            <Heading size="3xl" fontWeight="extrabold" color={headingColor} mb={2}>
              Cookie Settings
            </Heading>
            <Text fontSize="md" color={textColor} maxW="xl" mx="auto">
              Manage your cookie preferences to control how we use data to personalize content,
              tailor ads, and enhance your experience.
            </Text>
          </Box>

          {/* Cookie Preference Accordion */}
          <Box bg={cardBg} p={8} rounded="2xl" shadow="xl">
            <Accordion allowMultiple defaultIndex={[0]}>
              <AccordionItem border="none" py={2}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      px={4}
                      py={5
                      }
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      rounded="md"
                    >
                      <Flex align="center" width="full">
                        <Icon as={FaShieldAlt} color="green.500" mr={4} />
                        <Box flex="1" textAlign="left">
                          <Heading size="sm" fontWeight="semibold" color={headingColor}>
                            Necessary Cookies
                          </Heading>
                          <Text fontSize="xs" color={textColor}>
                            Required for the website to function
                          </Text>
                        </Box>
                        <Spacer />
                        <Switch
                          isChecked={cookiePreferences.necessary}
                          isDisabled
                          size="lg"
                          colorScheme="blue"
                        />
                        <AccordionIcon ml={4} />
                      </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4} px={4}>
                      <CookieDescription>
                        These cookies are essential for the website to function properly. They enable
                        basic functions like page navigation and access to secure areas. The website
                        cannot function properly without these cookies.
                      </CookieDescription>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <Divider />

              <AccordionItem border="none" py={2}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      px={4}
                      py={5}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      rounded="md"
                    >
                      <Flex align="center" width="full">
                        <Icon as={FaCookie} color="blue.700" mr={4} />
                        <Box flex="1" textAlign="left">
                          <Heading size="sm" fontWeight="semibold" color={headingColor}>
                            Functional Cookies
                          </Heading>
                          <Text fontSize="xs" color={textColor}>
                            Enhanced functionality and personalization
                          </Text>
                        </Box>
                        <Spacer />
                        <Switch
                          isChecked={cookiePreferences.functional}
                          onChange={() => handleToggle('functional')}
                          size="lg"
                          colorScheme="blue"
                        />
                        <AccordionIcon ml={4} />
                      </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4} px={4}>
                      <CookieDescription>
                        These cookies enable enhanced functionality and personalization. They may be set
                        by us or third-party providers whose services we've added to our pages.
                      </CookieDescription>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <Divider />

              <AccordionItem border="none" py={2}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      px={4}
                      py={5}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      rounded="md"
                    >
                      <Flex align="center" width="full">
                        <Icon as={FaChartBar} color="purple.500" mr={4} />
                        <Box flex="1" textAlign="left">
                          <Heading size="sm" fontWeight="semibold" color={headingColor}>
                            Analytics Cookies
                          </Heading>
                          <Text fontSize="xs" color={textColor}>
                            Help us understand how you use our site
                          </Text>
                        </Box>
                        <Spacer />
                        <Switch
                          isChecked={cookiePreferences.analytics}
                          onChange={() => handleToggle('analytics')}
                          size="lg"
                          colorScheme="blue"
                        />
                        <AccordionIcon ml={4} />
                      </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4} px={4}>
                      <CookieDescription>
                        These cookies help us understand how visitors interact with our website by
                        collecting and reporting information anonymously. This helps us improve our
                        website and services.
                      </CookieDescription>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <Divider />

              <AccordionItem border="none" py={2}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      px={4}
                      py={5}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      rounded="md"
                    >
                      <Flex align="center" width="full">
                        <Icon as={FaBullhorn} color="orange.500" mr={4} />
                        <Box flex="1" textAlign="left">
                          <Heading size="sm" fontWeight="semibold" color={headingColor}>
                            Marketing Cookies
                          </Heading>
                          <Text fontSize="xs" color={textColor}>
                            Used for personalized advertising
                          </Text>
                        </Box>
                        <Spacer />
                        <Switch
                          isChecked={cookiePreferences.marketing}
                          onChange={() => handleToggle('marketing')}
                          size="lg"
                          colorScheme="blue"
                        />
                        <AccordionIcon ml={4} />
                      </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4} px={4}>
                      <CookieDescription>
                        These cookies are used to track visitors across websites. The intention is to
                        display ads that are relevant and engaging for the individual user.
                      </CookieDescription>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </Box>

          {/* Save Preferences Button */}
          <Box textAlign="center">
            <Button
              bgGradient={gradientButton}
              _hover={{
                bgGradient: 'linear(to-r, blue.700, blue.900)',
              }}
              color="white"
              size="lg"
              px={12}
              py={6}
              fontWeight="bold"
              rounded="full"
              boxShadow="md"
              onClick={savePreferences}
            >
              Save Preferences
            </Button>
          </Box>

          {/* Cookie Policy Information */}
          <Box bg={cardBg} p={8} rounded="2xl" shadow="xl">
            <HStack align="start" spacing={4} mb={4}>
              <Heading size="md" color={headingColor}>
                About Our Cookie Policy
              </Heading>
              <Tooltip label="Why is this important?">
                <Icon as={FaQuestionCircle} color="gray.400" />
              </Tooltip>
            </HStack>
            <CookieDescription>
              We use cookies and similar technologies to help personalize content, tailor and measure
              ads, and provide a better experience. By clicking 'Save Preferences' you accept the use
              of these cookies for the categories you've enabled. You can update these preferences at
              any time by returning to this page. For more information about how we use cookies,
              please see our{' '}
              <Link color="blue.500" href="#" isExternal>
                Cookie Policy
              </Link>
              .
            </CookieDescription>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default CookieSettings
