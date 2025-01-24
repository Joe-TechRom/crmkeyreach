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
  useColorModeValue, // Import useColorModeValue
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { createCheckoutSession } from '@/utils/payments';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const PlanCard = ({
  plan,
  isSelected,
  isYearly,
  onSelect,
  additionalUsers,
  onUpdateUsers,
  calculateTotalPrice,
}) => {
  const supabase = createClientComponentClient();
  const toast = useToast();
  const totalPrice = calculateTotalPrice(plan, isYearly, additionalUsers);
  const cardBg = useColorModeValue(isSelected ? 'blue.50' : 'white', isSelected ? 'blue.700' : 'gray.700'); // Use useColorModeValue for background
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900'); // Use useColorModeValue for text color

  const handleSubscribe = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Please sign in first',
        status: 'warning',
        duration: 5000,
      });
      return;
    }

    try {
      await createCheckoutSession(
        plan.id,
        isYearly,
        additionalUsers,
        user.id
      );
    } catch (error) {
      toast({
        title: 'Error creating checkout session',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      p={6}
      bg={cardBg} // Use dynamic background
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
        <Heading size="lg" color={textColor}>{plan.name}</Heading> {/* Use dynamic text color */}
        <Stack direction="row" align="flex-end">
          <Text fontSize="4xl" fontWeight="bold" color={textColor}> {/* Use dynamic text color */}
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
              onChange={(value) => onUpdateUsers(parseInt(value))}
              min={0}
              max={plan.maxUsers - 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
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
              <Text color={textColor}>{feature.text}</Text> {/* Use dynamic text color */}
            </ListItem>
          ))}
        </List>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSubscribe}
          variant={isSelected ? 'solid' : 'outline'}
        >
          Start Free Trial
        </Button>
      </Stack>
    </Box>
  );
};
