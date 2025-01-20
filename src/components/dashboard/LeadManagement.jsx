'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockLeads = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567', status: 'New' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543', status: 'Contacted' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-555-5555', status: 'Qualified' },
];

function LeadManagement() {
  const { user } = useUser();
  const [leads, setLeads] = useState(mockLeads);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '' });

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('lead_management', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleInputChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const handleCreateLead = () => {
    const newLeadWithId = { ...newLead, id: leads.length + 1, status: 'New' };
    setLeads([...leads, newLeadWithId]);
    setNewLead({ name: '', email: '', phone: '' });
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Lead Management
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Create New Lead
      </Text>
      <Input
        placeholder="Name"
        name="name"
        value={newLead.name}
        onChange={handleInputChange}
        mb={2}
      />
      <Input
        placeholder="Email"
        name="email"
        value={newLead.email}
        onChange={handleInputChange}
        mb={2}
      />
      <Input
        placeholder="Phone"
        name="phone"
        value={newLead.phone}
        onChange={handleInputChange}
        mb={2}
      />
      <Button onClick={handleCreateLead} mb={4}>
        Create Lead
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Lead List
      </Text>
      <ul>
        {leads.map((lead) => (
          <li key={lead.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {lead.name}
            </Text>
            <Text>
              <strong>Email:</strong> {lead.email}
            </Text>
            <Text>
              <strong>Phone:</strong> {lead.phone}
            </Text>
            <Text>
              <strong>Status:</strong> {lead.status}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default LeadManagement;
