'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockEmails = [
  { id: 1, sender: 'clientA@example.com', subject: 'Property Inquiry', date: '2024-07-20' },
  { id: 2, sender: 'clientB@example.com', subject: 'Meeting Confirmation', date: '2024-07-21' },
  { id: 3, sender: 'partnerC@example.com', subject: 'New Listing', date: '2024-07-22' },
];

function EmailIntegration() {
  const { user } = useUser();
  const [isEmailConnected, setIsEmailConnected] = useState(false);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('email_integration', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleConnectEmail = () => {
    // Implement logic to connect to email account (e.g., using OAuth)
    setIsEmailConnected(true);
    console.log('Email account connected');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Email Integration
      </Text>
      {!isEmailConnected ? (
        <Button onClick={handleConnectEmail} mb={4}>
          Connect Email Account
        </Button>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Email List
          </Text>
          <ul>
            {mockEmails.map((email) => (
              <li key={email.id} style={{ marginBottom: '10px' }}>
                <Text>
                  <strong>Sender:</strong> {email.sender}
                </Text>
                <Text>
                  <strong>Subject:</strong> {email.subject}
                </Text>
                <Text>
                  <strong>Date:</strong> {email.date}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default EmailIntegration;
