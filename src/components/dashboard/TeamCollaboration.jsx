'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockSharedLeads = [
  { id: 1, name: 'Shared Lead 1', assignedTo: 'User A' },
  { id: 2, name: 'Shared Lead 2', assignedTo: 'User B' },
];

const mockSharedProperties = [
  { id: 1, address: 'Shared Property 1', assignedTo: 'User A' },
  { id: 2, address: 'Shared Property 2', assignedTo: 'User B' },
];

const mockSharedDocuments = [
  { id: 1, name: 'Shared Document 1', assignedTo: 'User A' },
  { id: 2, name: 'Shared Document 2', assignedTo: 'User B' },
];

const mockTasks = [
  { id: 1, name: 'Task 1', assignedTo: 'User A', status: 'Open' },
  { id: 2, name: 'Task 2', assignedTo: 'User B', status: 'In Progress' },
];

function TeamCollaboration() {
  const { user } = useUser();
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState({ name: '', assignedTo: '' });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('team_collaboration', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleCreateTask = () => {
    const newTaskWithId = { ...newTask, id: tasks.length + 1, status: 'Open' };
    setTasks([...tasks, newTaskWithId]);
    setNewTask({ name: '', assignedTo: '' });
  };

  const handleSendMessage = () => {
    if (message) {
      setMessages([...messages, { sender: user.name, content: message }]);
      setMessage('');
    }
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Team Collaboration
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Shared Leads
      </Text>
      <ul>
        {mockSharedLeads.map((lead) => (
          <li key={lead.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {lead.name}
            </Text>
            <Text>
              <strong>Assigned To:</strong> {lead.assignedTo}
            </Text>
          </li>
        ))}
      </ul>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Shared Properties
      </Text>
      <ul>
        {mockSharedProperties.map((property) => (
          <li key={property.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Address:</strong> {property.address}
            </Text>
            <Text>
              <strong>Assigned To:</strong> {property.assignedTo}
            </Text>
          </li>
        ))}
      </ul>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Shared Documents
      </Text>
      <ul>
        {mockSharedDocuments.map((document) => (
          <li key={document.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {document.name}
            </Text>
            <Text>
              <strong>Assigned To:</strong> {document.assignedTo}
            </Text>
          </li>
        ))}
      </ul>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Task Management
      </Text>
      <Input
        placeholder="Task Name"
        value={newTask.name}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        mb={2}
      />
      <Input
        placeholder="Assigned To"
        value={newTask.assignedTo}
        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        mb={2}
      />
      <Button onClick={handleCreateTask} mb={4}>
        Create Task
      </Button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {task.name}
            </Text>
            <Text>
              <strong>Assigned To:</strong> {task.assignedTo}
            </Text>
            <Text>
              <strong>Status:</strong> {task.status}
            </Text>
          </li>
        ))}
      </ul>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Team Chat
      </Text>
      <Input
        placeholder="Enter your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        mb={2}
      />
      <Button onClick={handleSendMessage} mb={4}>
        Send
      </Button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>{msg.sender}:</strong> {msg.content}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default TeamCollaboration;
