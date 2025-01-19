'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  HStack,
  Badge,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ClientList() {
  const router = useRouter()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const cardBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    fetchClients()
    setupClientSubscription()
  }, [])

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setClients(data)
    setLoading(false)
  }

  const setupClientSubscription = () => {
    const subscription = supabase
      .channel('clients')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setClients(prev => [payload.new, ...prev])
          }
          if (payload.eventType === 'DELETE') {
            setClients(prev => prev.filter(client => client.id !== payload.old.id))
          }
          if (payload.eventType === 'UPDATE') {
            setClients(prev => prev.map(client => 
              client.id === payload.new.id ? payload.new : client
            ))
          }
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Clients</Heading>
        <Button 
          colorScheme="blue" 
          onClick={() => router.push('/dashboard/basic/clients/import')}
        >
          Import Clients
        </Button>
      </HStack>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} height="200px" rounded="lg" />
          ))
        ) : (
          clients.map((client) => (
            <Card 
              key={client.id} 
              bg={cardBg}
              onClick={() => router.push(`/dashboard/basic/clients/${client.id}`)}
              cursor="pointer"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <CardBody>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">{client.full_name}</Text>
                  <Badge colorScheme={client.status === 'active' ? 'green' : 'gray'}>
                    {client.status}
                  </Badge>
                </HStack>
                <Text color="gray.500">{client.email}</Text>
                <Text fontSize="sm" mt={2}>
                  Last Contact: {new Date(client.last_contact).toLocaleDateString()}
                </Text>
              </CardBody>
            </Card>
          ))
        )}
      </Grid>
    </Box>
  )
}
