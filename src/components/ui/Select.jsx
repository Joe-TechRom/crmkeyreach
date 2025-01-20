import { forwardRef } from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';

const Select = forwardRef(
  (props, ref) => {
    return (
      <chakra.select
        ref={ref}
        {...props}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px blue.500',
        }}
        _hover={{
          borderColor: 'gray.300',
        }}
      />
    );
  }
);

Select.displayName = 'Select';

export { Select };
