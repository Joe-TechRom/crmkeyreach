'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockTeamReportData = {
  teamLeadsCreated: 150,
  teamPropertiesListed: 75,
  teamAppointmentsScheduled: 225,
};

function TeamReports() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('team_reports', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Team Reports
      </Text>
      <Text mb={2}>
        <strong>Leads Created by Team:</strong> {mockTeamReportData.teamLeadsCreated}
      </Text>
      <Text mb={2}>
        <strong>Properties Listed by Team:</strong>{' '}
        {mockTeamReportData.teamPropertiesListed}
      </Text>
      <Text mb={2}>
        <strong>Appointments Scheduled by Team:</strong>{' '}
        {mockTeamReportData.teamAppointmentsScheduled}
      </Text>
    </Card>
  );
}

export default TeamReports;
