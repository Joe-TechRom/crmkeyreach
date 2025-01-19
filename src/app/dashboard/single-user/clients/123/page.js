'use client'

import { Box } from '@chakra-ui/react'
import ClientView from '@/components/dashboard/basic/client-details/ClientView'

export default function ClientPage({ params }) {
  return (
    <Box p={4}>
      <ClientView clientId={params.id} />
    </Box>
  )
}
