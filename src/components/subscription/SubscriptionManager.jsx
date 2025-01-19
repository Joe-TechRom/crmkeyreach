'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UpgradeFlow } from './actions/UpgradeFlow'
import { CancelFlow } from './actions/CancelFlow'
import { UsageTracker } from './usage/UsageTracker'
import { UsageChart } from './usage/UsageChart'
import { UsageAlerts } from './notifications/UsageAlerts'
import { NotificationCenter } from './notifications/NotificationCenter'
import {
  Box,
  Stack,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  useToast,
  Divider,
  Container,
  Flex
} from '@chakra-ui/react'

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState(null)
  const [usageData, setUsageData] = useState(null)
  const supabase = createClientComponentClient()
  const toast = useToast()

  useEffect(() => {
    fetchSubscription()
    setupRealtimeSubscription()
  }, [])

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('subscription_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions'
      }, (payload) => {
        setSubscription(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_items (*)
      `)
      .eq('user_id', user.id)
      .single()
    
    setSubscription(subscription)
    if (subscription?.subscription_items) {
      setUsageData(subscription.subscription_items)
    }
  }

  return (
    <Container maxW="7xl" py={8}>
      <Stack spacing={8}>
        <Flex justify="space-between" align="center">
          <Heading>Subscription Management</Heading>
          <NotificationCenter />
        </Flex>
        
        {subscription && (
          <Stack spacing={8}>
            <UsageAlerts 
              usage={usageData?.reduce((acc, item) => ({
                ...acc,
                [item.type]: item.quantity
              }), {})}
              limits={subscription.subscription_items?.reduce((acc, item) => ({
                ...acc,
                [item.type]: item.unit_amount
              }), {})}
            />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box p={6} shadow="xl" borderWidth="1px" borderRadius="lg" bg="white">
                <Stack spacing={4}>
                  <Heading size="md">Current Plan</Heading>
                  <Text>Plan: {subscription.plan_id}</Text>
                  <Text>Status: <Badge colorScheme={subscription.status === 'active' ? 'green' : 'yellow'}>{subscription.status}</Badge></Text>
                  <Text>Additional Users: {subscription.additional_users}</Text>
                  <Text>Billing Cycle: {subscription.billing_cycle}</Text>
                  
                  <Divider />
                  
                  <Stack direction="row" spacing={4}>
                    <UpgradeFlow currentPlan={subscription.plan_id} />
                    {subscription.status === 'active' && (
                      <CancelFlow subscriptionId={subscription.id} />
                    )}
                  </Stack>
                </Stack>
              </Box>
              
              <Box p={6} shadow="xl" borderWidth="1px" borderRadius="lg" bg="white">
                <Stack spacing={4}>
                  <Heading size="md">Usage Overview</Heading>
                  <UsageTracker subscriptionId={subscription.id} />
                  <UsageChart data={usageData} />
                </Stack>
              </Box>
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
