'use client';

import { useEffect, useState } from 'react';
import { Sidebar, ViewProvider } from '@/components/dashboard/Sidebar';
import { Box, useColorModeValue, Spinner, Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const mainBg = useColorModeValue('gray.50', 'gray.900');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/signin');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  if (!isAuthenticated) {
    return (
      <Center h="100vh" bg={mainBg}>
        <Spinner size="xl" color="orange.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <ViewProvider>
      <Box display="flex" minH="100vh" w="100vw" bg={mainBg} position="relative">
        <Sidebar />
        <Box
          as="main"
          flex="1"
          transition="all 0.3s"
          overflow="auto"
          h="100vh"
          w="100%"
          position="absolute"
          left="0"
          top="0"
          right="0"
          bottom="0"
        >
          {children}
        </Box>
      </Box>
    </ViewProvider>
  );
}
