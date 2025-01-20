'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockUsers = [
  { id: 1, name: 'Admin User', role: 'admin' },
  { id: 2, name: 'Sales Agent 1', role: 'sales' },
  { id: 3, name: 'Marketing Manager', role: 'marketing' },
  { id: 4, name: 'Sales Agent 2', role: 'sales' },
];

const mockRoles = ['admin', 'sales', 'marketing'];

function UserRolesPermissions() {
  const { user } = useUser();
  const [users, setUsers] = useState(mockUsers);
  const [newRole, setNewRole] = useState('');
  const [roles, setRoles] = useState(mockRoles);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('user_roles_and_permissions', user.tier, features.features) || user.role !== 'admin') {
    return null; // Don't render if user doesn't have access or is not an admin
  }

  const handleCreateRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole('');
    }
  };

  const handleAssignRole = (userId, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        User Roles & Permissions
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Create New Role
      </Text>
      <Input
        placeholder="New Role Name"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        mb={2}
      />
      <Button onClick={handleCreateRole} mb={4}>
        Create Role
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        User List
      </Text>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {user.name}
            </Text>
            <Text>
              <strong>Role:</strong> {user.role}
            </Text>
            <select
              value={user.role}
              onChange={(e) => handleAssignRole(user.id, e.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default UserRolesPermissions;
