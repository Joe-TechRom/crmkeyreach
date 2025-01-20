import React, { forwardRef } from 'react';
import {
  Button as ChakraButton,
  Spinner,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react';

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Loading...',
      children,
      ...props
    },
    ref
  ) => {
    const primaryBg = useColorModeValue('blue.500', 'blue.300');
    const primaryHoverBg = useColorModeValue('blue.600', 'blue.400');
    const primaryActiveBg = useColorModeValue('blue.700', 'blue.500');
    const primaryColor = useColorModeValue('white', 'gray.900');

    const secondaryBg = useColorModeValue('gray.200', 'gray.700');
    const secondaryHoverBg = useColorModeValue('gray.300', 'gray.600');
    const secondaryActiveBg = useColorModeValue('gray.400', 'gray.500');
    const secondaryColor = useColorModeValue('gray.800', 'white');

    let buttonStyle = {};

    switch (variant) {
      case 'primary':
        buttonStyle = {
          bg: primaryBg,
          color: primaryColor,
          _hover: {
            bg: primaryHoverBg,
          },
          _active: {
            bg: primaryActiveBg,
          },
        };
        break;
      case 'secondary':
        buttonStyle = {
          bg: secondaryBg,
          color: secondaryColor,
          _hover: {
            bg: secondaryHoverBg,
          },
          _active: {
            bg: secondaryActiveBg,
          },
        };
        break;
      case 'ghost':
        buttonStyle = {
          bg: 'transparent',
          color: useColorModeValue('gray.700', 'gray.200'),
          _hover: {
            bg: useColorModeValue('gray.100', 'gray.800'),
          },
          _active: {
            bg: useColorModeValue('gray.200', 'gray.700'),
          },
        };
        break;
      case 'link':
        buttonStyle = {
          bg: 'transparent',
          color: useColorModeValue('blue.500', 'blue.300'),
          padding: 0,
          height: 'auto',
          _hover: {
            textDecoration: 'underline',
          },
          _active: {
            color: useColorModeValue('blue.700', 'blue.500'),
          },
        };
        break;
      default:
        buttonStyle = {
          bg: primaryBg,
          color: primaryColor,
          _hover: {
            bg: primaryHoverBg,
          },
          _active: {
            bg: primaryActiveBg,
          },
        };
    }

    return (
      <ChakraButton
        ref={ref}
        size={size}
        {...props}
        style={buttonStyle}
        isLoading={isLoading}
        loadingText={loadingText}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
