import { subscriptionActions } from '@/utils/subscriptionActions';
import { Button, VStack, Text, useToast } from '@chakra-ui/react';

export const SubscriptionManager = ({ subscriptionId, currentPriceId }) => {
  const toast = useToast();

  const handleUpdateSubscription = async (newPriceId: string) => {
    const result = await subscriptionActions.updateSubscription(subscriptionId, newPriceId);
    if (result.status === 'success') {
      toast({
        title: 'Subscription Updated',
        status: 'success'
      });
    }
  };

  const handlePauseSubscription = async () => {
    const result = await subscriptionActions.pauseSubscription(subscriptionId);
    if (result.status === 'success') {
      toast({
        title: 'Subscription Paused',
        status: 'success'
      });
    }
  };

  const handleCancelSubscription = async () => {
    const result = await subscriptionActions.cancelSubscription(subscriptionId);
    if (result.status === 'success') {
      toast({
        title: 'Subscription Cancelled',
        status: 'success'
      });
    }
  };

  const handleRenewSubscription = async () => {
    const result = await subscriptionActions.renewSubscription(subscriptionId);
    if (result.status === 'success') {
      toast({
        title: 'Subscription Renewed',
        status: 'success'
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="xl" fontWeight="bold">Manage Your Subscription</Text>
      <Button onClick={() => handleUpdateSubscription(newPriceId)}>Update Plan</Button>
      <Button onClick={handlePauseSubscription}>Pause Subscription</Button>
      <Button onClick={handleCancelSubscription}>Cancel Subscription</Button>
      <Button onClick={handleRenewSubscription}>Renew Subscription</Button>
    </VStack>
  );
};
