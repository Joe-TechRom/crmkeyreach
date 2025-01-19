'use client'
import { supabase } from '@/lib/supabase/client'

import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react'
import { setupClientSubscriptions, setupActivitySubscriptions } from '@/lib/supabaseSubscriptions'
import AppointmentScheduler from './AppointmentScheduler'
import PropertyMapper from './PropertyMapper'
import StatusTracker from './StatusTracker'
import DocumentManager from './DocumentManager'
import CommunicationTools from './CommunicationTools'
import ActivityLog from './ActivityLog'

export default function ClientView({ clientId }) {
  const [clientData, setClientData] = useState(null)
  const [activities, setActivities] = useState([])
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const clientSub = setupClientSubscriptions((payload) => {
      if (payload.new.id === clientId) {
        setClientData(payload.new)
      }
    })

    const activitySub = setupActivitySubscriptions(clientId, (payload) => {
      if (payload.eventType === 'INSERT') {
        setActivities(prev => [payload.new, ...prev])
      }
      if (payload.eventType === 'UPDATE') {
        setActivities(prev => prev.map(activity => 
          activity.id === payload.new.id ? payload.new : activity
        ))
      }
    })

    return () => {
      clientSub.unsubscribe()
      activitySub.unsubscribe()
    }
  }, [clientId])

  return (
    <Box p={6}>
      <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
        {/* Main Content Area */}
        <Box>
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Properties</Tab>
              <Tab>Appointments</Tab>
              <Tab>Documents</Tab>
              <Tab>Activity</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <StatusTracker clientId={clientId} clientData={clientData} />
              </TabPanel>
              <TabPanel>
                <PropertyMapper clientId={clientId} />
              </TabPanel>
              <TabPanel>
                <AppointmentScheduler clientId={clientId} />
              </TabPanel>
              <TabPanel>
                <DocumentManager clientId={clientId} />
              </TabPanel>
              <TabPanel>
                <ActivityLog clientId={clientId} activities={activities} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Right Sidebar */}
        <VStack spacing={6}>
          <CommunicationTools clientId={clientId} clientData={clientData} />
          <Box bg={bgColor} p={4} rounded="lg" w="full">
            {/* Quick Actions for Basic Tier */}
          </Box>
        </VStack>
      </Grid>
    </Box>
  )
}
