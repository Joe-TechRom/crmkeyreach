'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const mockClientData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  properties: [
    { id: 1, address: '123 Main St, Anytown, USA', price: '$500,000' },
    { id: 2, address: '456 Oak Ave, Anytown, USA', price: '$750,000' },
  ],
  appointments: [
    { id: 1, date: '2024-08-10', time: '10:00 AM', description: 'Property Viewing' },
    { id: 2, date: '2024-08-15', time: '2:00 PM', description: 'Meeting with Agent' },
  ],
};

function CustomerPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock authentication logic
    if (username === 'client' && password === 'password') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Customer Portal Login
        </Text>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={2}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={2}
        />
        <Button onClick={handleLogin}>Login</Button>
      </Card>
    );
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Welcome, {mockClientData.name}!
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Your Properties
      </Text>
      <ul>
        {mockClientData.properties.map((property) => (
          <li key={property.id} style={{ marginBottom: '5px' }}>
            <Text>
              <strong>Address:</strong> {property.address}
            </Text>
            <Text>
              <strong>Price:</strong> {property.price}
            </Text>
          </li>
        ))}
      </ul>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Your Appointments
      </Text>
      <ul>
        {mockClientData.appointments.map((appointment) => (
          <li key={appointment.id} style={{ marginBottom: '5px' }}>
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

export default CustomerPortal;
