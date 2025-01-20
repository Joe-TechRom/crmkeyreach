'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockContacts = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-246-8013' },
];

function ManageContacts() {
  const { user } = useUser();
  const [contacts, setContacts] = useState(mockContacts);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('manage_contacts', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleAddContact = () => {
    if (newContactName && newContactEmail && newContactPhone) {
      const newContact = {
        id: contacts.length + 1,
        name: newContactName,
        email: newContactEmail,
        phone: newContactPhone,
      };
      setContacts([...contacts, newContact]);
      setNewContactName('');
      setNewContactEmail('');
      setNewContactPhone('');
    }
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Manage Contacts
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Add New Contact
      </Text>
      <Input
        placeholder="Name"
        value={newContactName}
        onChange={(e) => setNewContactName(e.target.value)}
        mb={2}
      />
      <Input
        type="email"
        placeholder="Email"
        value={newContactEmail}
        onChange={(e) => setNewContactEmail(e.target.value)}
        mb={2}
      />
      <Input
        type="tel"
        placeholder="Phone"
        value={newContactPhone}
        onChange={(e) => setNewContactPhone(e.target.value)}
        mb={2}
      />
      <Button onClick={handleAddContact} mb={4}>
        Add Contact
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Contact List
      </Text>
      <ul>
        {contacts.map((contact) => (
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

export default ManageContacts;
