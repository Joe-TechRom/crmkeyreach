'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import {
  Box,
  Flex,
  Container,
  Button,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Stack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';
import { redirectDashboard } from '@/lib/utils/dashboard';
import { useUser } from '@/lib/hooks/useUser';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, loading: userLoading } = useUser();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      redirectDashboard(user, router);
    } else {
      router.push('/auth/signup');
    }
  };

  const handleDashboardRedirect = async () => {
    if (isAuthenticated) {
      await redirectDashboard(user, router);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  };

  return (
    <motion.nav initial="hidden" animate="visible" variants={navVariants}>
      <Box
        position="fixed"
        w="100%"
        zIndex="1000"
        transition="all 0.3s ease-in-out"
        bg={scrolled ? useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)') : 'transparent'}
        backdropFilter={scrolled ? 'blur(10px)' : 'none'}
        boxShadow={scrolled ? 'lg' : 'none'}
      >
        <Container maxW="8xl">
          <Flex minH={'72px'} align={'center'} justify={'space-between'}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link href="/">
                <Box position="relative" width="140px" height="40px">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={200}
                    height={100}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              </Link>
            </motion.div>

            <Flex display={{ base: 'none', md: 'flex' }} align="center">
              <Stack direction={'row'} spacing={8}>
                {navItems.map((item) => (
                  <motion.div key={item.path} variants={linkVariants} whileHover="hover">
                    <Link href={item.path}>
                      <Box position="relative" px={2} py={1}>
                        <Text
                          fontSize="md"
                          fontWeight="500"
                          color={pathname === item.path ? colors.orange.main : useColorModeValue('gray.600', 'gray.200')}
                          _hover={{ color: colors.orange.main }}
                          transition="all 0.2s"
                        >
                          {item.name}
                        </Text>
                        {pathname === item.path && (
                          <motion.div
                            layoutId="activeNav"
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: colors.orange.gradient,
                              borderRadius: '1px',
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Box>
                    </Link>
                  </motion.div>
                ))}
              </Stack>

              <Stack direction="row" spacing={4} ml={8}>
                {userLoading ? (
                  <Text>Loading...</Text>
                ) : isAuthenticated ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                    >
                      <HStack>
                        <Avatar
                          size={'sm'}
                          src={user?.user_metadata?.avatar_url}
                          name={user?.user_metadata?.full_name}
                        />
                        <Text display={{ base: 'none', md: 'block' }} color={useColorModeValue('gray.700', 'gray.200')}>
                          {user?.user_metadata?.full_name || 'User'}
                        </Text>
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                      <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
                      <MenuItem onClick={handleDashboardRedirect}>Dashboard</MenuItem>
                      <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <>
                    <Button
                      as={Link}
                      href="/auth/signin"
                      px={6}
                      h={10}
                      fontSize="md"
                      rounded="xl"
                      variant="outline"
                      borderColor={colors.orange.main}
                      color={colors.orange.main}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'lg',
                        bg: useColorModeValue('orange.50', 'whiteAlpha.100'),
                      }}
                      transition="all 0.2s"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleGetStarted}
                      px={6}
                      h={10}
                      fontSize="md"
                      rounded="xl"
                      bgGradient={colors.orange.gradient}
                      color="white"
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      <Text position="relative" zIndex={1}>
                        Get Started
                      </Text>
                    </Button>
                  </>
                )}
              </Stack>
            </Flex>

            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              color={colors.orange.main}
            />
          </Flex>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Stack
                  bg={useColorModeValue('white', 'gray.800')}
                  p={4}
                  display={{ md: 'none' }}
                  spacing={4}
                  rounded="xl"
                  shadow="xl"
                >
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Text
                        fontSize="md"
                        color={pathname === item.path ? colors.orange.main : useColorModeValue('gray.600', 'gray.200')}
                        _hover={{ color: colors.orange.main }}
                      >
                        {item.name}
                      </Text>
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <Stack spacing={2}>
                      <Button onClick={handleDashboardRedirect} w="full" variant="outline" colorScheme="orange">
                        Dashboard
                      </Button>
                      <Button onClick={handleLogout} w="full" variant="outline" colorScheme="orange">
                        Logout
                      </Button>
                    </Stack>
                  ) : (
                    <Stack spacing={2}>
                      <Button as={Link} href="/auth/signin" w="full" variant="outline" colorScheme="orange">
                        Sign In
                      </Button>
                      <Button
                        onClick={handleGetStarted}
                        w="full"
                        bgGradient={colors.orange.gradient}
                        color="white"
                      >
                        Get Started
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </motion.nav>
  );
};

export default Navbar;
