'use client';

import { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
  Button,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaDatabase, FaShareAlt, FaFileSignature, FaBolt } from 'react-icons/fa';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation

const shimmer = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const textShimmer = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-20px) }
  100% { transform: translateY(0px) }
`;

const MotionBox = motion(Box);

const IntegrationCard = ({ icon, title, description, image }) => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900');
  const borderColor = useColorModeValue('rgba(255, 107, 44, 0.1)', 'rgba(255, 154, 92, 0.1)');

  return (
    <MotionBox
      whileHover={{ y: -10, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ userSelect: 'text' }}
    >
      <Box
        bg={cardBg}
        p={8}
        rounded="2xl"
        position="relative"
        overflow="hidden"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgGradient: 'linear(to-r, #FF6B2C, #FF9A5C)',
          animation: `${shimmer} 2s linear infinite`,
          backgroundSize: '200% auto',
        }}
      >
        <VStack spacing={6} align="flex-start">
          <Icon
            as={icon}
            w={12}
            h={12}
            bgGradient="linear(45deg, #FF6B2C, #FF9A5C)"
            color="white"
            p={2.5}
            rounded="xl"
            _hover={{
              bgGradient: 'linear(45deg, #FF9A5C, #FF6B2C)',
              transform: 'rotate(5deg)',
            }}
            transition="all 0.3s ease"
          />

          <Heading
            size="lg"
            bgGradient={useColorModeValue(
              'linear(to-r, #FF6B2C, #231745, #FF9A5C)',
              'linear(to-r, #FF6B2C, #4923B4, #FF9A5C)'
            )}
            bgClip="text"
            bgSize="200% auto"
            animation={`${textShimmer} 3s ease infinite`}
          >
            {title}
          </Heading>

          <Text color={textColor} fontSize="lg">
            {description}
          </Text>

          {image && (
            <MotionBox
              whileHover={{ scale: 1.05 }}
              width="100%"
              height="250px"
              position="relative"
              rounded="xl"
              overflow="hidden"
              mt={4}
              boxShadow="2xl"
            >
              <Image
                src={image}
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-all duration-300"
              />
            </MotionBox>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
};

const IntegrationsPage = () => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const colors = {
    orange: {
      light: '#FF9A5C',
      main: '#FF6B2C',
      gradient: 'linear-gradient(135deg, #FF6B2C 0%, #FF9A5C 100%)',
    },
  };

  const gradientBg = `
    radial-gradient(circle at 0% 0%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, ${colors.orange.main}10 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, ${colors.orange.light}15 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, ${colors.orange.main}10 0%, transparent 50%)
  `;

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('neutral.800', 'whiteAlpha.900');

  return (
    <Box bg={bgColor} minH="100vh" pt={28} position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={8} textAlign="center" mt={20}>
          <TypeAnimation
            sequence={[
              'Connect to Powerful Real Estate Integrations',
              1000,
              'Unlock Seamless Real Estate Workflows',
              1000,
              'Supercharge Your Real Estate Business',
              1000,
            ]}
            wrapper="h1"
            cursor={true}
            repeat={Infinity}
            style={{
              fontSize: '4rem',
              fontWeight: '800',
              lineHeight: '1.2',
              background: `linear-gradient(-45deg, ${colors.orange.main}, ${colors.orange.light}, #FF8F6B, #FFB088)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '300% 300%',
              animation: `${textShimmer} 5s ease infinite`,
            }}
          />
          <Text fontSize="xl" maxW="2xl" mx="auto" color={textColor}>
            Connect KeyReach CRM with your favorite tools and platforms to streamline your operations and boost
            productivity.
          </Text>
        </VStack>
      </Container>
      <Container maxW="7xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} px={{ base: 4, md: 0 }}>
          <IntegrationCard
            icon={FaDatabase}
            title="IDX Integration"
            description="Connect directly with MLS databases to display real-time property listings, provide advanced search options, and automate property alerts."
            image="/images/idx-integration.jpg"
          />

          <IntegrationCard
            icon={FaShareAlt}
            title="Social Media Integration"
            description="Seamlessly manage your social media presence across Facebook, Instagram, LinkedIn, and Google Ads directly from KeyReach CRM."
            image="/images/social-integration.jpg"
          />

          <IntegrationCard
            icon={FaFileSignature}
            title="PDF Signing Integration"
            description="Streamline document workflows with integrated e-signature capabilities, tracking, and secure digital archiving."
            image="/images/pdf-signing.jpg"
          />

          <IntegrationCard
            icon={FaBolt}
            title="Zapier Integration"
            description="Connect with thousands of apps to automate tasks, sync data, and streamline your workflow effortlessly."
            image="/images/zapier-integration.jpg"
          />
        </SimpleGrid>
           </Container>
      <Box
        py={20}
        position="relative"
        overflow="hidden"
        bg={useColorModeValue('gray.50', 'gray.900')} // Apply background color
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
        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack spacing={16}>
            <Heading
              textAlign="center"
              size="xl"
              bgGradient={useColorModeValue(
                'linear(to-r, #FF6B2C, #231745, #FF9A5C)',
                'linear(to-r, #FF6B2C, #4923B4, #FF9A5C)'
              )}
              bgClip="text"
              animation={`${textShimmer} 3s ease infinite`}
              bgSize="200% auto"
            >
              Why Integrate with KeyReach CRM?
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} px={{ base: 4, md: 0 }}>
              {[
                {
                  icon: '⚡️',
                  title: 'Save Time',
                  description: 'Automate routine processes and eliminate manual data entry',
                },
                {
                  icon: '🎯',
                  title: 'Enhanced Experience',
                  description: 'Deliver personalized and efficient services to clients',
                },
                {
                  icon: '📊',
                  title: 'Stay Organized',
                  description: 'Consolidate tools and workflows into one platform',
                },
                {
                  icon: '🚀',
                  title: 'Boost Productivity',
                  description: 'Get real-time updates and streamlined operations',
                },
              ].map((benefit, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <VStack
                    bg={useColorModeValue('white', 'gray.700')}
                    p={8}
                    rounded="2xl"
                    height="full"
                    textAlign="center"
                    spacing={4}
                    position="relative"
                    overflow="hidden"
                    boxShadow="lg"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: '2xl',
                      borderColor: '#FF6B2C',
                    }}
                    transition="all 0.3s"
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor={useColorModeValue('rgba(255,107,44,0.1)', 'whiteAlpha.100')}
                  >
                    <Text fontSize="4xl">{benefit.icon}</Text>
                    <Heading
                      size="md"
                      bgGradient={useColorModeValue(
                        'linear(to-r, #FF6B2C, #231745, #FF9A5C)',
                        'linear(to-r, #FF6B2C, #4923B4, #FF9A5C)'
                      )}
                      bgClip="text"
                      animation={`${textShimmer} 3s ease infinite`}
                      bgSize="200% auto"
                    >
                      {benefit.title}
                    </Heading>
                    <Text color={textColor}>{benefit.description}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
            <Box
              w="full"
              bgGradient={useColorModeValue(
                'linear(to-br, rgba(255,107,44,0.05), rgba(255,154,92,0.05))',
                'linear(to-br, gray.800, gray.900)'
              )}
              rounded="3xl"
              overflow="hidden"
              shadow="2xl"
              position="relative"
              borderWidth="1px"
              borderColor={useColorModeValue('rgba(255,107,44,0.1)', 'gray.700')}
            >
              <MotionBox
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <VStack spacing={8} p={16} textAlign="center" position="relative">
                  <Heading
                    size="xl"
                    bgGradient={useColorModeValue(
                      'linear(to-r, #FF6B2C, #231745, #FF9A5C)',
                      'linear(to-r, #FF6B2C, #4923B4, #FF9A5C)'
                    )}
                    bgClip="text"
                    animation={`${textShimmer} 3s ease infinite`}
                    bgSize="200% auto"
                  >
                    Transform Your Real Estate Business Today
                  </Heading>
                  <Text fontSize="lg" maxW="2xl" color={textColor}>
                    Contact us to learn how KeyReach CRM integrations can streamline your operations and boost your
                    success.
                  </Text>

                  <Box position="relative" zIndex={10}>
                    <Button
                      onClick={() => (window.location.href = '/pricing')}
                      size="lg"
                      bgGradient="linear(to-r, #FF6B2C, #FF9A5C)"
                      color="white"
                      _hover={{
                        bgGradient: 'linear(to-r, #FF9A5C, #FF6B2C)',
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                      }}
                      px={12}
                      py={7}
                      rounded="xl"
                      fontSize="lg"
                      fontWeight="bold"
                      transition="all 0.3s"
                      cursor="pointer"
                      position="relative"
                      pointerEvents="auto"
                    >
                      Get Started
                    </Button>
                  </Box>
                </VStack>
              </MotionBox>
            </Box>
          </VStack>
        </Container>
      </Box>

    </Box>
  );
};

export default IntegrationsPage;
