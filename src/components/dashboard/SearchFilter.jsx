'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

function SearchFilter() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('search_filter', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Implement search logic here
    console.log('Search term:', e.target.value);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Search & Filter
      </Text>
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        mb={2}
      />
      {/* Placeholder for filter options */}
      <Text>Filter Options (Coming Soon)</Text>
    </Card>
  );
}

export default SearchFilter;
