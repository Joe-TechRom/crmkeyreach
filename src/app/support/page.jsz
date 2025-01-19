'use client'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
  FaSearch, 
  FaHeadset, 
  FaBook, 
  FaVideo, 
  FaComments,
  FaQuestionCircle,
  FaUserCircle,
  FaCreditCard,
  FaCog,
} from 'react-icons/fa'

const MotionBox = motion(Box)

const SupportCard = ({ icon, title, description, buttonText }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={cardBg}
        p={8}
        rounded="xl"
        shadow="lg"
        textAlign="center"
      >
        <Icon as={icon} w={10} h={10} color="blue.500" mb={4} />
        <Heading size="md" mb={4}>{title}</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} mb={6}>
          {description}
        </Text>
        <Button colorScheme="blue" size="md">
          {buttonText}
        </Button>
      </Box>
    </MotionBox>
  )
}

const FAQItem = ({ question, answer }) => (
  <AccordionItem border="none" mb={4}>
    <AccordionButton
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      rounded="lg"
      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
    >
      <Box flex="1" textAlign="left">
        <HStack spacing={4}>
          <Icon as={FaQuestionCircle} color="blue.500" />
          <Text fontWeight="medium">{question}</Text>
        </HStack>
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4} pt={6}>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>
        {answer}
      </Text>
    </AccordionPanel>
  </AccordionItem>
)

export default function Support() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  const faqs = [
    {
      question: "How do I get started with KeyReach CRM?",
      answer: "Getting started is easy! Simply sign up for an account, complete your profile, and follow our quick start guide to begin managing your real estate business effectively."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For enterprise plans, we also offer invoice-based payments."
    },
    {
      question: "Can I import my existing contacts?",
      answer: "Yes! KeyReach CRM supports importing contacts from CSV files, Excel spreadsheets, and direct integration with popular platforms."
    },
    {
      question: "How secure is my data?",
      answer: "We use industry-standard encryption and security measures to protect your data. All information is stored in secure, encrypted databases with regular backups."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer 24/7 email support, live chat during business hours, and priority phone support for enterprise customers. Our help center is also available around the clock."
    }
  ]

  return (
    <Box bg={bgColor} minH="100vh" pt={32}>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('blue.600', 'blue.900')}
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage="url('/images/pattern.svg')"
          opacity={0.1}
        />
        <Container maxW="7xl" position="relative">
          <VStack spacing={6} align="center" textAlign="center">
            <Icon as={FaHeadset} w={16} h={16} mb={4} />
            <Heading size="2xl">How Can We Help?</Heading>
            <Text fontSize="xl" maxW="2xl">
              Find the answers you need through our comprehensive support resources.
            </Text>
            <Box w="full" maxW="2xl" mt={8}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  bg="white"
                  color="gray.800"
                  placeholder="Search for help articles..."
                  _placeholder={{ color: 'gray.400' }}
                  rounded="full"
                />
              </InputGroup>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Support Options */}
      <Container maxW="7xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          <SupportCard
            icon={FaBook}
            title="Knowledge Base"
            description="Browse our comprehensive guides and tutorials."
            buttonText="View Articles"
          />
          <SupportCard
            icon={FaVideo}
            title="Video Tutorials"
            description="Learn through step-by-step video guides."
            buttonText="Watch Now"
          />
          <SupportCard
            icon={FaComments}
            title="Live Chat"
            description="Get real-time assistance from our support team."
            buttonText="Start Chat"
          />
          <SupportCard
            icon={FaHeadset}
            title="Contact Support"
            description="Reach out to our dedicated support team."
            buttonText="Contact Us"
          />
        </SimpleGrid>
      </Container>

      {/* Popular Topics */}
      <Box bg={useColorModeValue('white', 'gray.800')} py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <Heading textAlign="center">Popular Topics</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              <VStack
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={6}
                rounded="xl"
                align="start"
                spacing={4}
              >
                <Icon as={FaUserCircle} w={8} h={8} color="blue.500" />
                <Heading size="md">Account Management</Heading>
                <Button variant="link" colorScheme="blue">
                  Learn More →
                </Button>
              </VStack>
              <VStack
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={6}
                rounded="xl"
                align="start"
                spacing={4}
              >
                <Icon as={FaCreditCard} w={8} h={8} color="blue.500" />
                <Heading size="md">Billing & Subscriptions</Heading>
                <Button variant="link" colorScheme="blue">
                  Learn More →
                </Button>
              </VStack>
              <VStack
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={6}
                rounded="xl"
                align="start"
                spacing={4}
              >
                <Icon as={FaCog} w={8} h={8} color="blue.500" />
                <Heading size="md">Technical Support</Heading>
                <Button variant="link" colorScheme="blue">
                  Learn More →
                </Button>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* FAQs */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={12}>
          <Heading textAlign="center">Frequently Asked Questions</Heading>
          <Accordion allowMultiple w="full">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Accordion>
        </VStack>
      </Container>

      {/* Call to Action */}
      <Box bg={useColorModeValue('blue.600', 'blue.900')} color="white" py={20}>
        <Container maxW="7xl">
          <VStack spacing={6} textAlign="center">
            <Heading>Still Need Help?</Heading>
            <Text fontSize="xl" maxW="2xl">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="blue.800"
              rounded="full"
              px={8}
              _hover={{ bg: 'gray.100' }}
            >
              Contact Support
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
