'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function CancelFlow({ subscriptionId }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const supabase = createClientComponentClient()

  const handleCancel = async () => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('id', subscriptionId)

    if (!error) {
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will end at the current billing period',
        status: 'success'
      })
      onClose()
    }
  }

  return (
    <>
      <Button variant="outline" colorScheme="red" onClick={onOpen}>
        Cancel Subscription
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Are you sure you want to cancel your subscription?</Text>
              <Text fontSize="sm" color="gray.500">
                You'll continue to have access until the end of your billing period
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Keep Subscription</Button>
            <Button colorScheme="red" onClick={handleCancel}>
              Confirm Cancellation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
