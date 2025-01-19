'use client'

import { Box, Container, Heading, Text, Stack, UnorderedList, ListItem, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const TermsPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'white')
  const sectionBg = useColorModeValue('white', 'gray.800')

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const Section = ({ title, children }) => (
    <Box
      as={motion.div}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
      bg={sectionBg}
      p={8}
      rounded="xl"
      shadow="lg"
      mb={8}
    >
      <Heading size="lg" mb={4} color={headingColor}>
        {title}
      </Heading>
      {children}
    </Box>
  )

  return (
    <Box pt={{ base: 24, md: 32 }}>
      <Container maxW="4xl" py={20}>
        <Stack spacing={8}>
          <Box textAlign="center" mb={12}>
            <Heading
              as={motion.h1}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              Terms of Service
            </Heading>
            <Text color={textColor} fontSize="lg">
              Effective Date: January 9, 2025
            </Text>
          </Box>

          <Text fontSize="lg" color={textColor} mb={8}>
            Welcome to KeyReach CRM! These Terms of Service ("Terms") govern your access to and use of our platform, tools, and services (collectively, the "Services"). By using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
          </Text>

          <Section title="1. Use of Services">
            <Stack spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>1.1 Eligibility</Text>
                <Text color={textColor}>You must be at least 18 years old to use our Services. By accessing or using our Services, you represent and warrant that you meet this requirement.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>1.2 Account Registration</Text>
                <Text color={textColor}>To access certain features, you must create an account. You agree to provide accurate, complete, and updated information. You are responsible for maintaining the confidentiality of your account credentials.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>1.3 Prohibited Uses</Text>
                <Text color={textColor}>You agree not to:</Text>
                <UnorderedList ml={6} mt={2} spacing={2} color={textColor}>
                  <ListItem>Violate any applicable laws or regulations</ListItem>
                  <ListItem>Use the Services for fraudulent, harmful, or illegal purposes</ListItem>
                  <ListItem>Interfere with the security or functionality of our Services</ListItem>
                  <ListItem>Attempt to gain unauthorized access to other accounts or systems</ListItem>
                </UnorderedList>
              </Box>
            </Stack>
          </Section>

          <Section title="2. Payment and Subscriptions">
  <Stack spacing={4}>
    <Box>
      <Text fontWeight="bold" mb={2}>2.1 Pricing</Text>
      <Text color={textColor}>Access to our Services is offered on a monthly or yearly subscription basis. Our pricing plans are clearly outlined on our website.</Text>
    </Box>
    <Box>
      <Text fontWeight="bold" mb={2}>2.2 Payment Terms</Text>
      <Text color={textColor}>Payments are due at the start of each subscription term (monthly or yearly) and renew automatically unless canceled before the next renewal date.</Text>
    </Box>
    <Box>
      <Text fontWeight="bold" mb={2}>2.3 Free Trial</Text>
      <Text color={textColor}>New users are eligible for a 7-day free trial. If you do not cancel before the trial ends, your account will automatically transition to a paid subscription, and your payment method will be charged for the selected plan.</Text>
    </Box>
    <Box>
      <Text fontWeight="bold" mb={2}>2.4 Cancellation</Text>
      <Text color={textColor}>You may cancel your subscription at any time through your account settings. To avoid being charged for the next billing cycle, cancellations must occur before the current billing period ends.</Text>
    </Box>
  </Stack>
</Section>
<Section title="3. Automatic Renewal">
  <Stack spacing={4}>
    <Box>
      <Text color={textColor}>
        Your subscription will renew automatically at the end of each billing period (monthly or yearly) unless you cancel before the renewal date. Yearly subscribers save 10% compared to monthly pricing.
      </Text>
    </Box>
  </Stack>
</Section>

<Section title="4. Intellectual Property">
  <Stack spacing={4}>
    <Box>
      <Text fontWeight="bold" mb={2}>4.1 Ownership</Text>
      <Text color={textColor}>
        All content, designs, and software provided by KeyReach CRM are our exclusive property. You may not copy, modify, distribute, or reverse-engineer any part of our Services without explicit permission.
      </Text>
    </Box>
    <Box>
      <Text fontWeight="bold" mb={2}>4.2 User Content</Text>
      <Text color={textColor}>
        By uploading content to our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and display that content as necessary to provide the Services.
      </Text>
    </Box>
  </Stack>
</Section>
<Section title="5. Privacy">
  <Stack spacing={4}>
    <Box>
      <Text color={textColor}>
        Your use of our Services is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information.
      </Text>
    </Box>
  </Stack>
</Section>

<Section title="6. Termination">
  <Stack spacing={4}>
    <Box>
      <Text fontWeight="bold" mb={2}>6.1 Termination by You</Text>
      <Text color={textColor}>
        You may terminate your account at any time by contacting us or through your account settings.
      </Text>
    </Box>
    <Box>
      <Text fontWeight="bold" mb={2}>6.2 Termination by Us</Text>
      <Text color={textColor}>
        We reserve the right to suspend or terminate your account for violations of these Terms or if your actions harm the Services or other users.
      </Text>
    </Box>
  </Stack>
</Section>
<Section title="9. Modifications to Terms">
  <Stack spacing={4}>
    <Box>
      <Text color={textColor}>
        We reserve the right to update these Terms at any time. Changes will be effective upon posting, and it is your responsibility to review the Terms periodically.
      </Text>
    </Box>
  </Stack>
</Section>

<Section title="10. Governing Law">
  <Stack spacing={4}>
    <Box>
      <Text color={textColor}>
        These Terms are governed by the laws of Florida, USA. While the Services can be accessed and used across all 51 U.S. states, any disputes arising from these Terms will be subject to the exclusive jurisdiction of Florida courts.
      </Text>
    </Box>
  </Stack>
</Section>

          
          <Section title="11. Contact Us">
            <Stack spacing={4} color={textColor}>
              <Text>For questions or concerns about these Terms, please contact us at:</Text>
              <Text>Email: support@keyreach.com</Text>
              <Text>Phone: +1 (555) 123-4567</Text>
            </Stack>
          </Section>
        </Stack>
      </Container>
    </Box>
  )
}

export default TermsPage
