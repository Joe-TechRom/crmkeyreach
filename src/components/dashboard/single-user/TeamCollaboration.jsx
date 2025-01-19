
'use client'
import { supabase } from '@/lib/supabase/client'

import {
  VStack,
  Heading,
  Box,
  Text,
  HStack,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  SimpleGrid,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react'
import { FiUserPlus, FiMessageSquare, FiShare2, FiFlag } from 'react-icons/fi'

export default function TeamCollaboration() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const teams = [
    {
      id: 1,
      name: 'Sales Team',
      members: [
        { name: 'John Doe', image: 'https://bit.ly/dan-abramov' },
        { name: 'Sarah Smith', image: 'https://bit.ly/ryan-florence' },
        { name: 'Mike Johnson', image: 'https://bit.ly/code-beast' }
      ],
      activeProjects: 12,
      status: 'active'
    },
    {
      id: 2,
      name: 'Marketing Team',
      members: [
        { name: 'Emily Davis', image: 'https://bit.ly/kent-c-dodds' },
        { name: 'Chris Wilson', image: 'https://bit.ly/sage-adebayo' }
      ],
      activeProjects: 8,
      status: 'active'
    }
  ]

  return (
    <VStack align="stretch" spacing={6}>
      <HStack justify="space-between">
        <Heading size="md">Team Collaboration</Heading>
        <Button leftIcon={<FiUserPlus />} colorScheme="blue" size="sm">
          Add Team Member
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {teams.map((team) => (
          <Box
            key={team.id}
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Heading size="sm">{team.name}</Heading>
                <Badge colorScheme="green">{team.status}</Badge>
              </HStack>

              <HStack justify="space-between">
                <AvatarGroup size="sm" max={3}>
                  {team.members.map((member, index) => (
                    <Avatar
                      key={index}
                      name={member.name}
                      src={member.image}
                    />
                  ))}
                </AvatarGroup>
                <Text fontSize="sm" color="gray.500">
                  {team.activeProjects} active projects
                </Text>
              </HStack>

              <HStack spacing={2}>
                <IconButton
                  icon={<FiMessageSquare />}
                  variant="ghost"
                  size="sm"
                  aria-label="Team chat"
                />
                <IconButton
                  icon={<FiShare2 />}
                  variant="ghost"
                  size="sm"
                  aria-label="Share"
                />
                <IconButton
                  icon={<FiFlag />}
                  variant="ghost"
                  size="sm"
                  aria-label="Report"
                />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  )
}
