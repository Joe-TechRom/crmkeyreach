'use client'

import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  Flex,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiMap,
  FiMail,
  FiPhone,
  FiUpload
} from 'react-icons/fi'

const menuItems = [
  { 
    name: 'Dashboard', 
    icon: FiHome, 
    path: '/dashboard/basic',
    description: 'Overview of your CRM activities'
  },
  { 
    name: 'Import Clients', 
    icon: FiUsers, 
    path: '/dashboard/basic/clients/import',
    description: 'Import and manage your client list'
  },
  { 
    name: 'Appointments', 
    icon: FiCalendar, 
    path: '/dashboard/basic/appointments',
    description: 'Schedule and manage appointments'
  },
  { 
    name: 'Documents', 
    icon: FiFileText, 
    path: '/dashboard/basic/documents',
    description: 'Upload and manage contracts'
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const hoverBg = useColorModeValue('blue.50', 'blue.900')
  const activeColor = useColorModeValue('blue.600', 'blue.200')

  return (
    <Box
      as="aside"
      h="100vh"
      w={{ base: "70px", md: "240px" }}
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      left={0}
      top={0}
      py={8}
      transition="width 0.2s"
    >
      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Tooltip
              key={item.path}
              label={item.description}
              placement="right"
              hasArrow
              display={{ base: 'block', md: 'none' }}
            >
              <Link href={item.path}>
                <Flex
                  align="center"
                  px={6}
                  py={3}
                  cursor="pointer"
                  role="group"
                  transition="all 0.2s"
                  bg={isActive ? hoverBg : 'transparent'}
                  color={isActive ? activeColor : 'gray.600'}
                  _hover={{
                    bg: hoverBg,
                    color: activeColor,
                  }}
                >
                  <Icon as={item.icon} fontSize="xl" />
                  <Text 
                    ml={4} 
                    fontWeight={isActive ? 'semibold' : 'medium'}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {item.name}
                  </Text>
                </Flex>
              </Link>
            </Tooltip>
          )
        })}
      </VStack>
    </Box>
  )
}
