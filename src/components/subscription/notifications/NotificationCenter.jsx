'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Box,
  VStack,
  Heading,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  Stack
} from '@chakra-ui/react'
import { BiBell } from 'react-icons/bi'

export function NotificationCenter() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchNotifications()
    setupRealtimeNotifications()
  }, [])

  const setupRealtimeNotifications = () => {
    const channel = supabase
      .channel('subscription_notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        handleNewNotification(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    setNotifications(notifications || [])
    setUnreadCount(notifications?.filter(n => !n.read).length || 0)
  }

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = async (notificationId) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <>
      <IconButton
        aria-label="Notifications"
        icon={<BiBell />}
        onClick={onOpen}
        position="relative"
      >
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorScheme="red"
            borderRadius="full"
          >
            {unreadCount}
          </Badge>
        )}
      </IconButton>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {notifications.map(notification => (
                <Box
                  key={notification.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  onClick={() => markAsRead(notification.id)}
                  cursor="pointer"
                  bg={notification.read ? 'white' : 'blue.50'}
                >
                  <Stack spacing={2}>
                    <Text fontWeight="bold">{notification.title}</Text>
                    <Text fontSize="sm">{notification.message}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
