'use client';

import { Box, Text } from '@chakra-ui/react';
import LeadManagement from '@/app/dashboard/components/LeadManagement';
import TaskManagement from '@/app/dashboard/components/TaskManagement';
import ContactManagement from '@/app/dashboard/components/ContactManagement';
import IDXIntegration from '@/app/dashboard/components/IDXIntegration';
import ZapierIntegration from '@/app/dashboard/components/ZapierIntegration';
import DocumentManagement from '@/app/dashboard/components/DocumentManagement';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';


const TeamDashboard = () => {
  return (
    <Box>
      <Text>Team Dashboard</Text>
    </Box>
  );
};

export default TeamDashboard;
