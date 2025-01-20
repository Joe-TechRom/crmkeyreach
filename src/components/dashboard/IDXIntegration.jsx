'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Input } from '@/components/ui/Input';

const mockIDXListings = [
  { id: 1, address: '123 Main St, Anytown, USA', price: '$500,000', bedrooms: 3, bathrooms: 2 },
  { id: 2, address: '456 Oak Ave, Anytown, USA', price: '$750,000', bedrooms: 4, bathrooms: 3 },
  { id: 3, address: '789 Pine Ln, Anytown, USA', price: '$300,000', bedrooms: 2, bathrooms: 1 },
];

function IDXIntegration() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState(mockIDXListings);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('IDX-Related Features', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = mockIDXListings.filter((listing) =>
      listing.address.toLowerCase().includes(query)
    );
    setFilteredListings(filtered);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        IDX Integration
      </Text>
      <Input
        type="text"
        placeholder="Search Listings"
        value={searchQuery}
        onChange={handleSearch}
        mb={2}
      />
      {filteredListings.length > 0 ? (
        <ul>
          {filteredListings.map((listing) => (
            <li key={listing.id} style={{ marginBottom: '5px' }}>
              <Text>
                <strong>Address:</strong> {listing.address}
              </Text>
              <Text>
                <strong>Price:</strong> {listing.price}
              </Text>
              <Text>
                <strong>Bedrooms:</strong> {listing.bedrooms}
              </Text>
              <Text>
                <strong>Bathrooms:</strong> {listing.bathrooms}
              </Text>
            </li>
          ))}
        </ul>
      ) : (
        <Text>No listings found.</Text>
      )}
    </Card>
  );
}

export default IDXIntegration;
