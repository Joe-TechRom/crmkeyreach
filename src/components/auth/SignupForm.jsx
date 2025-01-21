'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react'

export default function AuthForm() {
  const router = useRouter()
  const toast = useToast()
  const { redirectToDashboard } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    selectedTier: 'single_user'
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            subscription_tier: formData.selectedTier
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: formData.email,
            subscription_tier: formData.selectedTier,
            subscription_status: 'trialing',
            created_at: new Date().toISOString(),
            subscription_period_end: null,
            stripe_customer_id: null
          })

        if (profileError) throw profileError

        toast({
          title: 'Account created successfully',
          description: 'Redirecting to payment...',
          status: 'success',
          duration: 3000,
        })
        
        router.push(`/checkout?session_id=${user.id}&tier=${formData.selectedTier}`)
      }
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

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single()

      if (profile?.subscription_status === 'active') {
        redirectToDashboard(user)
      } else {
        router.push(`/checkout?session_id=${user.id}&tier=${profile?.subscription_tier}`)
      }
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box as="form" onSubmit={handleSignup}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Select Tier</FormLabel>
          <Select
            name="selectedTier"
            value={formData.selectedTier}
            onChange={handleInputChange}
          >
            <option value="single_user">Single User</option>
            <option value="team">Team</option>
            <option value="corporate">Corporate</option>
          </Select>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
          loadingText="Processing"
        >
          Sign Up
        </Button>
        <Button
          onClick={handleSignIn}
          variant="outline"
          width="full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </VStack>
    </Box>
  )
}
