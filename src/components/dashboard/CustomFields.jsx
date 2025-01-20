'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockCustomFields = [
  { id: 1, name: 'Lead Source', type: 'text' },
  { id: 2, name: 'Property Type', type: 'select', options: ['House', 'Apartment', 'Condo'] },
  { id: 3, name: 'Preferred Contact Method', type: 'radio', options: ['Email', 'Phone', 'Text'] },
];

function CustomFields() {
  const { user } = useUser();
  const [customFields, setCustomFields] = useState(mockCustomFields);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('custom_fields', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleCreateField = () => {
    if (newFieldName) {
      const newField = {
        id: customFields.length + 1,
        name: newFieldName,
        type: newFieldType,
        options: newFieldType === 'select' || newFieldType === 'radio' ? newFieldOptions.split(',').map(option => option.trim()) : undefined,
      };
      setCustomFields([...customFields, newField]);
      setNewFieldName('');
      setNewFieldType('text');
      setNewFieldOptions('');
    }
  };

  const handleDeleteField = (id) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Custom Fields
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Create New Field
      </Text>
      <Input
        placeholder="Field Name"
        value={newFieldName}
        onChange={(e) => setNewFieldName(e.target.value)}
        mb={2}
      />
      <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)} mb={2}>
        <option value="text">Text</option>
        <option value="select">Select</option>
        <option value="radio">Radio</option>
      </select>
      {(newFieldType === 'select' || newFieldType === 'radio') && (
        <Input
          placeholder="Options (comma-separated)"
          value={newFieldOptions}
          onChange={(e) => setNewFieldOptions(e.target.value)}
          mb={2}
        />
      )}
      <Button onClick={handleCreateField} mb={4}>
        Create Field
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Custom Fields List
      </Text>
      <ul>
        {customFields.map((field) => (
          <li key={field.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Name:</strong> {field.name}
            </Text>
            <Text>
              <strong>Type:</strong> {field.type}
            </Text>
            {field.options && (
              <Text>
                <strong>Options:</strong> {field.options.join(', ')}
              </Text>
            )}
            <Button onClick={() => handleDeleteField(field.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default CustomFields;
