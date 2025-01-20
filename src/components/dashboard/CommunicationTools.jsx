'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockCommunicationHistory = [
  { id: 1, type: 'email', from: 'user@example.com', to: 'client@example.com', subject: 'Property Inquiry', date: '2024-01-27' },
  { id: 2, type: 'message', from: 'client@example.com', to: 'user@example.com', content: 'Interested in the property', date: '2024-01-26' },
  { id: 3, type: 'email', from: 'user@example.com', to: 'client@example.com', subject: 'Follow Up', date: '2024-01-25' },
];

function CommunicationTools() {
  const { user } = useUser();
  const [communicationHistory, setCommunicationHistory] = useState(mockCommunicationHistory);
  const [emailContent, setEmailContent] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('communication_tools', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleSendEmail = () => {
    // Implement email sending logic here
    console.log('Sending email:', emailContent);
    const newEmail = {
      id: communicationHistory.length + 1,
      type: 'email',
      from: 'user@example.com',
      to: 'client@example.com',
      subject: 'New Email',
      date: new Date().toLocaleDateString(),
    };
    setCommunicationHistory([...communicationHistory, newEmail]);
    setEmailContent('');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Communication Tools
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Send Email
      </Text>
      <Input
        as="textarea"
        placeholder="Enter your email content here"
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        mb={2}
      />
      <Button onClick={handleSendEmail} mb={4}>
        Send Email
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Communication History
      </Text>
      <ul>
        {communicationHistory.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Type:</strong> {item.type}
            </Text>
            <Text>
              <strong>From:</strong> {item.from}
            </Text>
            {item.to && (
              <Text>
                <strong>To:</strong> {item.to}
              </Text>
            )}
            {item.subject && (
              <Text>
                <strong>Subject:</strong> {item.subject}
              </Text>
            )}
            {item.content && (
              <Text>
                <strong>Content:</strong> {item.content}
              </Text>
            )}
            <Text>
              <strong>Date:</strong> {item.date}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default CommunicationTools;
