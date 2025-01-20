'use client';

import {
  Box,
  Text,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { useUser } from '@/lib/hooks/useUser';
import { redirect } from 'next/navigation';
import SingleUserDashboard from './single-user/page';
import TeamDashboard from './team/page';
import CorporateDashboard from './corporate/page';

const colors = {
  primary: '#1A202C',
  secondary: '#4A5568',
  accent: '#FF6B2C',
  background: '#F7FAFC',
  text: '#2D3748',
};

const DashboardPage = () => {
  const { user, loading, isAuthenticated } = useUser();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    redirect('/auth/signin');
    return null;
  }

  const userTier = user?.tier || 'single-user'; // Default to single-user if tier is not defined

  return (
    <Box
      bg={useColorModeValue(colors.background, colors.primary)}
      minH="100vh"
      py={10}
    >
      <Container maxW="8xl">
        {userTier === 'single-user' && <SingleUserDashboard />}
        {userTier === 'team' && <TeamDashboard />}
        {userTier === 'corporate' && <CorporateDashboard />}
      </Container>
    </Box>
  );
};

export default DashboardPage;
