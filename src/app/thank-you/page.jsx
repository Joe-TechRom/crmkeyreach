'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, VStack, Heading, Text, Button,
  useColorModeValue, Icon, Badge
} from '@chakra-ui/react'
import { MdCheckCircle, MdStar } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { useUser } from '@/utils/supabase-user'
import { redirectDashboard } from '@/utils/dashboard'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

export default function ThankYouPage() {
  const router = useRouter()
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      redirectDashboard(user, router);
    }
  }, [user, isLoading, router]);

  const handleLoginClick = () => {
    router.push('/auth/signin');
  };

  return (
    <Container maxW="3xl" py={20}>
      <VStack spacing={12} textAlign="center">
        <MotionText
          fontSize="xl"
          color={useColorModeValue('gray.600', 'gray.300')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Thank you for choosing our plan. Your account is now ready to use.
        </MotionText>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          rounded="xl"
          w="full"
          boxShadow="xl"
          border="1px"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
          _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
        >
          <VStack spacing={6}>
            <Heading
              size="md"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Your Plan Details
            </Heading>
            <Badge
              colorScheme="blue"
              p={2}
              rounded="md"
              fontSize="lg"
            >
              <Icon as={MdStar} mr={2} />
              {user?.tier} Plan
            </Badge>
            <Text
              color={useColorModeValue('green.500', 'green.300')}
              fontWeight="bold"
            >
              Status: Active
            </Text>
          </VStack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            colorScheme="blue"
            onClick={handleLoginClick}
            bgGradient="linear(to-r, blue.400, purple.500)"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
              transform: "translateY(-2px)",
              boxShadow: "lg"
            }}
            px={8}
          >
            Login Now
          </Button>
        </MotionBox>
      </VStack>
    </Container>
  )
}
