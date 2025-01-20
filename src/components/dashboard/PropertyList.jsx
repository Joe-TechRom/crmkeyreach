'use client';

import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockProperties = [
  {
    id: 1,
    address: '123 Main St',
    price: '$500,000',
    status: 'For Sale',
  },
  {
    id: 2,
    address: '456 Oak Ave',
    price: '$750,000',
    status: 'Under Contract',
  },
  {
    id: 3,
    address: '789 Pine Ln',
    price: '$600,000',
    status: 'Sold',
  },
];

function PropertyList() {
  const { user } = useUser();

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('view_properties', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Property Listings
      </Text>
      <ul>
        {mockProperties.map((property) => (
          <li key={property.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Address:</strong> {property.address}
            </Text>
            <Text>
              <strong>Price:</strong> {property.price}
            </Text>
            <Text>
              <strong>Status:</strong> {property.status}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default PropertyList;
