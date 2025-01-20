'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Input } from '@/components/ui/Input';

const mockTransactions = [
  { id: 1, date: '2024-07-25', amount: '$1000', status: 'Completed' },
  { id: 2, date: '2024-07-26', amount: '$500', status: 'Pending' },
  { id: 3, date: '2024-07-27', amount: '$2000', status: 'Completed' },
];

function PaymentIntegration() {
  const { user } = useUser();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [transactions, setTransactions] = useState(mockTransactions);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('payment_integration', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleProcessPayment = () => {
    const newTransaction = {
      id: transactions.length + 1,
      date: new Date().toLocaleDateString(),
      amount: `$${paymentAmount}`,
      status: 'Completed',
    };
    setTransactions([...transactions, newTransaction]);
    alert('Payment processed successfully!');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Payment Integration
      </Text>
      <Input
        type="number"
        placeholder="Payment Amount"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
        mb={2}
      />
      <Button onClick={handleProcessPayment} mb={4}>
        Process Payment
      </Button>
      {transactions.length > 0 && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Transaction History
          </Text>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Date:</strong> {transaction.date}
                </Text>
                <Text>
                  <strong>Amount:</strong> {transaction.amount}
                </Text>
                <Text>
                  <strong>Status:</strong> {transaction.status}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default PaymentIntegration;
