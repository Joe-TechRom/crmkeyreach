import React from 'react';
import {
  Box,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';

const DynamicContent = () => {
  const boxShadow = useColorModeValue(
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 4px 12px rgba(0, 0, 0, 0.4)'
  );

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {/* Card 1 */}
      <Box
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
        rounded="xl"
        boxShadow={boxShadow}
        borderWidth="1px"
        borderColor={useColorModeValue('orange.100', 'orange.700')}
        backdropFilter="blur(10px)"
      >
        Card 1 Content
      </Box>

      {/* Card 2 */}
      <Box
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
        rounded="xl"
        boxShadow={boxShadow}
        borderWidth="1px"
        borderColor={useColorModeValue('orange.100', 'orange.700')}
        backdropFilter="blur(10px)"
      >
        Card 2 Content
      </Box>

      {/* Card 3 */}
      <Box
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
        rounded="xl"
        boxShadow={boxShadow}
        borderWidth="1px"
        borderColor={useColorModeValue('orange.100', 'orange.700')}
        backdropFilter="blur(10px)"
      >
        Card 3 Content
      </Box>

      {/* Add more cards as needed */}
    </SimpleGrid>
  );
};

export default DynamicContent;
