'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Box, Container, Heading, Text, Button } from '@chakra-ui/react'

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  return (
    <Container maxW="lg" py={12}>
      <Box textAlign="center" p={8} bg="red.50" rounded="lg">
        <Heading size="lg" color="red.500" mb={4}>Authentication Error</Heading>
        <Text mb={4}>{error_description || 'An error occurred during authentication'}</Text>
        <Button 
          colorScheme="blue"
          onClick={() => router.push('/auth/signup')}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  )
}
