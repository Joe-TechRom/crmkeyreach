'use client'

import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useColorModeValue,
  Badge,
  Icon,
  useToast,
  Card,
  CardBody,
  Progress
} from '@chakra-ui/react'
import { FiUpload, FiCheck } from 'react-icons/fi'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { supabase } from '@/lib/supabase/client'

const statusColors = {
  'New': 'blue',
  'Contacted': 'yellow',
  'Interested': 'orange',
  'Proposal Sent': 'purple',
  'Negotiation': 'green.300',
  'Under Contract': 'green.600',
  'Closed': 'gold',
  'Lost': 'gray'
}

const stages = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Interested',
  'Proposal Sent',
  'Negotiation',
  'Under Contract',
  'Closed Deal',
  'Follow-Up',
  'Lost'
]

export default function ClientImport() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'gray.800')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploading(true)
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setProgress(i)
      }
      toast({
        title: 'Import Successful',
        description: `${file.name} has been processed`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Box p={8}>
      <Card bg={cardBg} shadow="xl" rounded="xl">
        <CardBody>
          <VStack spacing={8} align="stretch">
            {/* Upload Section */}
            <Box
              border="2px dashed"
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              rounded="lg"
              p={10}
              textAlign="center"
              cursor="pointer"
              _hover={{
                borderColor: 'blue.500',
                bg: useColorModeValue('blue.50', 'blue.900')
              }}
              transition="all 0.2s"
            >
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept=".csv,.xlsx"
              />
              <label htmlFor="file-upload">
                <VStack spacing={4}>
                  <Icon as={FiUpload} w={10} h={10} color="blue.500" />
                  <Text fontSize="lg" fontWeight="medium">
                    Drag and drop your client list here or click to browse
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Supports CSV and Excel files
                  </Text>
                </VStack>
              </label>
            </Box>

            {uploading && (
              <Box>
                <Progress value={progress} size="sm" colorScheme="blue" rounded="full" />
                <Text mt={2} fontSize="sm" color="gray.500" textAlign="center">
                  Processing your file...
                </Text>
              </Box>
            )}

            {/* Status Badges */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Available Status Tags
              </Text>
              <HStack spacing={4} flexWrap="wrap">
                {Object.entries(statusColors).map(([status, color]) => (
                  <Badge
                    key={status}
                    colorScheme={color}
                    px={3}
                    py={1}
                    rounded="full"
                    fontSize="sm"
                  >
                    {status}
                  </Badge>
                ))}
              </HStack>
            </Box>

            {/* Stages */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Client Journey Stages
              </Text>
              <VStack spacing={4} align="stretch">
                {stages.map((stage, index) => (
                  <Card key={stage} variant="outline">
                    <CardBody>
                      <HStack justify="space-between">
                        <Text>{stage}</Text>
                        <Badge
                          colorScheme={index === stages.length - 1 ? 'gray' : 'blue'}
                          variant="subtle"
                        >
                          Stage {index + 1}
                        </Badge>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}
