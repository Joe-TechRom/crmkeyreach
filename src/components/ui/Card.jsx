import React from 'react';
import {
  Box,
  useColorModeValue,
  forwardRef,
  chakra,
} from '@chakra-ui/react';

const Card = forwardRef(
  ({ variant = 'elevated', children, ...props }, ref) => {
    const bg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const shadowColor = useColorModeValue('gray.300', 'gray.900');

    let cardStyle = {};

    switch (variant) {
      case 'elevated':
        cardStyle = {
          bg,
          borderRadius: 'md',
          boxShadow: `md`,
          border: '1px solid',
          borderColor,
          transition: 'all 0.2s ease-in-out',
          _hover: {
            boxShadow: `lg`,
            transform: 'translateY(-2px)',
          },
        };
        break;
      case 'outlined':
        cardStyle = {
          bg: 'transparent',
          borderRadius: 'md',
          border: '1px solid',
          borderColor,
        };
        break;
      case 'filled':
        cardStyle = {
          bg: useColorModeValue('gray.100', 'gray.800'),
          borderRadius: 'md',
        };
        break;
      default:
        cardStyle = {
          bg,
          borderRadius: 'md',
          boxShadow: `md`,
          border: '1px solid',
          borderColor,
          transition: 'all 0.2s ease-in-out',
          _hover: {
            boxShadow: `lg`,
            transform: 'translateY(-2px)',
          },
        };
    }

    return (
      <chakra.div ref={ref} {...props} style={cardStyle}>
        {children}
      </chakra.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
