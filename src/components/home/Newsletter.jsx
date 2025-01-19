'use client'
import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  Stack,
  useToast,
  VStack,
  List,
  ListItem,
  ListIcon,
  Flex,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa'
import { BsLightningChargeFill } from 'react-icons/bs'
import confetti from 'canvas-confetti'

const MotionBox = motion(Box)
const MotionStack = motion(Stack)

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
  100% { transform: translateY(0) rotate(0deg); }
`

const gradientShift = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

const colors = {
  orange: {
    light: '#FF9A5C',
    main: '#FF6B2C',
    gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)'
  }
}

const benefits = [
  "Time-Saving Tools: Automate tedious tasks like lead tracking and property updates",
  "Professional Ad Creation: Build and launch stunning social media campaigns instantly",
  "Real-Time Collaboration: Keep your team aligned with built-in communication tools",
  "Scalable Solutions: Perfect for solo agents and large teams alike",
  "Unmatched Affordability: Powerful tools at a fraction of the cost"
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.900', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')

  const handleSubmit = (e) => {
    e.preventDefault()
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF6B2C', '#FF9A5C', '#FFB088']
    })
    toast({
      title: 'Welcome to KeyReach CRM!',
      description: "We'll send your access details shortly.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    setEmail('')
  }

  return (
    <Box 
      py={{ base: 16, md: 24, lg: 32 }} 
      position="relative" 
      overflow="hidden" 
      bg={bgColor}
    >
      <Box
        position="absolute"
        inset={0}
        bgGradient={colors.orange.gradient}
        opacity={0.05}
        filter="blur(100px)"
        transform="scale(2)"
        animation={`${gradientShift} 15s ease infinite`}
      />

      <Container maxW={{ base: "xl", lg: "4xl" }} position="relative">
        <MotionStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          spacing={{ base: 10, md: 16 }}
        >
          <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
            <MotionBox
              animate={{ 
                y: [-10, 10],
                rotate: [-5, 5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Icon 
                as={BsLightningChargeFill} 
                w={{ base: 10, md: 12 }}
                h={{ base: 10, md: 12 }}
                color={colors.orange.main}
              />
            </MotionBox>

            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              bgGradient={colors.orange.gradient}
              bgClip="text"
              letterSpacing="tight"
              lineHeight="shorter"
            >
              Transform Your Real Estate Game
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={subTextColor}
              maxW="2xl"
              lineHeight="tall"
            >
              Ready to take your real estate business to the next level? KeyReach CRM is your secret weapon for scaling success.
            </Text>

            <List spacing={4} w="full" mt={8}>
              {benefits.map((benefit, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ListItem
                    display="flex"
                    alignItems="center"
                    p={4}
                    bg={useColorModeValue('white', 'gray.800')}
                    rounded="xl"
                    shadow="md"
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                      bg: useColorModeValue('orange.50', 'gray.700')
                    }}
                    transition="all 0.2s"
                  >
                    <ListIcon
                      as={FaCheckCircle}
                      color={colors.orange.main}
                      fontSize="xl"
                      mr={4}
                    />
                    <Text color={textColor}>{benefit}</Text>
                  </ListItem>
                </MotionBox>
              ))}
            </List>

            <Box
              w="full"
              p={{ base: 6, md: 8 }}
              bg={useColorModeValue('orange.50', 'rgba(255,107,44,0.1)')}
              borderRadius="2xl"
              boxShadow="xl"
              mt={8}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <Text 
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    bgGradient={colors.orange.gradient}
                    bgClip="text"
                    textAlign="center"
                  >
                    Get started with KeyReach CRM today and enjoy a week of free access.
                  </Text>
                  <Flex 
                    gap={4} 
                    direction={{ base: 'column', md: 'row' }}
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                      bg={cardBg}
                      borderWidth={2}
                      borderColor="orange.100"
                      _dark={{ borderColor: 'whiteAlpha.200' }}
                      _hover={{
                        borderColor: colors.orange.main,
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      _focus={{
                        borderColor: colors.orange.main,
                        boxShadow: `0 0 0 3px ${colors.orange.main}33`,
                      }}
                      transition="all 0.3s"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      px={8}
                      bgGradient={colors.orange.gradient}
                      color="white"
                      rightIcon={<FaArrowRight />}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      _active={{
                        bg: colors.orange.main,
                      }}
                      transition="all 0.3s"
                    >
                      Get Started
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Box>
          </VStack>
        </MotionStack>
      </Container>
    </Box>
  )
}
