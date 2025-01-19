'use client'
import { useSubscription } from '@/hooks/useSubscription'
import { Box, Text, Icon } from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { supabase } from '@/lib/supabase/client'

export default function FeatureAccess({ feature, children }) {
  const { checkFeatureAccess, SUBSCRIPTION_TIERS, currentTier } = useSubscription()

  const hasAccess = checkFeatureAccess(feature)
  const tierDetails = SUBSCRIPTION_TIERS[currentTier]

  return (
    <Box>
      {hasAccess ? (
        <>{children}</>
      ) : (
        <Box p={4} borderRadius="md" bg="gray.100">
          <Text>
            <Icon as={CloseIcon} color="red.500" mr={2} />
            This feature requires a higher subscription tier
          </Text>
        </Box>
      )}
    </Box>
  )
}
