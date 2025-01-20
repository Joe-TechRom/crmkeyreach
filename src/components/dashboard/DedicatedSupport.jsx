'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockSupportInfo = {
  contactEmail: 'support@acmecorp.com',
  contactPhone: '555-123-4567',
  supportPortal: 'https://support.acmecorp.com',
};

function DedicatedSupport() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('dedicated_support', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Dedicated Support
      </Text>
      <Text mb={2}>
        <strong>Contact Email:</strong> {mockSupportInfo.contactEmail}
      </Text>
      <Text mb={2}>
        <strong>Contact Phone:</strong> {mockSupportInfo.contactPhone}
      </Text>
      <Text mb={2}>
        <strong>Support Portal:</strong>{' '}
        <a href={mockSupportInfo.supportPortal} target="_blank" rel="noopener noreferrer">
          {mockSupportInfo.supportPortal}
        </a>
      </Text>
    </Card>
  );
}

export default DedicatedSupport;
