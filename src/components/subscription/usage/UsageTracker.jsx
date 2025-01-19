'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UsageChart } from './UsageChart'
import { trackUsage, getUsageSummary, subscribeToUsageUpdates } from '@/utils/usage/trackUsage'
import { useUsageTracking } from '@/hooks/useUsageTracking'
import {
  Box,
  Stack,
  Heading,
  Progress,
  Text,
  SimpleGrid,
  useToast,
  Button
} from '@chakra-ui/react'

export function UsageTracker({ subscriptionId }) {
  const [usage, setUsage] = useState(null)
  const [realtimeUsage, setRealtimeUsage] = useState({})
  const supabase = createClientComponentClient()
  const toast = useToast()
  const { trackResourceUsage, isTracking } = useUsageTracking(subscriptionId)

  useEffect(() => {
    fetchUsage()
    const unsubscribe = subscribeToUsageUpdates(subscriptionId, handleUsageUpdate)
    return () => unsubscribe()
  }, [subscriptionId])

  const fetchUsage = async () => {
    const { data } = await supabase
      .from('subscription_items')
      .select('*')
      .eq('subscription_id', subscriptionId)
    setUsage(data)

    const { data: usageSummary } = await getUsageSummary(subscriptionId)
    if (usageSummary) {
      setRealtimeUsage(usageSummary.reduce((acc, item) => ({
        ...acc,
        [item.resource_type]: item.quantity
      }), {}))
    }
  }

  const handleUsageUpdate = (payload) => {
    const { new: newUsage } = payload
    setRealtimeUsage(prev => ({
      ...prev,
      [newUsage.resource_type]: newUsage.quantity
    }))

    toast({
      title: 'Usage Updated',
      description: `${newUsage.resource_type} usage updated`,
      status: 'info',
      duration: 3000,
    })
  }

  const handleManualTrack = async (resourceType, currentQuantity) => {
    const result = await trackResourceUsage(resourceType, currentQuantity + 1)
    if (result.data) {
      await fetchUsage()
    }
  }

  return (
    <Box p={6} shadow="md" borderRadius="lg">
      <Stack spacing={6}>
        <Heading size="md">Resource Usage</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {usage?.map(item => (
            <Box key={item.id}>
              <Stack direction="row" justify="space-between" align="center" mb={2}>
                <Text>{item.type}</Text>
                <Button
                  size="sm"
                  isLoading={isTracking}
                  onClick={() => handleManualTrack(item.type, realtimeUsage[item.type] || item.quantity)}
                >
                  Track Usage
                </Button>
              </Stack>
              <Progress 
                value={(realtimeUsage[item.type] || item.quantity) / item.unit_amount * 100} 
                colorScheme="blue"
                hasStripe
              />
              <Text mt={1} fontSize="sm">
                {realtimeUsage[item.type] || item.quantity} / {item.unit_amount} units used
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <UsageChart data={usage?.map(item => ({
          ...item,
          quantity: realtimeUsage[item.type] || item.quantity
        }))} />
      </Stack>
    </Box>
  )
}
