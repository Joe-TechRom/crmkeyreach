'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react'
import Navbar from '@/components/navigation/Navbar'

const Layout = ({ children }) => {
  const bgGradient = useColorModeValue(
    'radial-gradient(circle at 0% 0%, rgba(107, 142, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(45, 91, 255, 0.05) 0%, transparent 50%)',
    'radial-gradient(circle at 0% 0%, rgba(107, 142, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(45, 91, 255, 0.1) 0%, transparent 50%)'
  )

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4
      }
    }
  }

  const footerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { delay: 0.5, duration: 0.4 }
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg={useColorModeValue('white', 'gray.900')}
      backgroundImage={bgGradient}
      scrollBehavior="smooth"
      position="relative"
      width="100vw"
      maxWidth="100%"
      overflow="hidden"
    >
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        width="100%"
      >
        <Navbar />
      </Box>
      
      <AnimatePresence mode="wait">
        <motion.div
          style={{
            flexGrow: 1,
            width: '100%',
            marginTop: '80px', // Increased for better spacing
            position: 'relative',
            zIndex: 1
          }}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Box
            position="relative"
            width="100%"
            maxWidth="100vw"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100vw',
              height: '100%',
              maxWidth: '100%',
              bgGradient: useColorModeValue(
                'radial-gradient(circle at 50% 0%, rgba(107, 142, 255, 0.03) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 0%, rgba(45, 91, 255, 0.06) 0%, transparent 70%)'
              ),
              zIndex: -1,
            }}
          >
            {children}
          </Box>
        </motion.div>
      </AnimatePresence>

      <motion.footer
        variants={footerVariants}
        initial="initial"
        animate="animate"
        style={{ 
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}
      >
        <Box
          py={8}
          width="100%"
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderTop="1px"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
          backdropFilter="blur(10px)"
        >
          <Container maxW="7xl">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align="center"
              spacing={{ base: 4, md: 0 }}
            >
              <Text
                fontSize="sm"
                color={useColorModeValue('gray.600', 'gray.400')}
              >
                © {new Date().getFullYear()} KeyReach CRM. All rights reserved.
              </Text>
              
              <Stack
                direction="row"
                spacing={6}
                align="center"
              >
                <Link
                  href="/privacy"
                  fontSize="sm"
                  color={useColorModeValue('gray.600', 'gray.400')}
                  _hover={{
                    color: useColorModeValue('primary.500', 'primary.300'),
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  fontSize="sm"
                  color={useColorModeValue('gray.600', 'gray.400')}
                  _hover={{
                    color: useColorModeValue('primary.500', 'primary.300'),
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                >
                  Terms of Service
                </Link>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </motion.footer>
    </Box>
  )
}

export default Layout
