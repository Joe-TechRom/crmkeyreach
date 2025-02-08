'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Box, Spinner, Center } from '@chakra-ui/react';

export default function DashboardDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
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
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  if (!isAuthenticated) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="orange.500" thickness="4px" />
      </Center>
    );
  }

  return <>{children}</>;
}
