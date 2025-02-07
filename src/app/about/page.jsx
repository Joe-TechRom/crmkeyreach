'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUserTie, FaPiggyBank, FaTools, FaChartLine } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { keyframes } from '@emotion/react';

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

const FeatureCard = ({ icon, title, text }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      as={motion.div}
      whileHover={{ y: -5, boxShadow: 'xl' }}
      transition="0.3s ease"
      p={6}
      bg={cardBg}
      rounded="xl"
      shadow="md"
      borderTop="4px solid"
      borderColor="orange.500"
    >
      <Icon as={icon} w={10} h={10} mb={4} color="orange.500" />
      <Heading
        size="md"
        mb={4}
        bgGradient="linear(to-r, orange.400, orange.600)"
        bgClip="text"
        animation={`${textShimmer} 3s ease infinite`}
        bgSize="200% auto"
      >
        {title}
      </Heading>
      <Text color={textColor}>{text}</Text>
    </Box>
  );
};

const AboutPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Box pt={{ base: 24, md: 32 }} position="relative" overflow="hidden" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box
        position="absolute"
        inset="0"
        zIndex="0"
        style={{ background: gradientBg }}
        filter="blur(120px)"
        opacity="0.6"
        transform="scale(1.2)"
      />
      <Container maxW="7xl" py={20} position="relative" zIndex={1}>
        <Stack spacing={16}>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={12}
            align="center"
            as={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <Stack spacing={6} flex="1.5">
              <Heading size="2xl">
                <TypeAnimation
                  sequence={['About Us', 1000]}
                  wrapper="span"
                  cursor={false}
                  repeat={0}
                  style={{
                    background: `linear-gradient(-45deg, ${colors.orange.main}, ${colors.orange.light}, #FF8F6B, #FFB088)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '300% 300%',
                    animation: `${textShimmer} 5s ease infinite`,
                    fontWeight: '800',
                    fontSize: '3rem',
                  }}
                />
              </Heading>
              <Text fontSize="xl" color={textColor}>
                At KeyReach CRM, we understand the challenges real estate professionals face. Our journey began with a simple yet
                powerful idea—help real estate agents connect with leads and grow their businesses without breaking the bank.
              </Text>
            </Stack>
            <Box
              flex="1"
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              maxW={{ base: '300px', lg: '400px' }}
              mx="auto"
            >
              <Image
                src="/images/about/about-hero.jpg"
                alt="About KeyReach"
                rounded="2xl"
                shadow="2xl"
                width="100%"
                height="auto"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Stack>

          <Stack
            spacing={6}
            as={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heading size="xl" color={headingColor}>
              Our Founder: Odney Joseph
            </Heading>
            <Text fontSize="lg" color={textColor}>
              KeyReach CRM was born from the vision of Odney Joseph, a highly successful CEO, real estate agent, restaurant owner,
              and entrepreneur. Born on January 28, Odney's journey to the top of the business world began in his early
              years, as he developed a passion for innovation, hard work, and determination.
            </Text>
            <Text fontSize="lg" color={textColor}>
              As a CEO, Odney has a proven ability to lead and inspire his team, making strategic decisions that drive growth and
              success. His extensive knowledge of the real estate industry, combined with exceptional communication and negotiation
              skills, has made him a trusted advisor to many clients. Beyond real estate, Odney's passion for creating unforgettable
              dining experiences is evident in his restaurants, known for delicious food, stylish ambiance, and exceptional service.
            </Text>
            <Text fontSize="lg" color={textColor}>
              Odney's entrepreneurial spirit drives him to constantly seek new opportunities, develop innovative products, and expand
              into new markets. Frustrated by the lack of affordable and practical CRM solutions for real estate professionals, he
              set out to create KeyReach CRM – a platform designed to simplify lead management, streamline property listings, and
              provide integrated tools for social media advertising, all at a fair price.
            </Text>
          </Stack>

          <Stack
            spacing={6}
            as={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Heading size="xl" color={headingColor}>
              Our Mission
            </Heading>
            <Text fontSize="lg" color={textColor}>
              At KeyReach CRM, our mission is simple: To empower real estate agents with the tools they need to succeed, without the
              need for expensive advertising teams or complex software.
            </Text>
            <Text fontSize="lg" color={textColor}>
              We believe every real estate professional deserves access to powerful, user-friendly tools that can help them thrive in a
              competitive market. That's why we offer a comprehensive platform that combines lead management, property tracking,
              social media advertising, communication tools, and analytics—all in one place.
            </Text>
          </Stack>

          <Stack spacing={8}>
            <Heading
              size="xl"
              color={headingColor}
              bgGradient="linear(to-r, orange.400, orange.600)"
              bgClip="text"
              animation={`${textShimmer} 3s ease infinite`}
              bgSize="200% auto"
              textAlign="center"
            >
              Why Choose Us?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FeatureCard
                icon={FaUserTie}
                title="Built by a Real Estate Agent"
                text="Odney Joseph's personal experience ensures our tools are practical and effective."
              />
              <FeatureCard
                icon={FaPiggyBank}
                title="Affordable & Transparent"
                text="Top-tier features at a price that works for agents at every stage."
              />
              <FeatureCard
                icon={FaTools}
                title="All-in-One Solution"
                text="From lead tracking to social media integration, everything in one place."
              />
              <FeatureCard
                icon={FaChartLine}
                title="Designed for Success"
                text="Easy-to-use tools focused on closing deals and building relationships."
              />
            </SimpleGrid>
          </Stack>

          <Stack
            spacing={6}
            as={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Heading size="xl" color={headingColor}>
              Our Vision
            </Heading>
            <Text fontSize="lg" color={textColor}>
              We aim to become the go-to platform for real estate professionals worldwide, transforming how agents connect with leads,
              market properties, and grow their businesses. With KeyReach CRM, your success is our success.
            </Text>
            <Heading size="xl" color={headingColor} pt={8}>
              Join Us on the Journey
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Whether you're just starting out or a seasoned agent, KeyReach CRM is here to help you achieve your goals. Our
              platform is built on years of industry experience and a deep understanding of the challenges you face. Together, we'll
              take your real estate business to new heights.
            </Text>
          </Stack>

          <Stack spacing={8}>
            <Heading size="xl" color={headingColor}>
              Learn More About KeyReach CRM
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem border="none" mb={4}>
                <AccordionButton
                  p={6}
                  bg={useColorModeValue('white', 'whiteAlpha.50')}
                  rounded="xl"
                  _hover={{ bg: useColorModeValue('blue.50', 'whiteAlpha.100') }}
                  transition="all 0.3s"
                >
                  <Stack direction="row" align="center" flex="1">
                    <Heading size="md" color={headingColor}>
                      What makes KeyReach CRM different?
                    </Heading>
                  </Stack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} px={6} color={textColor}>
                  KeyReach CRM is built by real estate professionals, for real estate professionals. We understand the unique challenges
                  you face and have designed our platform to be intuitive, affordable, and effective.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={4}>
                <AccordionButton
                  p={6}
                  bg={useColorModeValue('white', 'whiteAlpha.50')}
                  rounded="xl"
                  _hover={{ bg: useColorModeValue('blue.50', 'whiteAlpha.100') }}
                  transition="all 0.3s"
                >
                  <Stack direction="row" align="center" flex="1">
                    <Heading size="md" color={headingColor}>
                      How can KeyReach CRM help me grow my business?
                    </Heading>
                  </Stack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} px={6} color={textColor}>
                  KeyReach CRM provides you with the tools you need to manage leads, track properties, automate social media
                  marketing, and communicate effectively with your clients. By streamlining your operations, you can focus on what
                  matters most: building relationships and closing deals.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none" mb={4}>
                <AccordionButton
                  p={6}
                  bg={useColorModeValue('white', 'whiteAlpha.50')}
                  rounded="xl"
                  _hover={{ bg: useColorModeValue('blue.50', 'whiteAlpha.100') }}
                  transition="all 0.3s"
                >
                  <Stack direction="row" align="center" flex="1">
                    <Heading size="md" color={headingColor}>
                      Is KeyReach CRM right for me?
                    </Heading>
                  </Stack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} px={6} color={textColor}>
                  Whether you're a new agent just starting out or a seasoned professional looking to take your business to the next
                  level, KeyReach CRM can help you achieve your goals. Our platform is designed to be scalable and customizable, so
                  you can tailor it to your specific needs.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutPage;
