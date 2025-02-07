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
import { FaBuilding, FaUsers, FaProjectDiagram, FaChartBar } from 'react-icons/fa';

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

export default function CorporateDashboard() {
  return (
    <Box p={8}>
      <Heading mb={6}>Corporate Dashboard</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
        <StatCard title="Departments" value="12" icon={FaBuilding} />
        <StatCard title="Total Staff" value="145" icon={FaUsers} />
        <StatCard title="Active Projects" value="34" icon={FaProjectDiagram} />
        <StatCard title="Revenue YTD" value="$1.2M" icon={FaChartBar} />
      </Grid>
    </Box>
  );
}
