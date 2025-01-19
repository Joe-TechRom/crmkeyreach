'use client'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function VerifyEmail() {
  const router = useRouter()
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  return (
    <Container maxW="lg" py={12}>
      <Box bg={bgColor} rounded="lg" shadow="xl" p={8}>
        <VStack spacing={6} align="center">
          <Heading size="xl" color={textColor}>Check Your Email</Heading>
          <Text color={textColor} textAlign="center">
            We've sent you a verification link. Click the link in your email to activate your account and complete the checkout process.
          </Text>
          <Text color={textColor} fontSize="sm">
            Didn't receive the email? Check your spam folder or try signing up again.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => router.push('/auth/signup')}
          >
            Back to Sign Up
          </Button>
        </VStack>
      </Box>
    </Container>
  )
}
