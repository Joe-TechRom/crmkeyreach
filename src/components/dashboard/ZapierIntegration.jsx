'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Select } from '@/components/ui/Select';

const mockTriggers = [
  { id: 1, name: 'New Lead Created' },
  { id: 2, name: 'Property Updated' },
  { id: 3, name: 'Task Completed' },
];

const mockActions = [
  { id: 1, name: 'Send Email' },
  { id: 2, name: 'Create Task' },
  { id: 3, name: 'Update Contact' },
];

function ZapierIntegration() {
  const { user } = useUser();
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [zaps, setZaps] = useState([]);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('zapier_integration', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleCreateZap = () => {
    if (!selectedTrigger || !selectedAction) {
      alert('Please select a trigger and an action');
      return;
    }

    const newZap = {
      id: zaps.length + 1,
      trigger: selectedTrigger,
      action: selectedAction,
      status: 'Active',
    };
    setZaps([...zaps, newZap]);
    alert('Zap created successfully!');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Zapier Integration
      </Text>
      <Select
        placeholder="Select a Trigger"
        onChange={(e) => setSelectedTrigger(mockTriggers.find(t => t.id === parseInt(e.target.value)))}
        mb={2}
      >
        {mockTriggers.map((trigger) => (
          <option key={trigger.id} value={trigger.id}>
            {trigger.name}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Select an Action"
        onChange={(e) => setSelectedAction(mockActions.find(a => a.id === parseInt(e.target.value)))}
        mb={2}
      >
        {mockActions.map((action) => (
          <option key={action.id} value={action.id}>
            {action.name}
          </option>
        ))}
      </Select>
      <Button onClick={handleCreateZap} mb={4}>
        Create Zap
      </Button>
      {zaps.length > 0 && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Your Zaps
          </Text>
          <ul>
            {zaps.map((zap) => (
              <li key={zap.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Trigger:</strong> {zap.trigger.name}
                </Text>
                <Text>
                  <strong>Action:</strong> {zap.action.name}
                </Text>
                <Text>
                  <strong>Status:</strong> {zap.status}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default ZapierIntegration;
