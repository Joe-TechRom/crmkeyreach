'use client'
import { supabase } from '@/lib/supabase/client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiArrowRight, FiUsers, FiTarget } from 'react-icons/fi'
import { useUser } from '@/hooks/useUser'

export default function WelcomeBanner() {
  const { user } = useUser()
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  )
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')

  return (
    <Box
      bgGradient={gradientBg}
      py={12}
      px={4}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
    >
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" wrap="wrap" spacing={4}>
            <VStack align="start" spacing={2}>
              <Heading
                size="2xl"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                letterSpacing="tight"
                fontWeight="extrabold"
              >
                Welcome back, {user?.full_name?.split(' ')[0] || 'Agent'}!
              </Heading>
              <Text 
                fontSize="xl" 
                color={useColorModeValue('gray.600', 'gray.300')}
              >
                Ready to close more deals and make progress? Let's get started!
              </Text>
            </VStack>

            <Button
              rightIcon={<FiArrowRight />}
              colorScheme="blue"
              size="lg"
              onClick={() => window.location.href = '/dashboard/basic/leads'}
            >
              View Active Leads
            </Button>
          </HStack>

          <HStack 
            spacing={6} 
            mt={8}
            wrap="wrap"
          >
            <Box
              bg={cardBg}
              p={6}
              rounded="lg"
              flex="1"
              minW="250px"
              backdropFilter="blur(10px)"
            >
              <HStack spacing={4}>
                <Icon as={FiUsers} w={8} h={8} color="blue.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Active Leads</Text>
                  <Heading size="lg">24</Heading>
                </VStack>
              </HStack>
            </Box>

            <Box
              bg={cardBg}
              p={6}
              rounded="lg"
              flex="1"
              minW="250px"
              backdropFilter="blur(10px)"
            >
              <HStack spacing={4}>
                <Icon as={FiTarget} w={8} h={8} color="purple.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Monthly Goal</Text>
                  <Heading size="lg">75%</Heading>
                </VStack>
              </HStack>
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
