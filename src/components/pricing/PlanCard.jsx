// src/components/pricing/PlanCard.jsx
'use client';

import {
  Box,
  Stack,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Button,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { createCheckoutSession } from '@/utils/payments';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter

export const PlanCard = ({
  plan,
  isSelected,
  isYearly,
  calculateTotalPrice,
}) => {
  const supabase = createClientComponentClient();
  const toast = useToast();
  const router = useRouter(); // Initialize useRouter
  const [additionalUsers, setAdditionalUsers] = useState(1); // Initialize additionalUsers state
  const [totalPrice, setTotalPrice] = useState(0); // Initialize totalPrice state
  const cardBg = useColorModeValue(isSelected ? 'blue.50' : 'white', isSelected ? 'blue.700' : 'gray.700');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');

  useEffect(() => {
    setAdditionalUsers(1);
  }, [plan.id]);

  useEffect(() => {
    // Recalculate totalPrice whenever additionalUsers or isYearly changes
    setTotalPrice(calculateTotalPrice(plan, isYearly, additionalUsers));
  }, [additionalUsers, isYearly, plan, calculateTotalPrice]);

  const handleSignup = () => {
    router.push(`/auth/signup?tier=${plan.id}`); // Navigate to signup page
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      p={6}
      bg={cardBg}
      position="relative"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
    >
      {plan.id === 'team' && (
        <Badge
          position="absolute"
          top="-2"
          right="-2"
          colorScheme="blue"
          rounded="full"
          px={3}
          py={1}
        >
          Most Popular
        </Badge>
      )}
      <Stack spacing={4}>
        <Heading size="lg" color={textColor}>{plan.name}</Heading>
        <Stack direction="row" align="flex-end">
          <Text fontSize="4xl" fontWeight="bold" color={textColor}>
            ${totalPrice}
          </Text>
          <Text color="gray.500">
            /{isYearly ? 'year' : 'month'}
          </Text>
        </Stack>
        {plan.additionalUserPrice && (
          <Stack spacing={2}>
            <Text fontSize="sm" color="gray.500">
              Additional Users
            </Text>
            <NumberInput
              value={additionalUsers}
              onChange={(value) => setAdditionalUsers(parseInt(value))}
              min={1}
              max={plan.maxUsers - 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper>
                  <NumberDecrementStepper />
                </NumberDecrementStepper>
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.500">
              ${plan.additionalUserPrice}/month per additional user
            </Text>
          </Stack>
        )}
        <List spacing={3}>
          {plan.features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={MdCheckCircle} color="green.500" />
              <Text color={textColor}>{feature.text}</Text>
            </ListItem>
          ))}
        </List>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSignup} // Use handleSignup function
          variant={isSelected ? 'solid' : 'outline'}
        >
          Sign Up Now {/* Change button text */}
        </Button>
      </Stack>
    </Box>
  );
};
