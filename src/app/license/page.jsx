'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  List,
  ListItem,
  OrderedList,
} from '@chakra-ui/react'
import { FaGavel } from 'react-icons/fa'

const LicenseAgreement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'white')

  const Section = ({ title, children }) => (
    <Box bg={cardBg} p={8} rounded="xl" shadow="lg" w="full">
      <Heading size="md" color={headingColor} mb={4}>
        {title}
      </Heading>
      {/* Changed Text to Box and removed fontSize and lineHeight to avoid nested p tags */}
      <Box color={textColor}>
        {children}
      </Box>
    </Box>
  )

  const SectionText = ({ children }) => (
    <Text color={textColor} fontSize="md" lineHeight="tall">
      {children}
    </Text>
  );

  return (
    <Box bg={bgColor} minH="100vh" pt={32} pb={20}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={8}>
            <Icon as={FaGavel} w={12} h={12} color="blue.700" mb={4} />
            <Heading size="2xl" color={headingColor} mb={4}>
              License Agreement
            </Heading>
            <SectionText>
              KeyReach CRM Software License Terms and Conditions
            </SectionText>
          </Box>

          {/* Introduction */}
          <Section title="Agreement Overview">
            <SectionText>
              This License Agreement ("Agreement") is entered into by and between the licensor, KeyReach CRM ("Licensor"), and the end-user, whether an individual or entity ("Licensee"), upon installation, access, or use of the KeyReach CRM software ("Software"). By using the Software, the Licensee agrees to the terms and conditions outlined below.
            </SectionText>
          </Section>

          {/* Grant of License */}
          <Section title="1. Grant of License">
            <SectionText>
              The Licensor grants the Licensee a non-exclusive, non-transferable, revocable license to use the Software solely for its intended purpose as a customer relationship management platform in accordance with this Agreement.
            </SectionText>
          </Section>

          {/* Ownership */}
          <Section title="2. Ownership">
            <SectionText>
              The Software, including but not limited to its source code, design, algorithms, features, and intellectual property, remains the exclusive property of the Licensor. The Licensee does not acquire any ownership rights to the Software by using it.
            </SectionText>
          </Section>

          {/* Permitted Use */}
          <Section title="3. Permitted Use">
            <VStack align="stretch" spacing={4}>
              <SectionText>The Licensee may:</SectionText>
              <List pl={6} spacing={2}>
                <ListItem>
                  <SectionText>
                    a. Install and use the Software on approved devices for its intended purpose.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    b. Access updates, if provided by the Licensor, as part of the licensing agreement.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    c. Use the Software for lawful purposes in compliance with all applicable laws and regulations.
                  </SectionText>
                </ListItem>
              </List>
            </VStack>
          </Section>

          {/* Restrictions */}
          <Section title="4. Restrictions">
            <VStack align="stretch" spacing={4}>
              <SectionText>The Licensee may not:</SectionText>
              <List pl={6} spacing={2}>
                <ListItem>
                  <SectionText>
                    a. Reverse-engineer, decompile, modify, or attempt to derive the source code of the Software.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    b. Distribute, sublicense, sell, lease, or rent the Software to any third party.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    c. Use the Software to transmit unlawful, harmful, or malicious content.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    d. Circumvent or disable any security or access control features of the Software.
                  </SectionText>
                </ListItem>
              </List>
            </VStack>
          </Section>

          {/* Subscription Terms */}
          <Section title="5. Subscription Terms">
            <VStack align="stretch" spacing={4}>
              <OrderedList spacing={3} styleType="lower-alpha">
                <ListItem>
                  <SectionText>
                    The Licensee agrees to pay all applicable subscription fees as outlined by the Licensor at the time of purchase.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    Subscriptions are billed on a [monthly/annual] basis and will automatically renew unless canceled by the Licensee prior to the renewal date.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    Failure to pay subscription fees may result in the suspension or termination of access to the Software.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    The Licensor reserves the right to modify subscription fees upon providing the Licensee with 30 days' notice.
                  </SectionText>
                </ListItem>
              </OrderedList>
            </VStack>
          </Section>

          {/* Data Privacy */}
          <Section title="6. Data Privacy">
            <VStack align="stretch" spacing={4}>
              <OrderedList spacing={3} styleType="lower-alpha">
                <ListItem>
                  <SectionText>
                    The Licensor is committed to protecting the Licensee's data in accordance with applicable privacy laws, including but not limited to the Florida Information Protection Act (FIPA) and federal data privacy regulations.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    Collected data may include user account information, activity logs, and other relevant data necessary for the functionality of the Software.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    The Licensor will not sell, share, or disclose Licensee data to third parties except as required by law or as outlined in the Privacy Policy.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    The Licensee acknowledges that their data may be processed and stored on secure servers located in the United States.
                  </SectionText>
                </ListItem>
                <ListItem>
                  <SectionText>
                    It is the Licensee's responsibility to ensure compliance with data privacy laws applicable to their jurisdiction.
                  </SectionText>
                </ListItem>
              </OrderedList>
            </VStack>
          </Section>

          {/* Updates and Support */}
          <Section title="7. Updates and Support">
            <SectionText>
              The Licensor may, at its sole discretion, provide updates, bug fixes, or enhancements to the Software. Any such updates will be subject to this Agreement unless expressly stated otherwise. Support services may be offered under a separate agreement or subscription plan.
            </SectionText>
          </Section>

          {/* Limitation of Liability */}
          <Section title="8. Limitation of Liability">
            <SectionText>
              The Software is provided "as-is" without any warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement. The Licensor shall not be liable for any damages, including but not limited to loss of data, revenue, or business opportunities, arising from the use or inability to use the Software.
            </SectionText>
          </Section>

          {/* Termination */}
          <Section title="9. Termination">
            <SectionText>
              This Agreement will remain in effect until terminated by either party. The Licensor may terminate this Agreement immediately if the Licensee breaches any of its terms. Upon termination, the Licensee must cease all use of the Software and delete any copies in their possession.
            </SectionText>
          </Section>

          {/* Governing Law */}
          <Section title="10. Governing Law">
            <SectionText>
              This Agreement shall be governed by and construed in accordance with the laws of the State of Florida and the laws of the United States applicable in all 50 states and the District of Columbia. Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of Florida and the United States federal courts.
            </SectionText>
          </Section>

          {/* Entire Agreement */}
          <Section title="11. Entire Agreement">
            <SectionText>
              This Agreement constitutes the entire understanding between the Licensor and the Licensee regarding the Software and supersedes any prior agreements, written or oral, related to its subject matter.
            </SectionText>
          </Section>

          {/* Acknowledgment */}
          <Section title="12. Acknowledgment">
            <SectionText>
              By installing, accessing, or using the Software, the Licensee acknowledges that they have read, understood, and agreed to be bound by this Agreement.
            </SectionText>
          </Section>

          {/* Footer Note */}
          <Box textAlign="center" mt={8} color={textColor}>
            <SectionText>
              Last updated: {new Date().toLocaleDateString()}
            </SectionText>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default LicenseAgreement
