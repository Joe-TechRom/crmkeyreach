'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
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

const TIER_DISPLAY_NAMES = {
  single_user: 'Single User',
  team: 'Team',
  corporate: 'Corporate'
}

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState(null)
  const [usageData, setUsageData] = useState(null)
  const [profile, setProfile] = useState(null)
  const toast = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    fetchSubscriptionData()
    setupRealtimeSubscription()
  }, [])

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('profile_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        setProfile(payload.new)
        fetchSubscriptionData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchSubscriptionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      setProfile(profileData)

      // Fetch usage data if needed
      if (profileData.subscription_status === 'active') {
        const { data: usageData, error: usageError } = await supabase
          .from('usage_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30)

        if (!usageError) {
          setUsageData(usageData)
        }
      }
    } catch (error) {
      toast({
        title: 'Error fetching subscription data',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Container maxW="7xl" py={8}>
      <Stack spacing={8}>
        <Flex justify="space-between" align="center">
          <Heading>Subscription Management</Heading>
          <NotificationCenter />
        </Flex>
        
        {profile && (
          <Stack spacing={8}>
            <UsageAlerts 
              subscription={profile}
              usage={usageData}
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box p={6} shadow="xl" borderWidth="1px" borderRadius="lg" bg="white">
                <Stack spacing={4}>
                  <Heading size="md">Current Plan</Heading>
                  <Text>Plan: {TIER_DISPLAY_NAMES[profile.subscription_tier]}</Text>
                  <Text>
                    Status: 
                    <Badge colorScheme={profile.subscription_status === 'active' ? 'green' : 'yellow'}>
                      {profile.subscription_status}
                    </Badge>
                  </Text>
                  <Text>
                    Next Billing Date: {
                      profile.subscription_period_end 
                        ? new Date(profile.subscription_period_end).toLocaleDateString() 
                        : 'N/A'
                    }
                  </Text>
                  
                  <Divider />
                  
                  <Stack direction="row" spacing={4}>
                    <UpgradeFlow 
                      currentTier={profile.subscription_tier}
                      stripeCustomerId={profile.stripe_customer_id}
                    />
                    {profile.subscription_status === 'active' && (
                      <CancelFlow 
                        userId={profile.id}
                        stripeCustomerId={profile.stripe_customer_id}
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>
              
              <Box p={6} shadow="xl" borderWidth="1px" borderRadius="lg" bg="white">
                <Stack spacing={4}>
                  <Heading size="md">Usage Overview</Heading>
                  <UsageTracker profileId={profile.id} />
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
