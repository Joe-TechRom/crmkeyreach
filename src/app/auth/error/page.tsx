'use client';

import { useSearchParams } from 'next/navigation';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  useToast, 
  useColorModeValue,
  Icon,
  Container
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const errorIconColor = useColorModeValue('red.500', 'red.300');

  const handleRetry = () => {
    toast({
      title: 'Redirecting to signup',
      description: 'Taking you back to the signup page',
      status: 'info',
      duration: 2000,
    });
    router.push('/auth/signup');
  };

  return (
    <Container maxW="container.md" py={20}>
      <Box 
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow={boxShadow}
        position="relative"
        overflow="hidden"
      >
        <VStack spacing={8} align="center">
          <Icon 
            as={FiAlertTriangle} 
            w={12} 
            h={12} 
            color={errorIconColor}
          />
          <Heading 
            size="xl" 
            color={textColor}
            textAlign="center"
          >
            Authentication Error
          </Heading>
          <Text 
            fontSize="lg" 
            textAlign="center" 
            color={textColor}
            maxW="md"
          >
            {errorDescription || 'An error occurred during authentication'}
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={handleRetry}
            _hover={{ 
              transform: 'translateY(-2px)',
              boxShadow: 'xl'
            }}
            transition="all 0.2s"
            rounded="full"
            px={8}
          >
            Try Again
          </Button>
        </VStack>
        
        {/* Decorative background element */}
        <Box
          position="absolute"
          top="-20%"
          right="-20%"
          width="200px"
          height="200px"
          bg="blue.500"
          opacity="0.1"
          borderRadius="full"
          zIndex="0"
        />
        <Box
          position="absolute"
          bottom="-10%"
          left="-10%"
          width="150px"
          height="150px"
          bg="red.500"
          opacity="0.1"
          borderRadius="full"
          zIndex="0"
        />
      </Box>
    </Container>
  );
}
