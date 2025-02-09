'use client';

import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Sidebar, ViewProvider } from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };

  const gradientBg = useColorModeValue(
    `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `,
    `
    radial-gradient(circle at 0% 0%, rgba(255, 154, 92, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, rgba(255, 107, 44, 0.10) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(255, 154, 92, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(255, 107, 44, 0.10) 0%, transparent 50%)
  `
  );

  const backgroundColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900');

  return (
    <ViewProvider>
      <Box
        position="relative"
        overflow="hidden"
        display="flex"
        minH="100vh"
        bg={backgroundColor}
        color={textColor}
      >
        <Box
          position="absolute"
          inset="0"
          zIndex={0}
          style={{ background: gradientBg }}
          filter="blur(120px)"
          opacity="0.6"
          transform="scale(1.2)"
        />
        <Sidebar />
        <Box
          flex="1"
          p={{ base: 4, md: 8 }}
          position="relative"
          zIndex={1}
        >
          {children}
        </Box>
      </Box>
    </ViewProvider>
  );
}
