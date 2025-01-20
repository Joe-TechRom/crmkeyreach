'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockSyncStatus = {
  lastSyncTime: '2024-01-27 10:00 AM',
  status: 'Synced',
};

function CloudBackupSync() {
  const { user } = useUser();
  const [syncStatus, setSyncStatus] = useState(mockSyncStatus);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('cloud_backup_multi_device_sync', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleSync = () => {
    // Implement cloud backup and sync logic here
    console.log('Initiating cloud backup and sync...');
    setSyncStatus({ ...syncStatus, status: 'Syncing' });
    setTimeout(() => {
      setSyncStatus({ ...syncStatus, status: 'Synced', lastSyncTime: new Date().toLocaleString() });
    }, 2000);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Cloud Backup & Multi-Device Sync
      </Text>
      <Text mb={2}>
        <strong>Last Sync Time:</strong> {syncStatus.lastSyncTime}
      </Text>
      <Text mb={2}>
        <strong>Status:</strong> {syncStatus.status}
      </Text>
      <Button onClick={handleSync}>Initiate Sync</Button>
    </Card>
  );
}

export default CloudBackupSync;
