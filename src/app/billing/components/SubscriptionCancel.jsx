// src/app/billing/components/SubscriptionCancel.jsx
'use client';

import {
  Box,
  Stack,
  Heading,
  Button,
  useToast,
  useColorModeValue,
  Text,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { logError } from '@/lib/utils/log';

export const SubscriptionCancel = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();
  const supabase = createClientComponentClient();
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const cardBg = useColorModeValue('white', 'whiteAlpha.100');

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription');
      if (error) {
        logError('Error canceling subscription:', error.message, error);
        toast({
          title: 'Error',
          description: 'Failed to cancel subscription.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: 'Success',
        description: 'Subscription canceled successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      window.location.reload();
    } catch (err) {
      logError('Error in SubscriptionCancel:', err.message, err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Box bg={cardBg} p={6} rounded="xl" shadow="md">
      <Stack spacing={6}>
        <Heading size="lg" color={textColor}>
          Cancel Subscription
        </Heading>
        <Text color={textColor}>
          If you wish to cancel your subscription, you can do so below.
        </Text>
        <Button
          colorScheme="red"
          onClick={onOpen}
          isDisabled={profile?.subscription_status !== 'active'}
        >
          Cancel Subscription
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Cancel Subscription
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to cancel your subscription? This action
                cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleCancelSubscription}
                  ml={3}
                  isLoading={loading}
                >
                  Confirm Cancel
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    </Box>
  );
};
