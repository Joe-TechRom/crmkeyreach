'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  const handleGetStarted = () => {
    router.push('/signup');
  };

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

  const bgColor = useColorModeValue(
    scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
    scrolled ? 'rgba(26, 32, 44, 0.9)' : 'transparent'
  );

  const buttonStyles = {
    transform: 'translateY(-2px)',
    boxShadow: 'lg',
    background: useColorModeValue(
      'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
      'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)'
    ),
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

  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <motion.nav initial="hidden" animate="visible" variants={navVariants}>
      <Box
        position="fixed"
        w="100%"
        zIndex="1000"
        transition="all 0.3s ease-in-out"
        bg={bgColor}
        backdropFilter={scrolled ? 'blur(10px)' : 'none'}
        boxShadow={scrolled ? 'lg' : 'none'}
        css={{
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            zIndex: -1,
          },
        }}
      >
        <Container maxW="8xl" px={{ base: 4, md: 6, lg: 8 }}>
          <Flex minH={'72px'} align={'center'} justify={'space-between'}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Box position="relative" width="140px" height="40px">
                <Link href="/">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={200}
                    height={100}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </Link>
              </Box>
            </motion.div>

            <Flex display={{ base: 'none', md: 'flex' }} align="center">
              <Stack direction={'row'} spacing={8}>
                {navItems.map((item) => (
                  <motion.div key={item.path} variants={linkVariants} whileHover="hover">
                    <Box position="relative" px={2} py={1}>
                      <Link href={item.path}>
                        <Text
                          fontSize="md"
                          fontWeight="500"
                          color={pathname === item.path ? colors.orange.main : textColor}
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
                      </Link>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
              <Button
                px={6}
                h={10}
                fontSize="md"
                rounded="xl"
                bgGradient={colors.orange.gradient}
                color="white"
                _hover={buttonStyles}
                transition="all 0.2s"
                onClick={handleGetStarted}
                ml={8}
              >
                Get Started
              </Button>
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
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
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
                    <Box key={item.path}>
                      <Link href={item.path}>
                        <Text
                          fontSize="md"
                          color={pathname === item.path ? colors.orange.main : textColor}
                          _hover={{ color: colors.orange.main }}
                        >
                          {item.name}
                        </Text>
                      </Link>
                    </Box>
                  ))}
                  <Button
                    w="full"
                    bgGradient={colors.orange.gradient}
                    color="white"
                    _hover={buttonStyles}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
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
