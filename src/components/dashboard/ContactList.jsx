'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockContacts = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
  },
  {
    id: 3,
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '555-555-5555',
  },
];

function ContactList() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('manage_contacts', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Contact List
      </Text>
      <ul>
        {mockContacts.map((contact) => (
          <li key={contact.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {contact.name}
            </Text>
            <Text>
              <strong>Email:</strong> {contact.email}
            </Text>
            <Text>
              <strong>Phone:</strong> {contact.phone}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default ContactList;
