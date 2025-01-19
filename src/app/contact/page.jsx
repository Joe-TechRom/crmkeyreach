'use client'

import { keyframes } from '@emotion/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

const MotionBox = motion(Box)
const MotionStack = motion(Stack)

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const floatingAnimation = {
  y: [-8, 8],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
}

export default function ContactPage() {
  const bgGradient = useColorModeValue(
    'linear-gradient(180deg, #F7F8FA 0%, #FFFFFF 100%)',
    'linear-gradient(180deg, #1A202C 0%, #2D3748 100%)'
  )

  const glassCard = {
    backdropFilter: 'blur(10px)',
    backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)'),
    borderWidth: '1px',
    borderColor: useColorModeValue('gray.200', 'whiteAlpha.100'),
    shadow: 'xl'
  }

  return (
    <Box
      py={32}
      background={bgGradient}
      backgroundSize="200% 200%"
      animation={`${gradientAnimation} 15s ease infinite`}
      minH="100vh"
      overflow="hidden"
      position="relative"
    >
      <Container maxW="7xl" position="relative">
        <Stack spacing={24}>
          {/* Hero Section */}
          <Stack spacing={12} align="center" textAlign="center">
            <MotionBox
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              textAlign="center"
              maxW="3xl"
            >
              <Heading
                fontSize={{ base: '5xl', md: '7xl' }}
                fontWeight="800"
                letterSpacing="-0.02em"
                bgGradient="linear(to-r, #0066FF, #5B8DEF)"
                bgClip="text"
                mb={6}
              >
                Let's Build Something
                <Box as="span" display="block">
                  Amazing Together
                </Box>
              </Heading>
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="tall"
              >
                Have questions about KeyReach? We'd love to hear from you.
                Our team is ready to help you transform your business.
              </Text>
            </MotionBox>

            {/* Image Grid */}
            <Grid
              templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
              gap={8}
              w="full"
            >
              <MotionBox
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
              >
                <Box
                  rounded="2xl"
                  overflow="hidden"
                  {...glassCard}
                  position="relative"
                  height="400px"
                >
                  <Image
                    src="/images/contact-hero.jpg"
                    alt="Contact KeyReach"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.400"
                    transition="all 0.3s"
                    _hover={{ bg: "blackAlpha.200" }}
                  />
                </Box>
              </MotionBox>

              <MotionBox
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
              >
                <Box
                  rounded="2xl"
                  overflow="hidden"
                  {...glassCard}
                  position="relative"
                  height="400px"
                >
                  <Image
                    src="/images/contact-hero-2.jpg"
                    alt="KeyReach Team"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.400"
                    transition="all 0.3s"
                    _hover={{ bg: "blackAlpha.200" }}
                  />
                </Box>
              </MotionBox>
            </Grid>
          </Stack>

          {/* Contact Grid */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
            gap={12}
            alignItems="start"
          >
            {/* Form Section */}
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                {...glassCard}
                rounded="2xl"
                p={8}
              >
                <Stack spacing={8}>
                  <FormControl>
                    <FormLabel fontSize="lg">Name</FormLabel>
                    <Input
                      size="lg"
                      bg={useColorModeValue('white', 'whiteAlpha.100')}
                      border="none"
                      rounded="xl"
                      _focus={{
                        ring: 2,
                        ringColor: 'blue.400'
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg">Email</FormLabel>
                    <Input
                      size="lg"
                      bg={useColorModeValue('white', 'whiteAlpha.100')}
                      border="none"
                      rounded="xl"
                      _focus={{
                        ring: 2,
                        ringColor: 'blue.400'
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg">Message</FormLabel>
                    <Textarea
                      rows={6}
                      bg={useColorModeValue('white', 'whiteAlpha.100')}
                      border="none"
                      rounded="xl"
                      _focus={{
                        ring: 2,
                        ringColor: 'blue.400'
                      }}
                    />
                  </FormControl>
                  <Button
                    size="lg"
                    py={7}
                    bgGradient="linear(to-r, #0066FF, #5B8DEF)"
                    color="white"
                    rounded="xl"
                    _hover={{
                      bgGradient: "linear(to-r, #0052CC, #4B7BE0)",
                      transform: "translateY(-2px)",
                      shadow: "xl"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                  >
                    Send Message
                  </Button>
                </Stack>
              </MotionBox>
            </GridItem>

            {/* Contact Info */}
            <GridItem>
              <Stack spacing={6}>
                {[
                  {
                    icon: MdEmail,
                    title: 'Email',
                    content: 'hello@keyreach.com',
                    gradient: 'linear(to-r, #0066FF, #5B8DEF)'
                  },
                  {
                    icon: MdPhone,
                    title: 'Phone',
                    content: '+1 (234) 567-8900',
                    gradient: 'linear(to-r, #00B5D8, #4299E1)'
                  },
                  {
                    icon: MdLocationOn,
                    title: 'Office',
                    content: '123 Business Ave, Suite 100',
                    gradient: 'linear(to-r, #00A3C4, #3182CE)'
                  }
                ].map((item, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    {...glassCard}
                    p={6}
                    rounded="xl"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "2xl"
                    }}
                  >
                    <Stack direction="row" align="center" spacing={4}>
                      <Box
                        p={3}
                        bgGradient={item.gradient}
                        rounded="lg"
                        color="white"
                      >
                        <Icon as={item.icon} w={6} h={6} />
                      </Box>
                      <Stack spacing={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {item.title}
                        </Text>
                        <Text color={useColorModeValue('gray.600', 'gray.300')}>
                          {item.content}
                        </Text>
                      </Stack>
                    </Stack>
                  </MotionBox>
                ))}
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}
