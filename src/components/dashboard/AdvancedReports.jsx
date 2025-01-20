'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Input } from '@/components/ui/Input';

const mockLeadReport = {
  title: 'Advanced Lead Report',
  data: [
    { label: 'Total Leads', value: 150 },
    { label: 'New Leads This Month', value: 30 },
    { label: 'Converted Leads', value: 15 },
    { label: 'Leads by Source', value: { 'Website': 50, 'Referral': 60, 'Social Media': 40 } },
  ],
};

const mockPropertyReport = {
  title: 'Advanced Property Report',
  data: [
    { label: 'Total Properties Listed', value: 50 },
    { label: 'Properties Sold This Month', value: 5 },
    { label: 'Average Property Price', value: '$600,000' },
    { label: 'Properties by Type', value: { 'House': 30, 'Apartment': 15, 'Condo': 5 } },
  ],
};

const mockTaskReport = {
  title: 'Advanced Task Report',
  data: [
    { label: 'Total Tasks', value: 200 },
    { label: 'Tasks Completed This Month', value: 100 },
    { label: 'Tasks Pending', value: 50 },
    { label: 'Tasks by Status', value: { 'Pending': 50, 'In Progress': 50, 'Completed': 100 } },
  ],
};

function AdvancedReports() {
  const { user } = useUser();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('lead');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('advanced_reports', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleGenerateReport = () => {
    let reportData;
    switch (reportType) {
      case 'lead':
        reportData = mockLeadReport;
        break;
      case 'property':
        reportData = mockPropertyReport;
        break;
      case 'task':
        reportData = mockTaskReport;
        break;
      default:
        reportData = null;
    }
    setSelectedReport(reportData);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Advanced Reports
      </Text>
      <select value={reportType} onChange={(e) => setReportType(e.target.value)} mb={2}>
        <option value="lead">Lead Report</option>
        <option value="property">Property Report</option>
        <option value="task">Task Report</option>
      </select>
      <Input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        mb={2}
      />
      <Input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        mb={2}
      />
      <Button onClick={handleGenerateReport} mb={4}>
        Generate Report
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
                  <strong>{item.label}:</strong>
                  {typeof item.value === 'object' ? (
                    <ul>
                      {Object.entries(item.value).map(([key, value]) => (
                        <li key={key}>
                          {key}: {value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    ` ${item.value}`
                  )}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default AdvancedReports;
