'use client';

import React, { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react';
import {
  Box, VStack, Icon, Text, Flex, useColorModeValue, IconButton, Button,
  Accordion, AccordionItem, AccordionButton, AccordionPanel
} from '@chakra-ui/react';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useDisclosure, useBreakpointValue } from '@chakra-ui/react';
import { PLAN_FEATURES, FeatureCategory } from './features';
import { useRouter } from 'next/navigation';

interface ViewContextProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const ViewContext = createContext<ViewContextProps | undefined>(undefined);

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState('/dashboard/single-user');
  const value = {
    currentView,
    setCurrentView,
  };
  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

// Remove this interface
// interface SidebarProps {
//   setCurrentView: (view: string) => void;
// }

// Update the Sidebar function definition
export function Sidebar() {
  const supabase = createClientComponentClient();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [userPlanType, setUserPlanType] = useState('single-user');
  const [menuItems, setMenuItems] = useState<FeatureCategory[]>(PLAN_FEATURES['single-user']);
  const router = useRouter();
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)'
    }
  };
  const bgColor = useColorModeValue('white', 'gray.800');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)');

  // Use the useView hook to access setCurrentView
  const { setCurrentView } = useView();

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('user_id', session.user.id)
            .single();
          if (profile?.subscription_tier) {
            setUserPlanType(profile.subscription_tier);
            setMenuItems(PLAN_FEATURES[profile?.subscription_tier as keyof typeof PLAN_FEATURES] || PLAN_FEATURES['single-user']);
          }
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
        setMenuItems(PLAN_FEATURES['single-user']);
      }
    };
    fetchUserPlan();
  }, [supabase]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  }, [supabase, router]);

  const handleNavigation = useCallback((path: string) => {
  // If it's the dashboard path, stay in current tier view
  if (path === '/dashboard') {
    setCurrentView(`/dashboard/${userPlanType}`);
  } else {
    setCurrentView(path);
  }
}, [setCurrentView, userPlanType]);


  const renderMenuItems = useCallback(() => {
    const colorModeValue = useColorModeValue('gray.700', 'gray.200');
    return menuItems.map((category, idx) => {
      return (
        <AccordionItem key={idx} border="none">
          <AccordionButton
            px={4}
            py={2}
            _hover={{ bg: 'transparent' }}
          >
            <Text fontWeight="bold" color={colorModeValue}>
              {category.category}
            </Text>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack spacing={2} align="stretch">
              {category.items.map((item) => (
                <Flex
                  key={item.name}
                  align="center"
                  p={2}
                  cursor="pointer"
                  borderRadius="lg"
                  role="group"
                  onClick={() => handleNavigation(item.path)}
                  _hover={{
                    bgGradient: colors.orange.gradient,
                    color: 'white',
                    transform: 'translateX(8px)'
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} boxSize={5} />
                  <Text ml={4} fontSize="sm">{item.name}</Text>
                </Flex>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      );
    });
  }, [menuItems, handleNavigation, colors.orange.gradient]);

  return (
    <Box
      position="fixed"
      left={isOpen ? "0" : "-64"}
      top="0"
      height="100vh"
      transition="left 0.3s"
      zIndex="1000"
      backgroundColor={useColorModeValue('white', 'gray.800')}
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={<FiMenu />}
        position="absolute"
        right="-12"
        top="4"
        onClick={onToggle}
        variant="ghost"
        color={useColorModeValue('gray.600', 'gray.400')}
        _hover={{
          bgGradient: colors.orange.gradient,
          color: 'white'
        }}
      />
      <Box
        w="64"
        h="full"
        bg={bgColor}
        backdropFilter="blur(10px)"
        borderTopRightRadius="2xl"
        borderBottomRightRadius="2xl"
        boxShadow={`0 4px 12px ${shadowColor}`}
        px={4}
        py={8}
        position="relative"
        transition="all 0.2s"
        overflowY="auto"
      >
        <VStack spacing={4} align="stretch">
          <Accordion allowMultiple defaultIndex={[0]}>
            {renderMenuItems()}
          </Accordion>
          <Button
            leftIcon={<FiLogOut />}
            onClick={handleSignOut}
            variant="ghost"
            w="full"
            justifyContent="flex-start"
            borderRadius="xl"
            color={useColorModeValue('gray.600', 'gray.400')}
            _hover={{
              bgGradient: colors.orange.gradient,
              color: 'white',
              transform: 'translateX(8px)'
            }}
            transition="all 0.2s"
          >
            Sign Out
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
