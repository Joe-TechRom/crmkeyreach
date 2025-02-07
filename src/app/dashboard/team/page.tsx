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
import { FaUsers, FaUserPlus, FaChartLine, FaDollarSign } from 'react-icons/fa';

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

export default function TeamDashboard() {
  return (
    <Box p={8}>
      <Heading mb={6}>Team Dashboard</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
        <StatCard title="Team Members" value="8" icon={FaUsers} />
        <StatCard title="Total Leads" value="156" icon={FaUserPlus} />
        <StatCard title="Conversion Rate" value="24%" icon={FaChartLine} />
        <StatCard title="Team Revenue" value="$45,890" icon={FaDollarSign} />
      </Grid>
    </Box>
  );
}
