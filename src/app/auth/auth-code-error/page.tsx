'use client';

import { Box, Container, Heading, Text, Button, useColorModeValue, Flex, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MdErrorOutline } from 'react-icons/md';

const AuthCodeErrorPage = () => {
  const router = useRouter();

  // Optional: Redirect to login after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/signin');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [router]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const containerBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const buttonColor = useColorModeValue('orange.500', 'orange.300');

  return (
    <Box bg={bgColor} minH="100vh" py={12} display="flex" justifyContent="center" alignItems="center">
      <Container maxW="container.md" bg={containerBgColor} boxShadow="xl" rounded="md" p={8} textAlign="center">
        <Flex justify="center" mb={4}>
          <Icon as={MdErrorOutline} boxSize={12} color="red.500" />
        </Flex>
        <Heading as="h2" size="xl" mb={4} color={useColorModeValue('red.600', 'red.400')}>
          Authentication Error
        </Heading>
        <Text fontSize="lg" color={textColor} mb={6}>
          There was an error verifying your authentication code. This could be due to an invalid or expired code.
        </Text>
        <Text fontSize="md" color={textColor} mb={6}>
          You will be automatically redirected to the sign-in page in 5 seconds.
        </Text>
        <Button colorScheme="orange" onClick={() => router.push('/signin')}>
          Go to Sign In Page
        </Button>
      </Container>
    </Box>
  );
};

export default AuthCodeErrorPage;
