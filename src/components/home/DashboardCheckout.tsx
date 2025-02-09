'use client';

import { motion } from 'framer-motion';
import { useState } from 'react'; // Add this import
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Card,
  RadioGroup,
  Radio,
  HStack,
} from '@chakra-ui/react';
import { subscriptionPlans } from '@/config/plans';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const DashboardCheckout = ({ onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState('');

  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)'
    }
  };

  const glassEffect = {
    backgroundColor: useColorModeValue(
      'rgba(255, 255, 255, 0.9)',
      'rgba(26, 32, 44, 0.8)'
    ),
    backdropFilter: 'blur(10px)',
    borderWidth: '1px',
    borderColor: useColorModeValue('gray.200', 'whiteAlpha.100'),
  };

  const handleSubscribe = () => {
    onSubscribe(selectedPlan);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <RadioGroup onChange={setSelectedPlan} value={selectedPlan}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
          gap={8}
        >
          {Object.values(subscriptionPlans).map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              <Card
                {...glassEffect}
                p={8}
                rounded="2xl"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  bgGradient: colors.orange.gradient,
                  opacity: 0.2,
                }}
              >
                <Stack spacing={6}>
                  <HStack justify="space-between">
                    <Heading size="lg">{plan.name}</Heading>
                    <Radio value={plan.id} />
                  </HStack>

                  <Box>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      bgGradient={colors.orange.gradient}
                      bgClip="text"
                    >
                      ${plan.monthlyPrice}/mo
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      or ${plan.yearlyPrice}/year
                    </Text>
                  </Box>
                  <Stack spacing={4}>
                    {plan.features.map((feature, index) => (
                      <HStack key={index} align="flex-start">
                        <Box
                          as="span"
                          color="orange.400"
                          fontSize="lg"
                        >
                          ✓
                        </Box>
                        <Text>{feature.text}</Text>
                      </HStack>
                    ))}
                  </Stack>
                  {plan.userLimit && (
                    <Text fontSize="sm" color="gray.500">
                      Up to {plan.userLimit} users
                    </Text>
                  )}
                </Stack>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </RadioGroup>
      <motion.div variants={itemVariants}>
        <Button
          mt={8}
          size="lg"
          width="full"
          bgGradient={colors.orange.gradient}
          color="white"
          onClick={() => handleSubscribe(selectedPlan)}
          _hover={{
            transform: 'translateY(-2px)',
            shadow: '2xl'
          }}
          transition="all 0.2s"
          isDisabled={!selectedPlan}
        >
          Upgrade Now
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCheckout;
