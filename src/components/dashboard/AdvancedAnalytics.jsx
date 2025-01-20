'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  ResponsiveContainer,
} from 'recharts';

const mockSalesData = [
  { month: 'Jan', sales: 1000, leads: 200, conversionRate: 0.2 },
  { month: 'Feb', sales: 1200, leads: 250, conversionRate: 0.24 },
  { month: 'Mar', sales: 1500, leads: 300, conversionRate: 0.25 },
  { month: 'Apr', sales: 1300, leads: 280, conversionRate: 0.23 },
  { month: 'May', sales: 1600, leads: 320, conversionRate: 0.26 },
];

const mockPropertyData = [
  { address: 'Property A', price: 500000, sqft: 1500, bedrooms: 3 },
  { address: 'Property B', price: 750000, sqft: 2000, bedrooms: 4 },
  { address: 'Property C', price: 300000, sqft: 1200, bedrooms: 2 },
  { address: 'Property D', price: 600000, sqft: 1800, bedrooms: 3 },
];

function AdvancedAnalytics() {
  const { user } = useUser();
  const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'leads', 'conversionRate']);
  const [showScatter, setShowScatter] = useState(false);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('advanced_analytics', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleMetricChange = (e) => {
    const metric = e.target.value;
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleToggleScatter = () => {
    setShowScatter(!showScatter);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Advanced Analytics
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Customize Your Dashboard
      </Text>
      <Text mb={2}>Select Metrics:</Text>
      <label>
        <input
          type="checkbox"
          value="sales"
          checked={selectedMetrics.includes('sales')}
          onChange={handleMetricChange}
        />
        Sales
      </label>
      <label>
        <input
          type="checkbox"
          value="leads"
          checked={selectedMetrics.includes('leads')}
          onChange={handleMetricChange}
        />
        Leads
      </label>
      <label>
        <input
          type="checkbox"
          value="conversionRate"
          checked={selectedMetrics.includes('conversionRate')}
          onChange={handleMetricChange}
        />
        Conversion Rate
      </label>
      <Button onClick={handleToggleScatter} mb={4}>
        Toggle Scatter Plot
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Sales Performance
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockSalesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedMetrics.includes('sales') && <Bar dataKey="sales" fill="#8884d8" />}
          {selectedMetrics.includes('leads') && <Bar dataKey="leads" fill="#82ca9d" />}
          {selectedMetrics.includes('conversionRate') && (
            <Line type="monotone" dataKey="conversionRate" stroke="#ff7300" />
          )}
        </BarChart>
      </ResponsiveContainer>
      {showScatter && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Property Analysis
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="sqft" name="Square Footage" />
              <YAxis type="number" dataKey="price" name="Price" />
              <ZAxis type="number" dataKey="bedrooms" name="Bedrooms" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Properties" data={mockPropertyData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </>
      )}
    </Card>
  );
}

export default AdvancedAnalytics;
