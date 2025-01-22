'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { createBrowserClient } from '@supabase/ssr'
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
  useToast,
  VStack,
  Divider,
  HStack,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react'

function SignupPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const textColor = useColorModeValue('gray.700', 'gray.200')
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const planType = searchParams.get('plan') || 'single_user'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setPasswordError('')

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          planType
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      const data = await response.json()

      toast({
        title: 'Account created successfully',
        description: 'Redirecting to payment...',
        status: 'success',
        duration: 3000,
      })

      router.push(`/checkout?session_id=${data.user.id}&tier=${planType}`)

    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="lg" py={12}>
      <VStack spacing={8}>
        <Stack align="center" spacing={2}>
          <Heading size="xl" color={textColor}>
            Create Your Account
          </Heading>
          <Text color={textColor} textAlign="center">
            Complete your registration to continue with your {planType} plan
          </Text>
        </Stack>
        <Box
          w="full"
          bg={bgColor}
          rounded="lg"
          shadow="lg"
          p={8}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={4}>
            <Button
              w="full"
              size="lg"
              onClick={handleGoogleSignup}
              leftIcon={<FcGoogle />}
              isLoading={isGoogleLoading}
              loadingText="Connecting..."
              variant="outline"
              borderColor={borderColor}
              color={textColor}
            >
              Sign up with Google
            </Button>
            <HStack w="full">
              <Divider />
              <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                or continue with email
              </Text>
              <Divider />
            </HStack>
            <form onSubmit={handleSignup} style={{ width: '100%' }}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>
                <FormControl isRequired isInvalid={!!passwordError}>
                  <FormLabel color={textColor}>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                </FormControl>
                <FormControl isRequired isInvalid={!!passwordError}>
                  <FormLabel color={textColor}>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    borderColor={borderColor}
                    color={textColor}
                  />
                  {passwordError && (
                    <FormErrorMessage>{passwordError}</FormErrorMessage>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Create Account & Continue to Payment
                </Button>
              </Stack>
            </form>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default SignupPage
