// src/app/billing/components/PaymentMethodUpdate.jsx
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
  Flex,
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

export const PaymentMethodUpdate = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();
  const supabase = createClientComponentClient();
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const cardBg = useColorModeValue('white', 'whiteAlpha.100');

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleUpdatePaymentMethod = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-billing-portal-session');
      if (error) {
        logError('Error creating billing portal session:', error.message, error);
        toast({
          title: 'Error',
          description: 'Failed to create billing portal session.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to get billing portal URL.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      logError('Error in PaymentMethodUpdate:', err.message, err);
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
          Update Payment Method
        </Heading>
        <Text color={textColor}>
          Click the button below to update your payment information.
        </Text>
        <Button
          colorScheme="blue"
          onClick={onOpen}
        >
          Update Payment Method
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Update Payment Method
              </AlertDialogHeader>
              <AlertDialogBody>
                You will be redirected to the Stripe billing portal to update your payment method.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleUpdatePaymentMethod}
                  ml={3}
                  isLoading={loading}
                >
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    </Box>
  );
};
