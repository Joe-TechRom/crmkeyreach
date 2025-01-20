'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

function TaskList() {
  const { user } = useUser();
  const [tasks, setTasks] = useState([
    { id: 1, description: 'Follow up with leads', completed: false },
    { id: 2, description: 'Prepare property listings', completed: true },
  ]);
  const [newTask, setNewTask] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('task_management', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const newTaskItem = {
      id: tasks.length + 1,
      description: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskItem]);
    setNewTask('');
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Task List
      </Text>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                style={{ marginRight: '5px' }}
              />
              <Text as={task.completed ? 's' : 'span'}>{task.description}</Text>
            </label>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddTask}>
        <Input
          type="text"
          placeholder="Add new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          mb={2}
        />
        <Button type="submit">Add Task</Button>
      </form>
    </Card>
  );
}

export default TaskList;
