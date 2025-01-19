'use client'
import { supabase } from '@/lib/supabase/client'

import {
  VStack,
  Heading,
  Box,
  Text,
  HStack,
  Avatar,
  Badge,
  Icon,
  Divider
} from '@chakra-ui/react'
import { FiMail, FiPhone, FiFileText, FiCalendar } from 'react-icons/fi'

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'email',
      user: 'John Doe',
      action: 'sent an email to',
      target: 'Sarah Smith',
      time: '2 hours ago',
      icon: FiMail,
      color: 'blue'
    },
    {
      id: 2,
      type: 'call',
      user: 'Mike Johnson',
      action: 'had a call with',
      target: 'Robert Brown',
      time: '4 hours ago',
      icon: FiPhone,
      color: 'green'
    },
    {
      id: 3,
      type: 'document',
      user: 'Emily Davis',
      action: 'uploaded document for',
      target: 'Client XYZ',
      time: '6 hours ago',
      icon: FiFileText,
      color: 'purple'
    },
    {
      id: 4,
      type: 'appointment',
      user: 'Lisa Wilson',
      action: 'scheduled meeting with',
      target: 'James Miller',
      time: 'Yesterday',
      icon: FiCalendar,
      color: 'orange'
    }
  ]

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md" mb={2}>Recent Activity</Heading>
      
      {activities.map((activity, index) => (
        <Box key={activity.id}>
          <HStack spacing={4}>
            <Avatar
              size="sm"
              name={activity.user}
              bg={`${activity.color}.500`}
              color="white"
              icon={<Icon as={activity.icon} />}
            />
            <Box flex="1">
              <Text fontWeight="medium">
                {activity.user}{' '}
                <Text as="span" color="gray.500">
                  {activity.action}
                </Text>{' '}
                {activity.target}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {activity.time}
              </Text>
            </Box>
            <Badge colorScheme={activity.color}>{activity.type}</Badge>
          </HStack>
          {index < activities.length - 1 && <Divider my={4} />}
        </Box>
      ))}
    </VStack>
  )
}
