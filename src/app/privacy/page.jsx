'use client'

import { Box, Container, Heading, Text, Stack, UnorderedList, ListItem, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const PrivacyPage = () => {
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
              Privacy Policy
            </Heading>
            <Text color={textColor} fontSize="lg">
              Effective Date: January 9, 2025
            </Text>
          </Box>

          <Text fontSize="lg" color={textColor} mb={8}>
            At KeyReach CRM, your privacy and trust are our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform. We comply with Florida law, including the Florida Information Protection Act (FIPA), and strive to meet the highest standards of data security.
          </Text>

          <Section title="1. Information We Collect">
            <Stack spacing={6}>
              <Box>
                <Text fontWeight="bold" mb={2}>1.1 Personal Information</Text>
                <Text color={textColor} mb={2}>We collect personal data when you interact with our platform, such as:</Text>
                <UnorderedList ml={6} spacing={2} color={textColor}>
                  <ListItem>Name</ListItem>
                  <ListItem>Email address</ListItem>
                  <ListItem>Phone number</ListItem>
                  <ListItem>Payment information (e.g., credit card details)</ListItem>
                </UnorderedList>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2}>1.2 Usage Data</Text>
                <Text color={textColor} mb={2}>Information automatically collected when you use our platform includes:</Text>
                <UnorderedList ml={6} spacing={2} color={textColor}>
                  <ListItem>IP address</ListItem>
                  <ListItem>Browser type and version</ListItem>
                  <ListItem>Pages visited and time spent on the platform</ListItem>
                  <ListItem>Device information (e.g., operating system)</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>1.3 Lead and Property Data</Text>
                <Text color={textColor} mb={2}>When you use our lead and property management tools, we may collect and store:</Text>
                <UnorderedList ml={6} spacing={2} color={textColor}>
                  <ListItem>Lead information (e.g., names, contact details, notes)</ListItem>
                  <ListItem>Property details (e.g., location, price, features, images)</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>1.4 Cookies and Tracking</Text>
                <Text color={textColor} mb={2}>We use cookies and similar technologies to:</Text>
                <UnorderedList ml={6} spacing={2} color={textColor}>
                  <ListItem>Enhance user experience</ListItem>
                  <ListItem>Analyze website performance</ListItem>
                  <ListItem>Deliver targeted advertisements</ListItem>
                </UnorderedList>
                <Text color={textColor} mt={2}>You can manage cookie preferences through your browser settings.</Text>
              </Box>
            </Stack>
          </Section>

          <Section title="2. How We Use Your Information">
  <Stack spacing={4}>
    <Text color={textColor}>Your information is used to:</Text>
    <UnorderedList ml={6} spacing={3} color={textColor}>
      <ListItem>
        <Text fontWeight="bold" display="inline">Deliver Services:</Text> Ensure smooth functionality and provide core CRM tools.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Improve User Experience:</Text> Analyze usage patterns and optimize platform features.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Secure Transactions:</Text> Process payments and manage subscriptions securely.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Communicate:</Text> Send updates, respond to inquiries, and provide support.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Comply with Legal Obligations:</Text> Fulfill our duties under Florida law and applicable federal regulations.
      </ListItem>
    </UnorderedList>
  </Stack>
</Section>

<Section title="3. Sharing Your Information">
  <Stack spacing={6}>
    <Text color={textColor}>We do not sell or rent your personal information. However, we may share data in the following circumstances:</Text>
    
    <Box>
      <Text fontWeight="bold" mb={2}>3.1 Service Providers</Text>
      <Text color={textColor}>
        We partner with third-party providers (e.g., payment processors, cloud storage providers) to deliver essential services. These providers are contractually obligated to protect your data.
      </Text>
    </Box>

    <Box>
      <Text fontWeight="bold" mb={2}>3.2 Legal Compliance</Text>
      <Text color={textColor}>
        We may disclose your information to comply with Florida law, respond to subpoenas, or cooperate with law enforcement investigations.
      </Text>
    </Box>

    <Box>
      <Text fontWeight="bold" mb={2}>3.3 Preventing Fraud and Hacking</Text>
      <Text color={textColor}>
        To protect our platform and users, we may share information with cybersecurity experts or law enforcement when unauthorized access or hacking is detected.
      </Text>
    </Box>
  </Stack>
</Section>
<Section title="4. Data Security and Protection">
  <Stack spacing={6}>
    <Text color={textColor}>
      We take robust measures to safeguard your data against unauthorized access, hacking, and breaches:
    </Text>
    
    <UnorderedList ml={6} spacing={3} color={textColor}>
      <ListItem>
        <Text fontWeight="bold" display="inline">Encryption:</Text> All data is encrypted during transmission (HTTPS) and at rest.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Biometric Authentication:</Text> Secure login options, including fingerprint and face recognition.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Access Controls:</Text> User roles limit access to sensitive data.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Monitoring:</Text> Regular audits and real-time threat detection ensure platform security.
      </ListItem>
    </UnorderedList>

    <Box mt={4}>
      <Text fontWeight="bold" mb={2}>Compliance with FIPA</Text>
      <Text color={textColor}>
        As required by the Florida Information Protection Act, we will notify affected individuals and the Florida Department of Legal Affairs in the event of a data breach involving personal information.
      </Text>
    </Box>
  </Stack>
</Section>

<Section title="5. Your Rights">
  <Stack spacing={6}>
    <Box>
      <Text fontWeight="bold" mb={2}>5.1 Access and Update</Text>
      <Text color={textColor}>
        You can review and update your account information through your profile settings.
      </Text>
    </Box>

    <Box>
      <Text fontWeight="bold" mb={2}>5.2 Data Deletion</Text>
      <Text color={textColor}>
        Request the deletion of your account and associated data by contacting us. Some data may be retained as required by law.
      </Text>
    </Box>

    <Box>
      <Text fontWeight="bold" mb={2}>5.3 Opt-Out</Text>
      <Text color={textColor}>
        Unsubscribe from marketing emails or adjust notification settings in your account.
      </Text>
    </Box>
  </Stack>
</Section>
<Section title="6. Automatic Renewal and Subscription Management">
  <Stack spacing={4}>
    <Text color={textColor}>
      Our subscriptions renew automatically (monthly or yearly). To avoid charges, cancel your subscription before the renewal date.
    </Text>
    <Box mt={4}>
      <Text fontWeight="bold" mb={2}>7-Day Free Trial</Text>
      <Text color={textColor}>
        Cancel before the trial ends to avoid being charged for the next billing cycle.
      </Text>
    </Box>
  </Stack>
</Section>

<Section title="7. Florida-Specific Rights">
  <Stack spacing={6}>
    <Text color={textColor}>
      Residents of Florida are entitled to additional privacy rights under FIPA:
    </Text>
    <UnorderedList ml={6} spacing={3} color={textColor}>
      <ListItem>
        <Text fontWeight="bold" display="inline">Data Breach Notification:</Text> In the event of unauthorized access to your personal information, we will notify you within 30 days, as required by Florida law.
      </ListItem>
      <ListItem>
        <Text fontWeight="bold" display="inline">Transparency:</Text> You may request details about how your information is stored and shared.
      </ListItem>
    </UnorderedList>
    <Text color={textColor}>
      To exercise your rights, contact us at [Insert Contact Information].
    </Text>
  </Stack>
</Section>
<Section title="8. Hacking and Cybersecurity">
  <Stack spacing={4}>
    <Text color={textColor}>
      We take hacking and cybersecurity threats seriously. If we detect unauthorized access, phishing, or hacking attempts, we will:
    </Text>
    <UnorderedList ml={6} spacing={3} color={textColor}>
      <ListItem>Temporarily suspend affected accounts to prevent further breaches.</ListItem>
      <ListItem>Notify affected users and law enforcement authorities immediately.</ListItem>
      <ListItem>Implement enhanced security measures, including password resets and additional authentication layers.</ListItem>
    </UnorderedList>
  </Stack>
</Section>

<Section title="9. Changes to This Policy">
  <Stack spacing={4}>
    <Text color={textColor}>
      We may update this Privacy Policy to reflect changes in our practices or Florida law. Changes will be effective immediately upon posting, and the updated date will appear at the top of this page.
    </Text>
  </Stack>
</Section>

<Section title="10. Contact Us">
  <Stack spacing={4}>
    <Text color={textColor}>
      If you have questions or concerns about this Privacy Policy, please contact us:
    </Text>
    <UnorderedList ml={6} spacing={3} color={textColor}>
      <ListItem>Email: support@keyreach.com</ListItem>
      <ListItem>Phone: +1 (555) 123-4567</ListItem>
      <ListItem>Mail: 123 Business Street, Miami, FL 33101</ListItem>
    </UnorderedList>
  </Stack>
</Section>


        </Stack>
      </Container>
    </Box>
  )
}

export default PrivacyPage
