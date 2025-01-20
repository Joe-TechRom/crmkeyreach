'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  SimpleGrid,
  Button as ChakraButton,
} from '@chakra-ui/react';

// Define the Card component directly if import is causing issues
const Card = ({ children, ...props }) => (
  <Box 
    borderRadius="lg"
    boxShadow="xl"
    bg={useColorModeValue('white', 'gray.800')}
    {...props}
  >
    {children}
  </Box>
);

const ContactManagement = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Card p={6} bg={bgColor}>
      <Stack spacing={4}>
        <Heading size="md">Contact Management</Heading>
        
        <Text color={textColor}>
          Efficiently manage your contacts and leads in one centralized location.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Heading size="sm" mb={2}>Quick Actions</Heading>
            <Stack spacing={2}>
              <ChakraButton 
                colorScheme="orange"
                size="sm"
              >
                Add New Contact
              </ChakraButton>
              <ChakraButton
                variant="outline"
                colorScheme="orange"
                size="sm"
              >
                Import Contacts
              </ChakraButton>
              <ChakraButton
                variant="ghost"
                colorScheme="orange"
                size="sm"
              >
                Export List
              </ChakraButton>
            </Stack>
          </Box>

          <Box>
            <Heading size="sm" mb={2}>Recent Activity</Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color={textColor}>
                Last contact added: 2 hours ago
              </Text>
              <Text fontSize="sm" color={textColor}>
                Total contacts: 150
              </Text>
              <Text fontSize="sm" color={textColor}>
                Active leads: 45
              </Text>
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
};

export default ContactManagement;
