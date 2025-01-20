'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

function NoteTaking() {
  const { user } = useUser();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('note_taking', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim() === '') return;
    setNotes([...notes, newNote]);
    setNewNote('');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Note Taking
      </Text>
      <form onSubmit={handleAddNote}>
        <Input
          as="textarea"
          placeholder="Enter your note here"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          mb={2}
        />
        <Button type="submit">Add Note</Button>
      </form>
      {notes.length > 0 && (
        <Card mt={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Notes:
          </Text>
          <ul>
            {notes.map((note, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <Text>{note}</Text>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Card>
  );
}

export default NoteTaking;
