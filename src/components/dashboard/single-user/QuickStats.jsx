'use client'
import { supabase } from '@/lib/supabase/client'

import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { FiUsers, FiDollarSign, FiCalendar, FiBarChart } from 'react-icons/fi'

export default function QuickStats() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        transition="all 0.2s"
      >
        <Stat>
          <Icon as={FiUsers} w={6} h={6} color="blue.500" mb={2} />
          <StatLabel>Total Clients</StatLabel>
          <StatNumber>1,284</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        transition="all 0.2s"
      >
        <Stat>
          <Icon as={FiDollarSign} w={6} h={6} color="green.500" mb={2} />
          <StatLabel>Revenue</StatLabel>
          <StatNumber>$45,623</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            12.5%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        transition="all 0.2s"
      >
        <Stat>
          <Icon as={FiCalendar} w={6} h={6} color="purple.500" mb={2} />
          <StatLabel>Appointments</StatLabel>
          <StatNumber>42</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            5.1%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        transition="all 0.2s"
      >
        <Stat>
          <Icon as={FiBarChart} w={6} h={6} color="orange.500" mb={2} />
          <StatLabel>Conversion Rate</StatLabel>
          <StatNumber>68%</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            8.2%
          </StatHelpText>
        </Stat>
      </Box>
    </SimpleGrid>
  )
}