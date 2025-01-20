'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockCalendarEvents = [
  { id: 1, date: '2024-07-25', time: '10:00 AM', description: 'Client Meeting' },
  { id: 2, date: '2024-07-26', time: '2:00 PM', description: 'Property Viewing' },
  { id: 3, date: '2024-07-27', time: '11:00 AM', description: 'Team Meeting' },
];

function CalendarSync() {
  const { user } = useUser();
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('calendar_sync', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleConnectCalendar = () => {
    // Implement logic to connect to calendar account (e.g., using OAuth)
    setIsCalendarConnected(true);
    console.log('Calendar account connected');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Calendar Sync
      </Text>
      {!isCalendarConnected ? (
        <Button onClick={handleConnectCalendar} mb={4}>
          Connect Calendar Account
        </Button>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Calendar Events
          </Text>
          <ul>
            {mockCalendarEvents.map((event) => (
              <li key={event.id} style={{ marginBottom: '10px' }}>
                <Text>
                  <strong>Date:</strong> {event.date}
                </Text>
                <Text>
                  <strong>Time:</strong> {event.time}
                </Text>
                <Text>
                  <strong>Description:</strong> {event.description}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default CalendarSync;
