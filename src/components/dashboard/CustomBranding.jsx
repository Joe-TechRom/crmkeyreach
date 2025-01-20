'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockBrandingSettings = {
  companyLogo: '/logo.png', // Placeholder for logo URL
  companyName: 'Acme Corp',
  colorScheme: 'Blue & White',
};

function CustomBranding() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('custom_branding', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Custom Branding
      </Text>
      <Text mb={2}>
        <strong>Company Logo:</strong>
      </Text>
      <img
        src={mockBrandingSettings.companyLogo}
        alt="Company Logo"
        style={{ maxWidth: '100px', marginBottom: '10px' }}
      />
      <Text mb={2}>
        <strong>Company Name:</strong> {mockBrandingSettings.companyName}
      </Text>
      <Text mb={2}>
        <strong>Color Scheme:</strong> {mockBrandingSettings.colorScheme}
      </Text>
    </Card>
  );
}

export default CustomBranding;
