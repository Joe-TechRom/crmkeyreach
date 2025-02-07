'use client';
import {
  Box,
  Heading,
  Grid,
  SimpleGrid,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaUserCheck, FaHome, FaDollarSign } from 'react-icons/fa';

const StatCard = ({ title, value, icon }) => (
  <Box p={6} bg="white" borderRadius="lg" shadow="md">
    <Flex justify="space-between" align="center">
      <Box>
        <Text color="gray.500" fontSize="sm">{title}</Text>
        <Text fontSize="2xl" fontWeight="bold" mt={2}>{value}</Text>
      </Box>
      <Icon as={icon} w={8} h={8} color="orange.500" />
    </Flex>
  </Box>
);

export default function SingleUserDashboard() {
  return (
    <Box p={8}>
      <Heading mb={6}>Single User Dashboard</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
        <StatCard title="Active Leads" value="24" icon={FaUserCheck} />
        <StatCard title="Properties Listed" value="12" icon={FaHome} />
        <StatCard title="Monthly Revenue" value="$8,750" icon={FaDollarSign} />
      </Grid>
    </Box>
  );
}
