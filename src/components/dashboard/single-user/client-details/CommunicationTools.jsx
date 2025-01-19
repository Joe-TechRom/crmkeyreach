'use client'
import { supabase } from '@/lib/supabase/client'

import { useEffect, useState } from 'react'
import {
  VStack,
  HStack,
  Box,
  Button,
  Icon,
  Text,
  Tooltip,
  useClipboard,
  useToast,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react'
import { 
  FiMail, 
  FiPhone, 
  FiMessageSquare, 
  FiCopy, 
  FiCalendar,
  FiSend
} from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'

export default function CommunicationTools({ clientId, clientData }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [message, setMessage] = useState('')
  const [communications, setCommunications] = useState([])
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard(clientData?.email || '')
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    fetchCommunications()
    const subscription = setupCommunicationSubscription()
    return () => subscription.unsubscribe()
  }, [clientId])

  const fetchCommunications = async () => {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (data) setCommunications(data)
  }

  const setupCommunicationSubscription = () => {
    return supabase
      .channel(`communications-${clientId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'communications',
          filter: `client_id=eq.${clientId}`
        }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setCommunications(prev => [payload.new, ...prev])
          }
        }
      )
      .subscribe()
  }

  const handleCall = async () => {
    const newCall = {
      client_id: clientId,
      type: 'call',
      status: 'initiated',
      details: `Call initiated to ${clientData?.phone}`
    }

    const { data, error } = await supabase
      .from('communications')
      .insert([newCall])

    window.location.href = `tel:${clientData?.phone}`
  }

  const handleEmail = async () => {
    const newEmail = {
      client_id: clientId,
      type: 'email',
      status: 'sent',
      details: `Email sent to ${clientData?.email}`
    }

    await supabase
      .from('communications')
      .insert([newEmail])

    window.location.href = `mailto:${clientData?.email}`
  }

  const handleSendMessage = async () => {
    const newMessage = {
      client_id: clientId,
      type: 'message',
      status: 'sent',
      content: message,
      details: 'SMS message sent'
    }

    const { error } = await supabase
      .from('communications')
      .insert([newMessage])

    if (!error) {
      toast({
        title: 'Message Sent',
        status: 'success',
        duration: 3000
      })
      setMessage('')
      onClose()
    }
  }

  const handleSchedule = () => {
    // Integrate with appointment scheduler
  }

  return (
    <Box 
      p={6} 
      bg={bgColor} 
      rounded="lg" 
      shadow="md" 
      border="1px" 
      borderColor={borderColor}
      width="full"
    >
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">
          Communication Center
        </Text>

        <HStack spacing={4}>
          <Tooltip label="Call Client">
            <Button
              leftIcon={<FiPhone />}
              colorScheme="green"
              variant="solid"
              onClick={handleCall}
              flex={1}
            >
              Call
            </Button>
          </Tooltip>

          <Tooltip label="Send Email">
            <Button
              leftIcon={<FiMail />}
              colorScheme="blue"
              variant="solid"
              onClick={handleEmail}
              flex={1}
            >
              Email
            </Button>
          </Tooltip>
        </HStack>

        <Divider />

        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">Email</Text>
            <HStack>
              <Text>{clientData?.email}</Text>
              <Icon 
                as={FiCopy} 
                cursor="pointer" 
                onClick={onCopy}
                color={hasCopied ? 'green.500' : 'gray.500'}
              />
            </HStack>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">Phone</Text>
            <Text>{clientData?.phone}</Text>
          </HStack>
        </VStack>

        <Divider />

        <VStack spacing={2}>
          <Button
            leftIcon={<FiMessageSquare />}
            variant="ghost"
            width="full"
            justifyContent="start"
            onClick={onOpen}
          >
            Send Message
          </Button>

          <Button
            leftIcon={<FiCalendar />}
            variant="ghost"
            width="full"
            justifyContent="start"
            onClick={handleSchedule}
          >
            Schedule Follow-up
          </Button>
        </VStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
            />
            <Button
              mt={4}
              colorScheme="blue"
              leftIcon={<FiSend />}
              onClick={handleSendMessage}
              isDisabled={!message.trim()}
            >
              Send
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
