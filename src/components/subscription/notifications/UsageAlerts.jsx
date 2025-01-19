'use client'

import { useEffect, useState } from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Progress,
  Box
} from '@chakra-ui/react'

export function UsageAlerts({ usage, limits }) {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    checkUsageLimits()
  }, [usage])

  const checkUsageLimits = () => {
    const newAlerts = []
    Object.entries(usage || {}).forEach(([resource, amount]) => {
      const limit = limits[resource]
      const usagePercentage = (amount / limit) * 100
      
      if (usagePercentage >= 90) {
        newAlerts.push({
          type: 'error',
          title: 'Critical Usage Alert',
          description: `${resource} usage is at ${usagePercentage.toFixed(1)}%`,
          percentage: usagePercentage
        })
      } else if (usagePercentage >= 75) {
        newAlerts.push({
          type: 'warning',
          title: 'Usage Warning',
          description: `${resource} usage is at ${usagePercentage.toFixed(1)}%`,
          percentage: usagePercentage
        })
      }
    })
    setAlerts(newAlerts)
  }

  return (
    <Stack spacing={3}>
      {alerts.map((alert, index) => (
        <Box key={index}>
          <Alert status={alert.type} variant="left-accent" mb={2}>
            <AlertIcon />
            <Box>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Box>
          </Alert>
          <Progress 
            value={alert.percentage} 
            colorScheme={alert.type === 'error' ? 'red' : 'orange'}
            size="sm"
            hasStripe
          />
        </Box>
      ))}
    </Stack>
  )
}
