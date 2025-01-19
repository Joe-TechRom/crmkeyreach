'use client'

import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  useToast,
  Text,
  Progress,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Input,
  Select,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiFile, FiCheck, FiPlus } from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'
import Papa from 'papaparse'

const leadStatuses = [
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

export default function ImportPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [manualClients, setManualClients] = useState([])
  const [newClient, setNewClient] = useState({
    full_name: '',
    email: '',
    phone: '',
    status: 'New Lead'
  })
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: handleFileDrop
  })

  async function handleFileDrop(acceptedFiles) {
    const file = acceptedFiles[0]
    setUploading(true)

    try {
      const text = await file.text()
      const { data } = Papa.parse(text, { header: true })

      let processed = 0
      for (const row of data) {
        await supabase.from('clients').insert([{
          full_name: row.name,
          email: row.email,
          phone: row.phone,
          status: row.status || 'New Lead'
        }])
        processed++
        setProgress((processed / data.length) * 100)
      }

      toast({
        title: 'Import successful',
        description: `${data.length} clients imported`,
        status: 'success',
        duration: 5000
      })
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error.message,
        status: 'error',
        duration: 5000
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  function handleAddManualClient() {
    setManualClients([...manualClients, newClient])
    setNewClient({ full_name: '', email: '', phone: '', status: 'New Lead' })
    toast({
      title: 'Client added',
      description: 'Client added successfully to the list.',
      status: 'success',
      duration: 5000
    })
  }

  function handleDownloadTemplate() {
    const csvContent = `Full Name,Email,Phone,Status
John Doe,johndoe@example.com,1234567890,New Lead
Jane Smith,janesmith@example.com,0987654321,Interested`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'client_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Import Clients</Heading>

        <Box
          {...getRootProps()}
          p={10}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={isDragActive ? 'blue.500' : borderColor}
          _hover={{ borderColor: 'blue.500' }}
          cursor="pointer"
          textAlign="center"
        >
          <input {...getInputProps()} />
          <Icon as={FiUpload} w={10} h={10} color="blue.500" mb={4} />
          <Text fontSize="lg" fontWeight="medium">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop your CSV file here, or click to select'}
          </Text>
          <Text color="gray.500" mt={2}>
            Supported formats: CSV, XLS, XLSX
          </Text>
        </Box>

        {uploading && (
          <Box>
            <Progress value={progress} size="sm" colorScheme="blue" mb={2} />
            <Text textAlign="center" color="gray.500">
              Processing... {Math.round(progress)}%
            </Text>
          </Box>
        )}

        <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4}>Add Client Manually</Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                value={newClient.full_name}
                onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={newClient.status}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
              >
                {leadStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </FormControl>
            <Button colorScheme="blue" onClick={handleAddManualClient}>
              Add Client
            </Button>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px">
            <VStack align="start" spacing={4}>
              <Icon as={FiFile} w={6} h={6} color="blue.500" />
              <Text fontWeight="bold">Template Download</Text>
              <Text color="gray.500">
                Download our CSV template to ensure proper formatting
              </Text>
              <Button colorScheme="blue" size="sm" onClick={handleDownloadTemplate}>
                Download Template
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {manualClients.length > 0 && (
          <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px">
            <Heading size="md" mb={4}>Manually Added Clients</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Full Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {manualClients.map((client, index) => (
                  <Tr key={index}>
                    <Td>{client.full_name}</Td>
                    <Td>{client.email}</Td>
                    <Td>{client.phone}</Td>
                    <Td>{client.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Container>
  )
}
