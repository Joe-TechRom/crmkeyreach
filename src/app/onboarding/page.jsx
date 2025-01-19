'use client'

import { useState, useEffect, Suspense } from 'react'
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useToast
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const steps = [
  { title: 'Welcome', description: 'Get started with KeyReach CRM' },
  { title: 'Profile Setup', description: 'Complete your profile information' },
  { title: 'Ready to Go', description: 'Start using KeyReach CRM' }
]

const OnboardingContent = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      verifySubscription(sessionId)
    }
  }, [])

  async function verifySubscription(sessionId) {
    try {
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      if (!response.ok) throw new Error('Subscription verification failed')
      
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to verify subscription',
        status: 'error',
        duration: 5000
      })
      router.push('/signup')
    }
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')
      
      await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)
      
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to complete onboarding',
        status: 'error',
        duration: 5000
      })
    }
  }

  return (
    <Container maxW="4xl" py={20}>
      <Stack spacing={10}>
        <Stack textAlign="center">
          <Heading size="2xl">Welcome to KeyReach CRM</Heading>
          <Text fontSize="xl" color="gray.600">
            Let's get your account set up and ready to go
          </Text>
        </Stack>
        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink='0'>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Stack direction="row" spacing={4} justify="flex-end">
          {activeStep < steps.length - 1 ? (
            <Button
              colorScheme="blue"
              onClick={handleNext}
              size="lg"
            >
              Next Step
            </Button>
          ) : (
            <Button
              colorScheme="green"
              onClick={handleComplete}
              size="lg"
            >
              Complete Setup
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <Container maxW="4xl" py={20}>
        <Stack spacing={10} textAlign="center">
          <Heading size="2xl">Loading...</Heading>
        </Stack>
      </Container>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
