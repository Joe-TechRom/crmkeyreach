'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockAppointments = [
  { id: 1, date: '2024-07-20', time: '10:00 AM', description: 'Meeting with client A' },
  { id: 2, date: '2024-07-21', time: '2:00 PM', description: 'Property viewing with client B' },
  { id: 3, date: '2024-07-22', time: '11:00 AM', description: 'Internal team meeting' },
];

function ScheduleAppointments() {
  const { user } = useUser();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [newAppointmentTime, setNewAppointmentTime] = useState('');
  const [newAppointmentDescription, setNewAppointmentDescription] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('schedule_appointments', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleAddAppointment = () => {
    if (newAppointmentDate && newAppointmentTime && newAppointmentDescription) {
      const newAppointment = {
        id: appointments.length + 1,
        date: newAppointmentDate,
        time: newAppointmentTime,
        description: newAppointmentDescription,
      };
      setAppointments([...appointments, newAppointment]);
      setNewAppointmentDate('');
      setNewAppointmentTime('');
      setNewAppointmentDescription('');
    }
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Schedule Appointments
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Add New Appointment
      </Text>
      <Input
        type="date"
        placeholder="Date"
        value={newAppointmentDate}
        onChange={(e) => setNewAppointmentDate(e.target.value)}
        mb={2}
      />
      <Input
        type="time"
        placeholder="Time"
        value={newAppointmentTime}
        onChange={(e) => setNewAppointmentTime(e.target.value)}
        mb={2}
      />
      <Input
        placeholder="Description"
        value={newAppointmentDescription}
        onChange={(e) => setNewAppointmentDescription(e.target.value)}
        mb={2}
      />
      <Button onClick={handleAddAppointment} mb={4}>
        Add Appointment
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Appointment List
      </Text>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Date:</strong> {appointment.date}
            </Text>
            <Text>
              <strong>Time:</strong> {appointment.time}
            </Text>
            <Text>
              <strong>Description:</strong> {appointment.description}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default ScheduleAppointments;
