'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const mockLeadConversionData = [
  { name: 'Jan', leads: 100, converted: 20 },
  { name: 'Feb', leads: 120, converted: 30 },
  { name: 'Mar', leads: 150, converted: 40 },
  { name: 'Apr', leads: 130, converted: 35 },
  { name: 'May', leads: 160, converted: 45 },
];

const mockSalesRevenueData = [
  { name: 'Jan', revenue: 50000 },
  { name: 'Feb', revenue: 60000 },
  { name: 'Mar', revenue: 75000 },
  { name: 'Apr', revenue: 70000 },
  { name: 'May', revenue: 80000 },
];

const mockPropertyPerformanceData = [
  { name: 'Property A', value: 40 },
  { name: 'Property B', value: 30 },
  { name: 'Property C', value: 20 },
  { name: 'Property D', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AnalyticsDashboard() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('analytics_dashboard', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Analytics Dashboard
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Lead Conversion Rates
      </Text>
      <BarChart width={500} height={300} data={mockLeadConversionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="leads" fill="#8884d8" />
        <Bar dataKey="converted" fill="#82ca9d" />
      </BarChart>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Sales Revenue Over Time
      </Text>
      <LineChart width={500} height={300} data={mockSalesRevenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
      </LineChart>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Property Performance
      </Text>
      <PieChart width={500} height={300}>
        <Pie
          data={mockPropertyPerformanceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {mockPropertyPerformanceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Card>
  );
}

export default AnalyticsDashboard;
