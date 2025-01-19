'use client'

import { Box, Container, Heading, Text, Stack, Icon, SimpleGrid, useColorModeValue, Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaUserTie, FaPiggyBank, FaTools, FaChartLine } from 'react-icons/fa'

const FeatureCard = ({ icon, title, text }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  
  return (
    <Box
      as={motion.div}
      whileHover={{ y: -5 }}
      p={6}
      bg={cardBg}
      rounded="xl"
      shadow="lg"
      transition="0.3s ease"
    >
      <Icon as={icon} w={10} h={10} mb={4} color="blue.400" />
      <Heading size="md" mb={4}>{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Box>
  )
}

const AboutPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'white')

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Box pt={{ base: 24, md: 32 }}>
      <Container maxW="7xl" py={20}>
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
              <Heading 
                size="2xl" 
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                About Us
              </Heading>
              <Text fontSize="xl" color={textColor}>
                At KeyReach CRM, we understand the challenges real estate professionals face. Our journey began with a simple yet powerful idea—help real estate agents connect with leads and grow their businesses without breaking the bank.
              </Text>
            </Stack>
            <Box 
              flex="1"
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              maxW={{ base: "300px", lg: "400px" }}
              mx="auto"
            >
              <Image
                src="/images/about/about-hero.jpg"
                alt="About KeyReach"
                rounded="2xl"
                shadow="2xl"
                width="100%"
                height="auto"
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
            <Heading size="xl" color={headingColor}>Our Story</Heading>
            <Text fontSize="lg" color={textColor}>
              Our founder, Odney Joseph, is a licensed real estate agent who first entered the industry in 2016. Like many new agents, Odney quickly realized how difficult it was to generate leads and manage them effectively. The available tools were either too expensive, overly complicated, or failed to deliver results. Frustrated by the lack of affordable, practical solutions, Odney decided to take matters into his own hands.
            </Text>
            <Text fontSize="lg" color={textColor}>
              With his firsthand experience, Odney set out to create a platform designed specifically for real estate professionals. He envisioned a system that would simplify lead management, streamline property listings, and provide integrated tools for social media advertising—all at a fair price. After years of research, collaboration, and development, KeyReach CRM was born.
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
            <Heading size="xl" color={headingColor}>Our Mission</Heading>
            <Text fontSize="lg" color={textColor}>
              At KeyReach CRM, our mission is simple: To empower real estate agents with the tools they need to succeed, without the need for expensive advertising teams or complex software.
            </Text>
            <Text fontSize="lg" color={textColor}>
              We believe every real estate professional deserves access to powerful, user-friendly tools that can help them thrive in a competitive market. That's why we offer a comprehensive platform that combines lead management, property tracking, social media advertising, communication tools, and analytics—all in one place.
            </Text>
          </Stack>

          <Stack spacing={8}>
            <Heading size="xl" color={headingColor}>Why Choose Us?</Heading>
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
            <Heading size="xl" color={headingColor}>Our Vision</Heading>
            <Text fontSize="lg" color={textColor}>
              We aim to become the go-to platform for real estate professionals worldwide, transforming how agents connect with leads, market properties, and grow their businesses. With KeyReach CRM, your success is our success.
            </Text>
            <Heading size="xl" color={headingColor} pt={8}>Join Us on the Journey</Heading>
            <Text fontSize="lg" color={textColor}>
              Whether you're just starting out or a seasoned agent, KeyReach CRM is here to help you achieve your goals. Our platform is built on years of industry experience and a deep understanding of the challenges you face. Together, we'll take your real estate business to new heights.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default AboutPage
