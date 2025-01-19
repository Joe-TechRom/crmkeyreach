'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { createCheckoutSession } from '@/utils/stripe'

export function UpgradeFlow({ currentPlan }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleUpgrade = async (newPlan) => {
    await createCheckoutSession(newPlan.stripePriceId)
    onClose()
  }

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>Upgrade Plan</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upgrade Your Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={6}>
              <Text>Choose your new plan:</Text>
              {availableUpgrades[currentPlan].map(plan => (
                <Button
                  key={plan.id}
                  w="full"
                  onClick={() => handleUpgrade(plan)}
                >
                  Upgrade to {plan.name}
                </Button>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
