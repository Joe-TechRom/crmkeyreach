'use client';

import React from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Heading,
  useColorModeValue,
  SimpleGrid,
  Icon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon, StarIcon } from '@chakra-ui/icons';

const StripePaymentSubscription = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const plans = [
    {
      name: 'Basic',
      price: '$29',
      features: ['5 Team Members', 'Basic Analytics', 'Email Support'],
    },
    {
      name: 'Professional',
      price: '$99',
      features: ['Unlimited Team Members', 'Advanced Analytics', '24/7 Support'],
    },
  ];

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
      <Stack spacing={6}>
        <Heading size="md">Subscription Plans</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {plans.map((plan) => (
            <Box
              key={plan.name}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stack spacing={4}>
                <Heading size="md">{plan.name}</Heading>
                <Text fontSize="3xl" fontWeight="bold">
                  {plan.price}
                  <Text as="span" fontSize="sm" fontWeight="normal" color={textColor}>
                    /month
                  </Text>
                </Text>
                
                <List spacing={3}>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} display="flex" alignItems="center">
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      <Text>{feature}</Text>
                    </ListItem>
                  ))}
                </List>

                <Button
                  colorScheme="orange"
                  size="lg"
                  leftIcon={<Icon as={StarIcon} />}
                >
                  Select {plan.name}
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        <Text fontSize="sm" color={textColor} textAlign="center">
          All plans include access to basic features and community support
        </Text>
      </Stack>
    </Box>
  );
};

export default StripePaymentSubscription;
