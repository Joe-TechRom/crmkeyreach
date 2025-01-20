'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Input } from '@/components/ui/Input';

function MortgageCalculator() {
  const { user } = useUser();
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('mortgage_interest_rate_calculator', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || isNaN(monthlyInterestRate) || isNaN(numberOfPayments) || principal <= 0 || monthlyInterestRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(null);
      return;
    }

    const payment =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Mortgage Interest Rate Calculator
      </Text>
      <Input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        mb={2}
      />
      <Input
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        mb={2}
      />
      <Input
        type="number"
        placeholder="Loan Term (Years)"
        value={loanTerm}
        onChange={(e) => setLoanTerm(e.target.value)}
        mb={2}
      />
      <Button onClick={calculateMonthlyPayment} mb={4}>
        Calculate
      </Button>
      {monthlyPayment && (
        <Text fontSize="lg" fontWeight="bold">
          Monthly Payment: ${monthlyPayment}
        </Text>
      )}
    </Card>
  );
}

export default MortgageCalculator;
