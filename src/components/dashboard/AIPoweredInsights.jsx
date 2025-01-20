'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockInsights = [
  {
    id: 1,
    title: 'Lead Conversion Rate Analysis',
    description:
      'Based on your recent data, your lead conversion rate is 15%. Consider focusing on leads from referral sources, which have a higher conversion rate.',
  },
  {
    id: 2,
    title: 'Property Pricing Recommendations',
    description:
      'Based on market trends, properties in your area with similar features are selling for an average of 5% higher. Consider adjusting your pricing strategy.',
  },
  {
    id: 3,
    title: 'Task Management Optimization',
    description:
      'You have a high number of pending tasks. Prioritize tasks related to high-value leads and properties to improve your efficiency.',
  },
];

function AIPoweredInsights() {
  const { user } = useUser();
  const [insights, setInsights] = useState([]);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('ai_powered_insights', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  useEffect(() => {
    // Simulate fetching insights from an AI model
    setTimeout(() => {
      setInsights(mockInsights);
    }, 500); // Simulate a delay for fetching data
  }, []);

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        AI-Powered Insights
      </Text>
      {insights.length > 0 ? (
        <ul>
          {insights.map((insight) => (
            <li key={insight.id} style={{ marginBottom: '15px' }}>
              <Text fontSize="lg" fontWeight="bold" mb={1}>
                {insight.title}
              </Text>
              <Text>{insight.description}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <Text>Loading insights...</Text>
      )}
    </Card>
  );
}

export default AIPoweredInsights;
