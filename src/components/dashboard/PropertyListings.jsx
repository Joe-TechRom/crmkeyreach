'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockProperties = [
  { id: 1, address: '123 Main St', price: '$500,000', bedrooms: 3, bathrooms: 2 },
  { id: 2, address: '456 Oak Ave', price: '$750,000', bedrooms: 4, bathrooms: 3 },
  { id: 3, address: '789 Pine Ln', price: '$300,000', bedrooms: 2, bathrooms: 1 },
];

function PropertyListings() {
  const { user } = useUser();
  const [properties, setProperties] = useState(mockProperties);
  const [newProperty, setNewProperty] = useState({
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
  });

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('property_listings', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleInputChange = (e) => {
    setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
  };

  const handleCreateProperty = () => {
    const newPropertyWithId = { ...newProperty, id: properties.length + 1 };
    setProperties([...properties, newPropertyWithId]);
    setNewProperty({ address: '', price: '', bedrooms: '', bathrooms: '' });
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Property Listings
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Create New Property
      </Text>
      <Input
        placeholder="Address"
        name="address"
        value={newProperty.address}
        onChange={handleInputChange}
        mb={2}
      />
      <Input
        placeholder="Price"
        name="price"
        value={newProperty.price}
        onChange={handleInputChange}
        mb={2}
      />
      <Input
        placeholder="Bedrooms"
        name="bedrooms"
        value={newProperty.bedrooms}
        onChange={handleInputChange}
        mb={2}
      />
      <Input
        placeholder="Bathrooms"
        name="bathrooms"
        value={newProperty.bathrooms}
        onChange={handleInputChange}
        mb={2}
      />
      <Button onClick={handleCreateProperty} mb={4}>
        Create Property
      </Button>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Property List
      </Text>
      <ul>
        {properties.map((property) => (
          <li key={property.id} style={{ marginBottom: '10px' }}>
            <Text>
              <strong>Address:</strong> {property.address}
            </Text>
            <Text>
              <strong>Price:</strong> {property.price}
            </Text>
            <Text>
              <strong>Bedrooms:</strong> {property.bedrooms}
            </Text>
            <Text>
              <strong>Bathrooms:</strong> {property.bathrooms}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default PropertyListings;
