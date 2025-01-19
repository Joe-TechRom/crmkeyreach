'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Flex,
  AspectRatio,
  useColorModeValue,
  Image,
  Icon,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { keyframes } from '@emotion/react'
import { FaPlay } from 'react-icons/fa'
import { BsLightningChargeFill } from 'react-icons/bs'



const MotionFlex = motion(Flex)
const MotionStack = motion(Stack)
const MotionBox = motion(Box)

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const glow = keyframes`
  0% { box-shadow: 0 0 5px #4299E1; }
  50% { box-shadow: 0 0 20px #4299E1; }
  100% { box-shadow: 0 0 5px #4299E1; }
`

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const textColor = useColorModeValue('gray.700', 'gray.200')
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.200, purple.300)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const shadowColor = useColorModeValue(
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  )

  return (
    <Container maxW="7xl" py={20}>
      <MotionFlex 
        direction={{ base: 'column', lg: 'row' }} 
        align="center" 
        gap={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Content */}
        <MotionStack 
          flex={1} 
          spacing={8}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              as={BsLightningChargeFill}
              w={8}
              h={8}
              color="blue.400"
              mb={4}
              animation={`${float} 3s ease-in-out infinite`}
            />
            <Heading 
              size="2xl" 
              bgGradient={bgGradient}
              bgClip="text"
              mb={4}
              lineHeight="1.2"
            >
              Revolutionize your real estate business
            </Heading>
            <Text fontSize="xl" color={textColor} mb={6}>
              Tools built for success! Manage leads, track properties, and advertise effortlessly—all in one powerful platform.
            </Text>
          </MotionBox>

          <Stack spacing={4}>
            {features.map((feature, index) => (
              <MotionBox
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 10, scale: 1.01 }}
              >
                <Text 
                  fontSize="lg" 
                  display="flex" 
                  alignItems="center"
                  color={textColor}
                >
                  <Text 
                    as="span" 
                    mr={2} 
                    color={useColorModeValue('blue.400', 'blue.200')}
                  >
                    ✨
                  </Text>
                  {feature}
                </Text>
              </MotionBox>
            ))}
          </Stack>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Text 
              fontSize="lg" 
              fontWeight="medium" 
              color={textColor}
            >
              Want to see it in action? Watch the video and learn how KeyReach CRM can help you grow your business.
            </Text>
          </MotionBox>
        </MotionStack>

        {/* Video Player Section */}
        <MotionBox
          flex={1}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Box
            rounded="3xl"
            overflow="hidden"
            boxShadow={shadowColor}
            bg={cardBg}
            position="relative"
            p={1}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: 'xl'
            }}
          >
            <Box
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              bg="gray.900"
            >
              <AspectRatio ratio={16 / 9}>
                <Box>
                  {isPlaying ? (
                    <video
                      autoPlay
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    >
                      <source src="/videos/demo.mp4" type="video/mp4" />
                    </video>
                  ) : (
                    <Box position="relative">
                      <Image
                        src="/images/thumbnail.jpg"
                        alt="Video Thumbnail"
                        objectFit="cover"
                        w="full"
                        h="full"
                        filter={isHovered ? "brightness(0.6)" : "brightness(0.8)"}
                        transition="all 0.3s ease"
                      />
                      <MotionBox
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(true)}
                        cursor="pointer"
                        animation={isHovered ? `${glow} 2s infinite` : 'none'}
                      >
                        <Box
                          w="80px"
                          h="80px"
                          borderRadius="full"
                          bg="rgba(255, 255, 255, 0.2)"
                          backdropFilter="blur(10px)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="2px solid white"
                          transition="all 0.2s"
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.3)",
                            transform: "scale(1.05)"
                          }}
                        >
                          <Box
                            as={FaPlay}
                            color="white"
                            fontSize="24px"
                            ml={2}
                          />
                        </Box>
                      </MotionBox>
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        p={6}
                        background="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                      >
                        <Text color="white" fontSize="lg" fontWeight="bold">
                          KeyReach CRM Demo
                        </Text>
                        <Text color="whiteAlpha.800" fontSize="sm">
                          2:45 minutes
                        </Text>
                      </Box>
                    </Box>
                  )}
                </Box>
              </AspectRatio>
            </Box>
          </Box>
        </MotionBox>
      </MotionFlex>
    </Container>
  )
}

const features = [
  "Simplified Lead Management",
  "Seamless Property Listings",
  "One-Click Social Media Ads",
  "Advanced Analytics for Smarter Decisions",
  "Secure Cloud Sync for Anytime Access"
]
