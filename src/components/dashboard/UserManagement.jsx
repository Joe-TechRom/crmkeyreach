'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockUsers = [
  { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Single User' },
  { id: 2, name: 'User 2', email: 'user2@example.com', role: 'Team Member' },
  { id: 3, name: 'User 3', email: 'user3@example.com', role: 'Corporate User' },
  { id: 4, name: 'User 4', email: 'user4@example.com', role: 'Corporate Admin' },
];

function UserManagement() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('user_management', user.tier, features.features)) {
      return null; // Don't render if user doesn't have access
  }

  let filteredUsers = [];

  if (user.tier === 'single-user') {
    filteredUsers = mockUsers.filter((u) => u.id === 1);
  } else if (user.tier === 'team') {
    filteredUsers = mockUsers.filter((u) => u.role === 'Team Member' || u.role === 'Single User');
  } else if (user.tier === 'corporate') {
    filteredUsers = mockUsers;
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        User Management
      </Text>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {user.name}
            </Text>
            <Text>
              <strong>Email:</strong> {user.email}
            </Text>
            <Text>
              <strong>Role:</strong> {user.role}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default UserManagement;
