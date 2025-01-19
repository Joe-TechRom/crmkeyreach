'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Box, Container, Grid, Heading, Text, Stack, Button, useColorModeValue, Icon } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons'
import { StartTrial } from '@/components/pricing/StartTrial'

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`

const Hero = () => {
  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)'
    }
  }

  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `

  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotate: -2
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  }

  const floatingAnimation = {
    y: [-10, 10],
    rotate: [-1, 1],
    transition: {
      y: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      },
      rotate: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }

  return (
    <Box 
      position="relative" 
      overflow="hidden"
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      marginTop="-80px"
      paddingTop="80px"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box 
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />
      
      <Container 
        maxW="7xl" 
        position="relative" 
        zIndex="1"
        px={{ base: 4, lg: 8 }}
        py={0}
      >
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          style={{ width: '100%' }}
        >
          <Grid 
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }} 
            gap={{ base: 10, lg: 20 }}
            alignItems="center"
            width="100%"
            my={{ base: 16, md: 20, lg: 24 }}
          >
            <Box>
              <motion.div variants={itemVariants}>
                <Stack spacing={{ base: 8, md: 10 }}>
                  <Box
                    bg={useColorModeValue('whiteAlpha.900', 'whiteAlpha.100')}
                    backdropFilter="blur(10px)"
                    rounded="full"
                    px={5}
                    py={3}
                    width="fit-content"
                    boxShadow="lg"
                    border="1px solid"
                    borderColor={useColorModeValue('orange.100', 'whiteAlpha.200')}
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      bgGradient={colors.orange.gradient}
                      bgClip="text"
                    >
                      ✨ Introducing KeyReach CRM
                    </Text>
                  </Box>

                  <Heading
                    as={motion.h1}
                    variants={itemVariants}
                    fontSize={{ base: '5xl', sm: '6xl', md: '7xl' }}
                    letterSpacing="tight"
                    lineHeight={{ base: '1.1', md: '1' }}
                    color={textColor}
                  >
                    <Box display="block" mb={{ base: 3, md: 5 }}>
                      Transform Your
                    </Box>
                    <Box display="block">
                      <Text 
                        as="span" 
                        bgGradient={colors.orange.gradient}
                        bgClip="text"
                        position="relative"
                        _after={{
                          content: '""',
                          position: 'absolute',
                          bottom: '5px',
                          left: 0,
                          width: 'full',
                          height: '5px',
                          bgGradient: colors.orange.gradient,
                          borderRadius: 'full',
                          opacity: 0.3
                        }}
                      >
                        Real Estate
                      </Text>{' '}
                      Business
                    </Box>
                  </Heading>

                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    color={subTextColor}
                    maxW="700px"
                    lineHeight="tall"
                  >
                    Streamline your real estate operations with our powerful CRM platform. 
                    Manage leads, properties, and team collaboration all in one place.
                  </Text>

                  <Stack 
                    direction={{ base: 'column', sm: 'row' }}
                    spacing={{ base: 5, sm: 8 }}
                  >
                    // Replace the StartTrial component with a direct signup button
<Button
  as={Link}
  href="/auth/signup?plan=Basic" // Add plan parameter for proper flow
  size="lg"
  px={10}
  h={16}
  fontSize="lg"
  rightIcon={<ArrowForwardIcon boxSize={5} />}
  bgGradient={colors.orange.gradient}
  color="white"
  rounded="2xl"
  _hover={{
    transform: 'translateY(-2px)',
    shadow: '2xl'
  }}
  transition="all 0.2s"
>
  Get Started Now
</Button>



                    <Button
                      as={Link}
                      href="/demo"
                      size="lg"
                      px={10}
                      h={16}
                      fontSize="lg"
                      variant="ghost"
                      color={textColor}
                      rounded="2xl"
                      borderWidth={2}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>

                  <Text
                    fontSize="sm"
                    color={subTextColor}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={CheckIcon} color="green.500" />
                    No credit card required for trial
                  </Text>
                </Stack>
              </motion.div>
            </Box>

            <Box position="relative">
              <motion.div
                variants={imageVariants}
                animate={floatingAnimation}
                whileHover={{ scale: 1.02 }}
              >
                <Box
                  position="relative"
                  rounded="3xl"
                  overflow="hidden"
                  boxShadow="2xl"
                  transform="perspective(1000px) rotateY(-5deg)"
                  transition="all 0.4s ease-out"
                  _hover={{
                    transform: "perspective(1000px) rotateY(0deg)"
                  }}
                >
                  <Image
                    src="/images/hero-dashboard.jpg"
                    alt="Dashboard Preview"
                    width={1472}
                    height={832}
                    priority
                    className="rounded-3xl"
                  />
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Hero
