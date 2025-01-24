import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxW="xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading size="2xl">404 - Page Not Found</Heading>
        <Text fontSize="xl">The page you're looking for doesn't exist.</Text>
        <Link href="/">
          <Button colorScheme="blue" size="lg">
            Return Home
          </Button>
        </Link>
      </VStack>
    </Container>
  );
}
