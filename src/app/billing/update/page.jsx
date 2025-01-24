// src/app/billing/update/page.jsx
'use client';

import {
  Box,
  Container,
  Heading,
  Stack,
  useColorModeValue,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getSubscriptionFromProfile } from '@/lib/utils/subscription';
import { BillingDetails } from '@/app/billing/components/BillingDetails';
import { PaymentMethodUpdate } from '@/app/billing/components/PaymentMethodUpdate';
import { SubscriptionCancel } from '@/app/billing/components/SubscriptionCancel';
import { logError } from '@/lib/utils/log';

function BillingUpdatePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const bgGradient = useColorModeValue(
    'radial-gradient(circle at 0% 0%, rgba(0, 102, 255, 0.1) 0%, transparent 30%), radial-gradient(circle at 100% 100%, rgba(91, 142, 239, 0.1) 0%, transparent 30%)',
    'radial-gradient(circle at 0% 0%, rgba(26, 32, 44, 0.3) 0%, transparent 30%), radial-gradient(circle at 100% 100%, rgba(45, 55, 72, 0.3) 0%, transparent 30%)'
  );

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }
        const profileData = await getSubscriptionFromProfile(user.id);
        if (profileData.error) {
          setError(profileData.error);
          logError('Error fetching profile:', profileData.error, profileData.details);
          return;
        }
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load billing information.');
        logError('Error in BillingUpdatePage:', err.message, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        bg={bgGradient}
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        bg={bgGradient}
      >
        <Text color={textColor} fontSize="xl">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box bg={bgGradient} minH="100vh" pb={20}>
      <Container maxW="7xl" pt={20}>
        <Stack spacing={10}>
          <Heading size="2xl" color={textColor} textAlign="center">
            Billing Information
          </Heading>
          <BillingDetails profile={profile} />
          <PaymentMethodUpdate profile={profile} />
          <SubscriptionCancel profile={profile} />
        </Stack>
      </Container>
    </Box>
  );
}

export default BillingUpdatePage;
