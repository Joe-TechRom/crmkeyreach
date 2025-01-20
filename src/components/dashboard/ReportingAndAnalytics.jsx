'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Select } from '@/components/ui/Select';

const mockReports = [
  {
    id: 1,
    name: 'Lead Conversion Report',
    data: [
      { date: '2024-07-01', leads: 10, conversions: 2 },
      { date: '2024-07-08', leads: 15, conversions: 4 },
      { date: '2024-07-15', leads: 20, conversions: 5 },
      { date: '2024-07-22', leads: 18, conversions: 3 },
    ],
  },
  {
    id: 2,
    name: 'Property Performance Report',
    data: [
      { address: '123 Main St', views: 100, inquiries: 10 },
      { address: '456 Oak Ave', views: 150, inquiries: 15 },
      { address: '789 Pine Ln', views: 80, inquiries: 8 },
    ],
  },
];

function ReportingAndAnalytics() {
  const { user } = useUser();
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('reporting_and_analytics', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleReportChange = (e) => {
    setSelectedReport(mockReports.find(r => r.id === parseInt(e.target.value)));
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const filterReportData = (reportData) => {
    if (dateRange === 'Last 30 Days') {
      return reportData; // For now, return all data
    }
    return reportData; // Add filtering logic here later
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Reporting and Analytics
      </Text>
      <Select
        placeholder="Select a Report"
        onChange={handleReportChange}
        mb={2}
      >
        {mockReports.map((report) => (
          <option key={report.id} value={report.id}>
            {report.name}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Select Date Range"
        onChange={handleDateRangeChange}
        mb={2}
      >
        <option value="Last 30 Days">Last 30 Days</option>
        <option value="Last 90 Days">Last 90 Days</option>
        <option value="Last 12 Months">Last 12 Months</option>
      </Select>
      {selectedReport && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            {selectedReport.name}
          </Text>
          {selectedReport.name === 'Lead Conversion Report' && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Leads</th>
                  <th>Conversions</th>
                </tr>
              </thead>
              <tbody>
                {filterReportData(selectedReport.data).map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.leads}</td>
                    <td>{row.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedReport.name === 'Property Performance Report' && (
            <table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Views</th>
                  <th>Inquiries</th>
                </tr>
              </thead>
              <tbody>
                {filterReportData(selectedReport.data).map((row, index) => (
                  <tr key={index}>
                    <td>{row.address}</td>
                    <td>{row.views}</td>
                    <td>{row.inquiries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </Card>
  );
}

export default ReportingAndAnalytics;
