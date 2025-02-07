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
import { TypeAnimation } from 'react-type-animation'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

const gradientText = keyframes`
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
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  }

  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `

  const glassCard = {
    backdropFilter: 'blur(10px)',
    backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)'),
    borderWidth: '1px',
    borderColor: useColorModeValue('gray.200', 'whiteAlpha.100'),
    shadow: 'xl'
  }

  const gradientStyle = {
    backgroundSize: '300% 300%',
    animation: `${gradientText} 5s ease infinite`,
  }

  return (
    <Box
      py={32}
      position="relative"
      overflow="hidden"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />

      <Container maxW="7xl" position="relative" zIndex="1">
        <Stack spacing={24}>
          <Stack spacing={12} align="center" textAlign="center">
            <MotionBox
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              textAlign="center"
              maxW="3xl"
            >
              <TypeAnimation
                sequence={[
                  'Let\'s Build Something Amazing Together',
                  1000,
                  'Let\'s Create Something Amazing Together',
                  1000,
                  'Let\'s Design Something Amazing Together',
                  1000,
                ]}
                wrapper="h1"
                cursor={true}
                repeat={Infinity}
                style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  background: `linear-gradient(-45deg, ${colors.orange.main}, ${colors.orange.light}, #FF8F6B, #FFB088)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '300% 300%',
                  animation: `${gradientText} 5s ease infinite`,
                }}
              />
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="tall"
                mt={6}
              >
                Have questions about KeyReach? We'd love to hear from you.
                Our team is ready to help you transform your business.
              </Text>
            </MotionBox>

            <Grid
              templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
              gap={8}
              w="full"
            >
              {['/images/contact-hero.jpg', '/images/contact-hero-2.jpg'].map((src, index) => (
                <MotionBox
                  key={index}
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
                      src={src}
                      alt={index === 0 ? "Contact KeyReach" : "KeyReach Team"}
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
              ))}
            </Grid>
          </Stack>

          <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
            gap={12}
            alignItems="start"
          >
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
                  {['Name', 'Email'].map((label) => (
                    <FormControl key={label}>
                      <FormLabel fontSize="lg">{label}</FormLabel>
                      <Input
                        size="lg"
                        bg={useColorModeValue('white', 'whiteAlpha.100')}
                        border="none"
                        rounded="xl"
                        _focus={{
                          ring: 2,
                          ringColor: colors.orange.main
                        }}
                      />
                    </FormControl>
                  ))}
                  <FormControl>
                    <FormLabel fontSize="lg">Message</FormLabel>
                    <Textarea
                      rows={6}
                      bg={useColorModeValue('white', 'whiteAlpha.100')}
                      border="none"
                      rounded="xl"
                      _focus={{
                        ring: 2,
                        ringColor: colors.orange.main
                      }}
                    />
                  </FormControl>
                  <Button
                    size="lg"
                    py={7}
                    bgGradient={colors.orange.gradient}
                    color="white"
                    rounded="xl"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "xl",
                      bgGradient: `linear-gradient(135deg, ${colors.orange.main} 0%, ${colors.orange.light} 100%)`
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

            <GridItem>
              <Stack spacing={6}>
                {[
                  {
                    icon: MdEmail,
                    title: 'Email',
                    content: 'hello@keyreach.com'
                  },
                  {
                    icon: MdPhone,
                    title: 'Phone',
                    content: '+1 (234) 567-8900'
                  },
                  {
                    icon: MdLocationOn,
                    title: 'Office',
                    content: '123 Business Ave, Suite 100'
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
                        bgGradient={colors.orange.gradient}
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
