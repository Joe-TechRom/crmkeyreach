'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockLeadReport = {
  title: 'Lead Report',
  data: [
    { label: 'Total Leads', value: 150 },
    { label: 'New Leads This Month', value: 30 },
    { label: 'Converted Leads', value: 15 },
  ],
};

const mockPropertyReport = {
  title: 'Property Report',
  data: [
    { label: 'Total Properties Listed', value: 50 },
    { label: 'Properties Sold This Month', value: 5 },
    { label: 'Average Property Price', value: '$600,000' },
  ],
};

const mockTaskReport = {
  title: 'Task Report',
  data: [
    { label: 'Total Tasks', value: 200 },
    { label: 'Tasks Completed This Month', value: 100 },
    { label: 'Tasks Pending', value: 50 },
  ],
};

function BasicReports() {
  const { user } = useUser();
  const [selectedReport, setSelectedReport] = useState(null);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('basic_reports', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleGenerateReport = (reportType) => {
    switch (reportType) {
      case 'lead':
        setSelectedReport(mockLeadReport);
        break;
      case 'property':
        setSelectedReport(mockPropertyReport);
        break;
      case 'task':
        setSelectedReport(mockTaskReport);
        break;
      default:
        setSelectedReport(null);
    }
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Basic Reports
      </Text>
      <Button onClick={() => handleGenerateReport('lead')} mb={2}>
        Generate Lead Report
      </Button>
      <Button onClick={() => handleGenerateReport('property')} mb={2}>
        Generate Property Report
      </Button>
      <Button onClick={() => handleGenerateReport('task')} mb={4}>
        Generate Task Report
      </Button>
      {selectedReport && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            {selectedReport.title}
          </Text>
          <ul>
            {selectedReport.data.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>{item.label}:</strong> {item.value}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default BasicReports;
