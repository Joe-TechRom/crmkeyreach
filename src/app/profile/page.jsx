'use client'

import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Text,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Tooltip
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const MotionContainer = motion(Container)
const MotionCard = motion(Card)

export default function ProfilePage() {
  const router = useRouter()
  const toast = useToast()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  )

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    broker_license: '',
    business_address: '',
    website: '',
    bio: '',
    avatar_url: ''
  })

  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchProfile()
      }
    }
    getUser()
  }, [])

  const handleAvatarUpload = async (event) => {
    if (!user) return

    try {
      setUploadingAvatar(true)
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await updateProfile({ 
        avatar_url: data.publicUrl,
        updated_at: new Date()
      })

      await fetchProfile()

      toast({
        title: 'Profile picture updated',
        status: 'success',
        duration: 3000
      })
    } catch (error) {
      toast({
        title: 'Error uploading image',
        description: error.message,
        status: 'error',
        duration: 5000
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        ...updates,
        updated_at: new Date()
      })

    if (error) throw error
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date()
        })
        .select('*')
        .single()

      if (error) throw error

      setProfile(data)
      
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      await fetchProfile()
      
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard/basic')
  }

  return (
    <MotionContainer
      maxW="container.lg"
      py={8}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={8}>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={handleBackToDashboard}
          alignSelf="flex-start"
        >
          Back to Dashboard
        </Button>

        <MotionCard
          w="full"
          bg={bgColor}
          borderColor={borderColor}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader>
            <Center flexDirection="column" gap={6}>
              <Box position="relative">
                <Avatar
                  size="2xl"
                  name={profile.full_name}
                  src={profile.avatar_url}
                  bg="blue.500"
                >
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="blue"
                    aria-label="Upload Photo"
                    icon={<FiCamera />}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={uploadingAvatar}
                  />
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </Box>
              <Heading
                size="lg"
                bgGradient={gradientBg}
                bgClip="text"
              >
                Profile Settings
              </Heading>
            </Center>
          </CardHeader>

          <CardBody>
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
             <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
  <FormControl>
    <FormLabel>Full Name</FormLabel>
    <Input
      value={profile.full_name}
      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
      placeholder="John Doe"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Email</FormLabel>
    <Input
      value={profile.email}
      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      placeholder="john@example.com"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Phone</FormLabel>
    <Input
      value={profile.phone}
      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
      placeholder="+1 (555) 000-0000"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Company Name</FormLabel>
    <Input
      value={profile.company_name}
      onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
      placeholder="Real Estate Co."
    />
  </FormControl>

  <FormControl>
    <FormLabel>Broker License #</FormLabel>
    <Input
      value={profile.broker_license}
      onChange={(e) => setProfile({ ...profile, broker_license: e.target.value })}
      placeholder="License number"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Website</FormLabel>
    <Input
      value={profile.website}
      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
      placeholder="https://www.example.com"
    />
  </FormControl>

  <FormControl gridColumn={{ md: 'span 2' }}>
    <FormLabel>Business Address</FormLabel>
    <Input
      value={profile.business_address}
      onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
      placeholder="123 Business St, City, State"
    />
  </FormControl>

  <FormControl gridColumn={{ md: 'span 2' }}>
    <FormLabel>Bio</FormLabel>
    <Input
      as="textarea"
      value={profile.bio}
      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      placeholder="Tell us about yourself"
      height="100px"
    />
  </FormControl>
</SimpleGrid>


              <Button
                mt={8}
                size="lg"
                colorScheme="blue"
                type="submit"
                isLoading={loading}
                w="full"
                leftIcon={<FiSave />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Save Changes
              </Button>
            </motion.form>
          </CardBody>
        </MotionCard>
      </Stack>
    </MotionContainer>
  )
}
