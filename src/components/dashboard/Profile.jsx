'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardBody
} from '@chakra-ui/react'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'

export default function Profile() {
  const { user } = useUser()
  const toast = useToast()
  const [profile, setProfile] = useState({
    full_name: '',
    company: '',
    phone: '',
    avatar_url: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      toast({
        title: 'Error fetching profile',
        description: error.message,
        status: 'error'
      })
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date()
        })

      if (error) throw error

      toast({
        title: 'Profile updated',
        status: 'success'
      })
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Card>
        <CardBody>
          <Stack spacing={8}>
            <Box textAlign="center">
              <Avatar 
                size="2xl" 
                src={profile.avatar_url}
                name={profile.full_name}
                mb={4}
              />
              <Heading size="lg">Profile Settings</Heading>
            </Box>

            <form onSubmit={updateProfile}>
              <Stack spacing={6}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={loading}
                >
                  Save Changes
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  )
}
