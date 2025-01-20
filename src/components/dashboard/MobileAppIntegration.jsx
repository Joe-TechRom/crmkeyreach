'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/Button';

const mockLeads = [
  { id: 1, name: 'John Doe', phone: '555-123-4567' },
  { id: 2, name: 'Jane Smith', phone: '555-987-6543' },
  { id: 3, name: 'Peter Jones', phone: '555-246-8013' },
];

const mockProperties = [
  { id: 1, address: '123 Main St', price: '$500,000' },
  { id: 2, address: '456 Oak Ave', price: '$750,000' },
  { id: 3, address: '789 Pine Ln', price: '$300,000' },
];

const mockTasks = [
  { id: 1, description: 'Follow up with John Doe', status: 'Pending' },
  { id: 2, description: 'Schedule property viewing', status: 'Completed' },
  { id: 3, description: 'Prepare contract', status: 'Pending' },
];

function MobileAppIntegration() {
  const { user } = useUser();
  const [mobileData, setMobileData] = useState(null);
  const [isMobileAppOpen, setIsMobileAppOpen] = useState(false);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('mobile_app_integration', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  useEffect(() => {
    // Simulate fetching data for the mobile app
    if (isMobileAppOpen) {
      setTimeout(() => {
        setMobileData({
          leads: mockLeads,
          properties: mockProperties,
          tasks: mockTasks,
        });
      }, 500); // Simulate a delay for fetching data
    } else {
      setMobileData(null);
    }
  }, [isMobileAppOpen]);

  const handleToggleMobileApp = () => {
    setIsMobileAppOpen(!isMobileAppOpen);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Mobile App Integration
      </Text>
      <Button onClick={handleToggleMobileApp} mb={4}>
        {isMobileAppOpen ? 'Close Mobile App' : 'Open Mobile App'}
      </Button>
      {isMobileAppOpen && mobileData && (
        <Card>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Mobile App
          </Text>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Leads
          </Text>
          <ul>
            {mobileData.leads.map((lead) => (
              <li key={lead.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Name:</strong> {lead.name}
                </Text>
                <Text>
                  <strong>Phone:</strong> {lead.phone}
                </Text>
              </li>
            ))}
          </ul>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Properties
          </Text>
          <ul>
            {mobileData.properties.map((property) => (
              <li key={property.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Address:</strong> {property.address}
                </Text>
                <Text>
                  <strong>Price:</strong> {property.price}
                </Text>
              </li>
            ))}
          </ul>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            Tasks
          </Text>
          <ul>
            {mobileData.tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Description:</strong> {task.description}
                </Text>
                <Text>
                  <strong>Status:</strong> {task.status}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Card>
  );
}

export default MobileAppIntegration;
