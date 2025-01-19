'use client'

import { Box, Container, Stack, Heading, Text, Icon, useColorModeValue, Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { MdOutlineIntegrationInstructions } from 'react-icons/md'

const IntegrationCard = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('gray.800', 'white')

  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <Container maxW="7xl" py={20}>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={{ base: 8, lg: 20 }}
        align="center"
      >
        <Box
          as={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          width={{ base: '100%', lg: '60%' }}
          bg={cardBg}
          p={8}
          rounded="2xl"
          shadow="xl"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-20px"
            right="-20px"
            bg="blue.500"
            w="100px"
            h="100px"
            rounded="full"
            opacity={0.1}
          />
          <Stack spacing={6}>
            <Stack direction="row" align="center" spacing={4}>
              <Icon
                as={MdOutlineIntegrationInstructions}
                w={10}
                h={10}
                color="blue.400"
              />
              <Heading
                size="lg"
                color={headingColor}
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                Third-Party Integrations
              </Heading>
            </Stack>
            <Text fontSize="lg" color={textColor} lineHeight="tall">
              Expand the capabilities of KeyReach CRM with seamless integrations to your favorite third-party apps and services. Whether you need to connect with Zapier for automating workflows or social media platforms like Facebook, Instagram, and LinkedIn, our platform allows for easy integration with the tools you already use.
            </Text>
            <Text fontSize="lg" color={textColor} lineHeight="tall">
              Automate lead management, property updates, and client communications to save time and improve efficiency. Integrate with your marketing tools to run targeted campaigns or sync your CRM data with other platforms, ensuring a smooth and connected workflow across your business.
            </Text>
          </Stack>
        </Box>

        <Box
          as={motion.div}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={imageAnimation}
          width={{ base: '100%', lg: '40%' }}
          height="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/images/features/integration-feature.jpg"
            alt="Integration Features"
            width="100%"
            height="100%"
            objectFit="contain"
            quality={100}
            loading="eager"
            style={{ 
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
              transform: 'perspective(1000px) rotateY(-5deg)',
              transition: 'transform 0.3s ease-in-out'
            }}
          />
        </Box>
      </Stack>
    </Container>
  )
}

export default IntegrationCard
