'use client'

import {
  Stack,
  Heading,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
  Icon,
  Box,
} from '@chakra-ui/react'
import { MdCheckCircle, MdCelebration } from 'react-icons/md'

export const ReadyToGo = ({ onComplete }) => {
  return (
    <Stack spacing={8} align="center" textAlign="center">
      <Icon as={MdCelebration} boxSize={16} color="blue.500" />
      
      <Stack spacing={3}>
        <Heading size="lg">You're All Set!</Heading>
        <Text color="gray.600">
          Your KeyReach CRM workspace is ready to help you grow your real estate business
        </Text>
      </Stack>

      <Box bg="gray.50" p={6} borderRadius="lg" width="full">
        <List spacing={4} textAlign="left">
          <ListItem display="flex" alignItems="center">
            <ListIcon as={MdCheckCircle} color="green.500" />
            Profile and company information configured
          </ListItem>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={MdCheckCircle} color="green.500" />
            Team settings and preferences saved
          </ListItem>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={MdCheckCircle} color="green.500" />
            Workspace customization completed
          </ListItem>
        </List>
      </Box>

      <Button
        colorScheme="blue"
        size="lg"
        onClick={onComplete}
      >
        Go to Dashboard
      </Button>
    </Stack>
  )
}
