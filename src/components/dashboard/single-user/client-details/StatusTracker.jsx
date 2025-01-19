'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Badge,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { supabase } from '@/lib/supabaseClient'

const stages = [
  { id: 'new', name: 'New Lead', color: 'blue' },
  { id: 'contacted', name: 'Contacted', color: 'yellow' },
  { id: 'qualified', name: 'Qualified', color: 'orange' },
  { id: 'proposal', name: 'Proposal Sent', color: 'purple' },
  { id: 'negotiation', name: 'Negotiation', color: 'green' },
  { id: 'closed', name: 'Closed Deal', color: 'gold' }
]

export default function StatusTracker({ clientId, clientData }) {
  const [clients, setClients] = useState({})
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  
  const columnBg = useColorModeValue('gray.50', 'gray.700')
  const cardBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    fetchClients()
    const subscription = setupStatusSubscription()
    return () => subscription.unsubscribe()
  }, [])

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)

    if (data) {
      const clientsByStage = stages.reduce((acc, stage) => {
        acc[stage.id] = data.filter(client => client.status === stage.id)
        return acc
      }, {})
      setClients(clientsByStage)
    }
    setLoading(false)
  }

  const setupStatusSubscription = () => {
    return supabase
      .channel('status-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'clients',
          filter: `id=eq.${clientId}`
        }, 
        payload => {
          updateClientStatus(payload.new)
        }
      )
      .subscribe()
  }

  const updateClientStatus = (updatedClient) => {
    setClients(prev => {
      const newClients = { ...prev }
      // Remove client from all stages
      stages.forEach(stage => {
        newClients[stage.id] = newClients[stage.id]?.filter(
          client => client.id !== updatedClient.id
        ) || []
      })
      // Add client to new stage
      newClients[updatedClient.status] = [
        ...(newClients[updatedClient.status] || []),
        updatedClient
      ]
      return newClients
    })
  }

  const onDragEnd = async (result) => {
    if (!result.destination) return

    const newStatus = result.destination.droppableId
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)

      if (error) throw error

      // Create status change activity
      await supabase
        .from('activities')
        .insert([{
          client_id: clientId,
          type: 'status_change',
          description: `Status updated to ${stages.find(s => s.id === newStatus).name}`,
          created_at: new Date().toISOString()
        }])

    } catch (error) {
      toast({
        title: 'Error updating status',
        description: error.message,
        status: 'error',
        duration: 3000
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex gap={4} overflowX="auto" p={4}>
        {stages.map((stage) => (
          <Box
            key={stage.id}
            minW="300px"
            bg={columnBg}
            p={4}
            rounded="lg"
          >
            <Text fontWeight="bold" mb={4}>
              {stage.name}
              <Badge ml={2} colorScheme={stage.color}>
                {clients[stage.id]?.length || 0}
              </Badge>
            </Text>

            <Droppable droppableId={stage.id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  minH="200px"
                >
                  {clientData && clientData.status === stage.id && (
                    <Draggable draggableId={clientId} index={0}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          bg={cardBg}
                          p={4}
                          mb={2}
                          rounded="md"
                          shadow={snapshot.isDragging ? 'lg' : 'md'}
                          transform={snapshot.isDragging ? 'rotate(3deg)' : ''}
                          transition="all 0.2s"
                        >
                          <Text fontWeight="medium">{clientData.full_name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            Last updated: {new Date(clientData.updated_at).toLocaleDateString()}
                          </Text>
                        </Box>
                      )}
                    </Draggable>
                  )}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Box>
        ))}
      </Flex>
    </DragDropContext>
  )
}
