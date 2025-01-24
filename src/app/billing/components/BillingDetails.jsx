// src/app/billing/components/BillingDetails.jsx
import {
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Badge,
  Divider,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { format } from 'date-fns';

export const BillingDetails = ({ profile }) => {
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const badgeColor = useColorModeValue('green.500', 'green.200');
  const badgeBg = useColorModeValue('green.100', 'green.900');
  const cardBg = useColorModeValue('white', 'whiteAlpha.100');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <Box bg={cardBg} p={6} rounded="xl" shadow="md">
      <Stack spacing={6}>
        <Heading size="lg" color={textColor}>
          Current Subscription
        </Heading>
        <Divider />
        <Flex align="center">
          <Text fontWeight="medium" color={textColor}>
            Status:
          </Text>
          <Spacer />
          <Badge colorScheme="green" color={badgeColor} bg={badgeBg}>
            {profile?.subscription_status || 'Inactive'}
          </Badge>
        </Flex>
        <Flex align="center">
          <Text fontWeight="medium" color={textColor}>
            Plan:
          </Text>
          <Spacer />
          <Text color={textColor}>{profile?.subscription_tier || 'No Plan'}</Text>
        </Flex>
        <Flex align="center">
          <Text fontWeight="medium" color={textColor}>
            Subscription Start:
          </Text>
          <Spacer />
          <Text color={textColor}>
            {formatDate(profile?.subscription_period_start)}
          </Text>
        </Flex>
        <Flex align="center">
          <Text fontWeight="medium" color={textColor}>
            Subscription Ends:
          </Text>
          <Spacer />
          <Text color={textColor}>
            {formatDate(profile?.subscription_period_end)}
          </Text>
        </Flex>
        {profile?.subscription_cancel_at && (
          <Flex align="center">
            <Text fontWeight="medium" color={textColor}>
              Cancellation Scheduled For:
            </Text>
            <Spacer />
            <Text color={textColor}>
              {formatDate(profile?.subscription_cancel_at)}
            </Text>
          </Flex>
        )}
        {profile?.subscription_current_period_end && (
          <Flex align="center">
            <Text fontWeight="medium" color={textColor}>
              Current Period Ends:
            </Text>
            <Spacer />
            <Text color={textColor}>
              {formatDate(profile?.subscription_current_period_end)}
            </Text>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};
