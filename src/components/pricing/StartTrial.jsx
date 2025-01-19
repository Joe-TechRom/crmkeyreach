'use client'

import { useState } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export const StartTrial = ({ 
  planId, 
  buttonText = 'Start Free Trial', 
  buttonProps = {},
  variant = 'solid' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleStartTrial = () => {
    const url = new URL('/signup', window.location.origin)
    if (planId) {
      url.searchParams.set('plan', planId)
    }
    url.searchParams.set('trial', 'true')
    router.push(url.toString())
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant}
        colorScheme="blue"
        {...buttonProps}
      >
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Your 7-Day Free Trial</ModalHeader>
          <ModalBody>
            <Stack spacing={4} pb={6}>
              <Text>Experience the full power of KeyReach CRM with no commitment.</Text>
              <Text fontWeight="medium">✨ No credit card required</Text>
              <Button 
                onClick={handleStartTrial} 
                colorScheme="blue"
                size="lg"
              >
                Begin Trial
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
