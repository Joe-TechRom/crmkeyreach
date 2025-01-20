'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockTeamMembers = [
  { id: 1, name: 'Alice Smith', role: 'Sales Manager' },
  { id: 2, name: 'Bob Johnson', role: 'Sales Representative' },
  { id: 3, name: 'Charlie Brown', role: 'Marketing Specialist' },
];

function TeamManagement() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('manage_team', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Team Management
      </Text>
      <ul>
        {mockTeamMembers.map((member) => (
          <li key={member.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {member.name}
            </Text>
            <Text>
              <strong>Role:</strong> {member.role}
            </Text>
          </li>
        ))}
      </ul>
      <Text mt={4}>Add Team Member (Coming Soon)</Text>
    </Card>
  );
}

export default TeamManagement;
