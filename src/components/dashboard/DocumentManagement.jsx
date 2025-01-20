'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Input } from '@/components/ui/Input';

const mockDocuments = [
  { id: 1, name: 'Contract.pdf', type: 'PDF', uploadDate: '2024-07-28' },
  { id: 2, name: 'Disclosure.docx', type: 'DOCX', uploadDate: '2024-07-27' },
  { id: 3, name: 'PropertyInfo.txt', type: 'TXT', uploadDate: '2024-07-26' },
];

function DocumentManagement() {
  const { user } = useUser();
  const [documents, setDocuments] = useState(mockDocuments);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newDocumentType, setNewDocumentType] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('document_management', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleUploadDocument = () => {
    if (!newDocumentName || !newDocumentType) {
      alert('Please enter document name and type.');
      return;
    }

    const newDocument = {
      id: documents.length + 1,
      name: newDocumentName,
      type: newDocumentType,
      uploadDate: new Date().toLocaleDateString(),
    };
    setDocuments([...documents, newDocument]);
    setNewDocumentName('');
    setNewDocumentType('');
    alert('Document uploaded successfully!');
  };

  const handleDeleteDocument = (id) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments);
    alert('Document deleted successfully!');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Document Management
      </Text>
      <Input
        type="text"
        placeholder="Document Name"
        value={newDocumentName}
        onChange={(e) => setNewDocumentName(e.target.value)}
        mb={2}
      />
      <Input
        type="text"
        placeholder="Document Type"
        value={newDocumentType}
        onChange={(e) => setNewDocumentType(e.target.value)}
        mb={2}
      />
      <Button onClick={handleUploadDocument} mb={4}>
        Upload Document
      </Button>
      {documents.length > 0 && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Your Documents
          </Text>
          <ul>
            {documents.map((document) => (
              <li key={document.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Name:</strong> {document.name}
                </Text>
                <Text>
                  <strong>Type:</strong> {document.type}
                </Text>
                <Text>
                  <strong>Upload Date:</strong> {document.uploadDate}
                </Text>
                <Button onClick={() => handleDeleteDocument(document.id)} size="sm" ml={2}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default DocumentManagement;
