'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

function AppointmentScheduler() {
  const { user } = useUser();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('schedule_appointments', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement logic to schedule an appointment
    console.log('Scheduling appointment:', { date, time, description });
    alert('Appointment Scheduled!');
    setDate('');
    setTime('');
    setDescription('');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Schedule Appointment
      </Text>
      <form onSubmit={handleSubmit}>
        <Input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          mb={2}
        />
        <Input
          type="time"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          mb={2}
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mb={2}
        />
        <Button type="submit">Schedule Appointment</Button>
      </form>
    </Card>
  );
}

export default AppointmentScheduler;
