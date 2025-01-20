import React from 'react';
import {
  Input as ChakraInput,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue,
  forwardRef,
} from '@chakra-ui/react';

const Input = forwardRef(
  ({ label, error, size = 'md', ...props }, ref) => {
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const errorBorderColor = useColorModeValue('red.500', 'red.300');
    const focusBorderColor = useColorModeValue('blue.500', 'blue.300');

    return (
      <FormControl isInvalid={!!error}>
        {label && <FormLabel htmlFor={props.id}>{label}</FormLabel>}
        <ChakraInput
          ref={ref}
          size={size}
          borderColor={borderColor}
          focusBorderColor={focusBorderColor}
          errorBorderColor={errorBorderColor}
          _hover={{
            borderColor: useColorModeValue('gray.400', 'gray.500'),
          }}
          {...props}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';

export default Input;
