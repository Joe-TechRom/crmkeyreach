'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockTasks = [
  { id: 1, description: 'Follow up with lead A', dueDate: '2024-07-25', status: 'Pending' },
  { id: 2, description: 'Prepare property listing for property B', dueDate: '2024-07-28', status: 'In Progress' },
  { id: 3, description: 'Schedule meeting with client C', dueDate: '2024-07-30', status: 'Completed' },
];

function TaskManagement() {
  const { user } = useUser();
  const [tasks, setTasks] = useState(mockTasks);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Pending');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('task_management', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleAddTask = () => {
    if (newTaskDescription && newTaskDueDate) {
      const newTask = {
        id: tasks.length + 1,
        description: newTaskDescription,
        dueDate: newTaskDueDate,
        status: newTaskStatus,
      };
      setTasks([...tasks, newTask]);
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskStatus('Pending');
    }
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Task Management
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Add New Task
      </Text>
      <Input
        placeholder="Description"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        mb={2}
      />
      <Input
        type="date"
        placeholder="Due Date"
        value={newTaskDueDate}
        onChange={(e) => setNewTaskDueDate(e.target.value)}
        mb={2}
      />
      <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)} mb={2}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <Button onClick={handleAddTask} mb={4}>
        Add Task
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Task List
      </Text>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Description:</strong> {task.description}
            </Text>
            <Text>
              <strong>Due Date:</strong> {task.dueDate}
            </Text>
            <Text>
              <strong>Status:</strong> {task.status}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default TaskManagement;
