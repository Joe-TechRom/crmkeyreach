'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Box,
  useColorModeValue
} from '@chakra-ui/react'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      toast({
        title: 'Reset link sent',
        description: 'Check your email for the password reset link',
        status: 'success',
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="xl" py={20}>
      <Box
        bg={bgColor}
        rounded="2xl"
        shadow="2xl"
        p={8}
        borderWidth="1px"
        borderColor="gray.100"
      >
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Heading size="xl">Reset Password</Heading>
            <Text color="gray.500">
              Enter your email address to receive a password reset link
            </Text>
          </VStack>

          <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isLoading}
                loadingText="Sending..."
              >
                Send Reset Link
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}
