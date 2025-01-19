'use client'
import { supabase } from '@/lib/supabase/client'

import { useEffect, useState } from 'react'
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  Badge,
  useColorModeValue,
  Avatar,
  Skeleton
} from '@chakra-ui/react'
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiDollarSign
} from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'

const getActivityIcon = (type) => {
  switch (type) {
    case 'email': return FiMail
    case 'call': return FiPhone
    case 'meeting': return FiCalendar
    case 'document': return FiFileText
    case 'message': return FiMessageSquare
    case 'payment': return FiDollarSign
    default: return FiCalendar
  }
}

export default function ActivityLog({ clientId }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const timelineColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    fetchActivities()
    const subscription = setupActivitySubscription()
    return () => subscription.unsubscribe()
  }, [clientId])

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*, users:user_id(*)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (data) setActivities(data)
    setLoading(false)
  }

  const setupActivitySubscription = () => {
    return supabase
      .channel(`activities-${clientId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'activities',
          filter: `client_id=eq.${clientId}`
        }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setActivities(prev => [payload.new, ...prev])
          }
          if (payload.eventType === 'UPDATE') {
            setActivities(prev => prev.map(activity => 
              activity.id === payload.new.id ? payload.new : activity
            ))
          }
          if (payload.eventType === 'DELETE') {
            setActivities(prev => prev.filter(activity => 
              activity.id !== payload.old.id
            ))
          }
        }
      )
      .subscribe()
  }

  if (loading) {
    return <Skeleton height="400px" />
  }

  return (
    <VStack spacing={0} align="stretch" position="relative">
      {activities.map((activity, index) => (
        <Box
          key={activity.id}
          position="relative"
          pl={8}
          py={4}
          _before={{
            content: '""',
            position: 'absolute',
            left: '15px',
            top: 0,
            bottom: 0,
            width: '2px',
            bg: timelineColor,
            display: index === activities.length - 1 ? 'none' : 'block'
          }}
        >
          <HStack spacing={4} align="flex-start">
            <Box
              p={2}
              bg={`${activity.color}.100`}
              color={`${activity.color}.500`}
              rounded="full"
              position="absolute"
              left={0}
              zIndex={1}
            >
              <Icon as={getActivityIcon(activity.type)} />
            </Box>

            <Box
              flex={1}
              bg={bgColor}
              p={4}
              rounded="lg"
              border="1px"
              borderColor={borderColor}
              shadow="sm"
            >
              <HStack justify="space-between" mb={2}>
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    src={activity.users?.avatar_url} 
                    name={activity.users?.full_name} 
                  />
                  <Text fontWeight="bold">{activity.title}</Text>
                </HStack>
                <Badge colorScheme={activity.color} variant="subtle">
                  {new Date(activity.created_at).toLocaleString()}
                </Badge>
              </HStack>

              <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                {activity.description}
              </Text>

              {activity.duration && (
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Duration: {activity.duration}
                </Text>
              )}
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}
