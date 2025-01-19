'use client'

import { Box, Container, Heading, Text, Stack, Avatar, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Real Estate Agent',
    content: 'KeyReach CRM transformed how I manage my client relationships. The automated follow-ups saved me hours each week.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80'
  },
  {
    name: 'Michael Chen',
    role: 'Property Manager',
    content: 'The property tracking features are incredible. I can manage multiple properties effortlessly and keep clients updated in real-time.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80'
  }
]

export default function Testimonials() {
  return (
    <Box py={16}>
      <Container maxW="7xl">
        <Stack spacing={8}>
          <Heading textAlign="center">What Our Users Say</Heading>
          <Stack spacing={8} direction={{ base: 'column', md: 'row' }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Box
                  p={8}
                  bg="white"
                  _dark={{ bg: 'gray.800' }}
                  rounded="xl"
                  shadow="lg"
                >
                  <Text fontSize="lg" mb={4}>{testimonial.content}</Text>
                  <Flex align="center">
                    <Avatar src={testimonial.avatar} mr={4} />
                    <Box>
                      <Text fontWeight="bold">{testimonial.name}</Text>
                      <Text fontSize="sm" color="gray.500">{testimonial.role}</Text>
                    </Box>
                  </Flex>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
