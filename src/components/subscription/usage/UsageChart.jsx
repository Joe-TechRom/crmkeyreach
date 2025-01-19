'use client'

import { Box } from '@chakra-ui/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export function UsageChart({ data }) {
  const chartData = data?.map(item => ({
    name: item.type,
    used: item.quantity,
    total: item.unit_amount
  }))

  return (
    <Box h="300px" w="full">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="used" fill="#3182CE" />
          <Bar dataKey="total" fill="#CBD5E0" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
