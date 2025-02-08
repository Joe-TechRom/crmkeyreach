'use client';

import { usePathname } from 'next/navigation';
import { Box } from '@chakra-ui/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/utils/ScrollToTop';
import ThemeToggle from '@/components/utils/ThemeToggle';

export default function ClientLayout({ children }) {
  const isDashboard = usePathname()?.startsWith('/dashboard');
  
  return (
    <Box
      as="div"
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100%"
      position="relative"
      overflow="hidden"
    >
      {!isDashboard && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="sticky"
          backdropFilter="blur(12px)"
          bg="whiteAlpha.800"
          _dark={{
            bg: "blackAlpha.800"
          }}
          boxShadow="sm"
          transition="all 0.2s ease-in-out"
        >
          <Navbar />
        </Box>
      )}

      <Box
        as="main"
        flexGrow={1}
        width="100%"
        position="relative"
        zIndex="1"
        pt={!isDashboard ? { base: '76px', md: '80px' } : '0'}
      >
        {children}
      </Box>

      {!isDashboard && <Footer />}

      <Box
        position="fixed"
        bottom="4"
        right="4"
        zIndex="tooltip"
        display="flex"
        flexDirection="column"
        gap="3"
      >
        <ScrollToTop />
        <ThemeToggle />
      </Box>
    </Box>
  );
}
