'use client'
import { Box, Container, Stack, SimpleGrid, Text, Link, Icon, useColorModeValue, HStack, Divider } from '@chakra-ui/react'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import NextLink from 'next/link'
import { motion } from 'framer-motion'

const Footer = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('gray.700', 'gray.300')
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const hoverColor = useColorModeValue('blue.500', 'blue.300')

  const links = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' }
    ],
    resources: [
      { label: 'Community', href: '/community' },
      { label: 'Contact', href: '/contact' }
    ],
    legal: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookie-settings' },
      { label: 'License', href: '/license' }
    ]
  }

  const contactInfo = [
    { icon: MdEmail, label: 'support@keyreach.com', href: 'mailto:support@keyreach.com' },
    { icon: MdPhone, label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MdLocationOn, label: 'San Francisco, CA', href: '#' }
  ]

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com/keyreach' },
    { icon: FaInstagram, href: 'https://instagram.com/keyreach' },
    { icon: FaTwitter, href: 'https://twitter.com/keyreach' },
    { icon: FaYoutube, href: 'https://youtube.com/keyreach' }
  ]

  const MotionLink = motion(Link)

  return (
    <Box
      as="footer"
      bg={useColorModeValue('white', 'gray.900')}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
    >
      <Container maxW="8xl" py={10}>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={8} mb={8}>
          {/* Company Info */}
          <Stack spacing={4} gridColumn={{ base: "span 2", md: "span 3", lg: "span 2" }}>
            <Text fontSize="lg" fontWeight="bold" color={linkColor}>
              KeyReach CRM
            </Text>
            <Stack spacing={2}>
              {contactInfo.map((item, index) => (
                <MotionLink
                  key={index}
                  href={item.href}
                  display="flex"
                  alignItems="center"
                  fontSize="sm"
                  whileHover={{ x: 2 }}
                  color={linkColor}
                  _hover={{ color: hoverColor }}
                >
                  <Icon as={item.icon} mr={2} />
                  <Text>{item.label}</Text>
                </MotionLink>
              ))}
            </Stack>
          </Stack>

          {/* Links Sections */}
          {Object.entries(links).map(([title, items]) => (
            <Stack key={title} spacing={3}>
              <Text fontSize="sm" fontWeight="semibold" color={linkColor} textTransform="uppercase">
                {title}
              </Text>
              <Stack spacing={2}>
                {items.map((link, index) => (
                  <MotionLink
                    key={index}
                    as={NextLink}
                    href={link.href}
                    fontSize="sm"
                    color={textColor}
                    whileHover={{ x: 2 }}
                    _hover={{ color: hoverColor }}
                  >
                    {link.label}
                  </MotionLink>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>

        <Divider borderColor={borderColor} />

        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          pt={6}
          spacing={4}
        >
          <Text fontSize="sm">
            © {new Date().getFullYear()} KeyReach CRM. All rights reserved.
          </Text>
          
          <HStack spacing={4}>
            {socialLinks.map((social, index) => (
              <MotionLink
                key={index}
                href={social.href}
                isExternal
                color={linkColor}
                whileHover={{ y: -2 }}
                _hover={{ color: hoverColor }}
              >
                <Icon as={social.icon} w={5} h={5} />
              </MotionLink>
            ))}
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
