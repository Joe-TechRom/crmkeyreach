'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

const mockProperties = [
  { id: 1, address: '123 Main St, Anytown, USA', price: '$500,000' },
  { id: 2, address: '456 Oak Ave, Anytown, USA', price: '$750,000' },
];

function SocialMediaAdvertisement() {
  const { user } = useUser();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [adText, setAdText] = useState('');
  const [ads, setAds] = useState([]);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('oneclick_social_media_advertisement', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleCreateAd = () => {
    if (!selectedProperty) {
      alert('Please select a property');
      return;
    }

    const newAd = {
      id: ads.length + 1,
      property: selectedProperty,
      text: adText,
      status: 'Pending',
    };
    setAds([...ads, newAd]);
    alert('Ad created successfully!');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        One-Click Social Media Advertisement
      </Text>
      <Select
        placeholder="Select a Property"
        onChange={(e) => setSelectedProperty(mockProperties.find(p => p.id === parseInt(e.target.value)))}
        mb={2}
      >
        {mockProperties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.address}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder="Ad Text"
        value={adText}
        onChange={(e) => setAdText(e.target.value)}
        mb={2}
      />
      <Button onClick={handleCreateAd} mb={4}>
        Create Ad
      </Button>
      {ads.length > 0 && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Your Ads
          </Text>
          <ul>
            {ads.map((ad) => (
              <li key={ad.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Property:</strong> {ad.property.address}
                </Text>
                <Text>
                  <strong>Text:</strong> {ad.text}
                </Text>
                <Text>
                  <strong>Status:</strong> {ad.status}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default SocialMediaAdvertisement;
