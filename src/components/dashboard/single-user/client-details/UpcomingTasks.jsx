'use client'

import {
  VStack,
  Heading,
  Box,
  Text,
  HStack,
  Progress,
  Badge,
  IconButton,
  Checkbox,
  useColorModeValue
} from '@chakra-ui/react'
import { FiMoreVertical } from 'react-icons/fi'

export default function UpcomingTasks() {
  const tasks = [
    {
      id: 1,
      title: 'Client Onboarding: Sarah Smith',
      dueDate: 'Today',
      priority: 'High',
      progress: 75,
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Property Viewing: 123 Main St',
      dueDate: 'Tomorrow',
      priority: 'Medium',
      progress: 30,
      status: 'Pending'
    },
    {
      id: 3,
      title: 'Contract Review: Johnson Family',
      dueDate: 'Next Week',
      priority: 'Low',
      progress: 90,
      status: 'Review'
    }
  ]

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'red',
      Medium: 'orange',
      Low: 'green'
    }
    return colors[priority]
  }

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md" mb={2}>Upcoming Tasks</Heading>

      {tasks.map((task) => (
        <Box
          key={task.id}
          p={4}
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          _hover={{ transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <HStack justify="space-between" mb={2}>
            <HStack spacing={4}>
              <Checkbox colorScheme="blue" />
              <Text fontWeight="medium">{task.title}</Text>
            </HStack>
            <IconButton
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
              aria-label="More options"
            />
          </HStack>

          <HStack justify="space-between" mb={3}>
            <Text fontSize="sm" color="gray.500">
              Due: {task.dueDate}
            </Text>
            <Badge colorScheme={getPriorityColor(task.priority)}>
              {task.priority} Priority
            </Badge>
          </HStack>

          <Progress
            value={task.progress}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
          />
          
          <HStack justify="space-between" mt={2}>
            <Text fontSize="xs" color="gray.500">
              Progress: {task.progress}%
            </Text>
            <Badge variant="subtle" colorScheme="purple">
              {task.status}
            </Badge>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}
