'use client'

import { useState, useContext } from 'react' // Import useContext
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Button,
  useColorModeValue,
  VStack,
  Flex,
  Icon,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Progress,
  Center,
  Spacer,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  FaLaptopCode,
  FaPalette,
  FaChartLine,
  FaHeadset,
  FaChartBar,
} from 'react-icons/fa'

const departments = [
  {
    name: 'Engineering',
    icon: FaLaptopCode,
    roles: [
      {
        title: 'Software Developer',
        type: 'Full-time',
        location: 'Remote',
        description:
          "We're looking for an experienced software developer to join our dynamic team. This role involves building and maintaining our CRM platform tailored for real estate professionals.",
        responsibilities: [
          'Develop, test, and deploy new features for the CRM',
          'Troubleshoot and fix software bugs',
          'Optimize system performance and scalability',
          'Collaborate with UI/UX designers',
          'Implement third-party integrations',
        ],
        qualifications: [
          'Proficiency in Java, Kotlin, or Flutter',
          'Experience with APIs and databases',
          'Knowledge of cloud technologies',
          'Strong problem-solving skills',
        ],
      },
      {
        title: 'Cybersecurity Specialist',
        type: 'Full-time',
        location: 'Remote',
        description:
          'Protect KeyReach CRM and its users by ensuring robust cybersecurity measures are in place. This role is critical for safeguarding sensitive client data and preventing breaches.',
        responsibilities: [
          'Monitor system vulnerabilities',
          'Implement security protocols',
          'Conduct security audits',
          'Implement advanced encryption',
          'Conduct risk assessments',
        ],
        qualifications: [
          'Expertise in cybersecurity',
          'Knowledge of privacy laws',
          'Experience with firewalls',
          'Experience with intrusion detection systems',
        ],
      },
    ],
  },
  {
    name: 'Design & User Experience',
    icon: FaPalette,
    roles: [
      {
        title: 'UI/UX Designer',
        type: 'Full-time',
        location: 'Remote',
        description:
          "As a UI/UX Designer, you'll play a key role in shaping the look and feel of KeyReach CRM. You'll focus on creating intuitive, visually appealing interfaces.",
        responsibilities: [
          'Design user-friendly layouts',
          'Develop wireframes and prototypes',
          'Conduct user research',
          'Create interactive elements',
          'Collaborate with development team',
        ],
        qualifications: [
          'Experience with Adobe XD, Sketch, or Figma',
          'Strong portfolio of modern designs',
          'Understanding of UX principles',
          'Excellent collaboration skills',
        ],
      },
    ],
  },
  {
    name: 'Sales & Marketing',
    icon: FaChartLine,
    roles: [
      {
        title: 'Sales Representative',
        type: 'Full-time',
        location: 'Remote',
        description:
          "We're seeking motivated sales representatives to grow our customer base. You'll introduce KeyReach CRM to real estate professionals nationwide.",
        responsibilities: [
          'Generate leads through outbound activities',
          'Present KeyReach CRM features',
          'Close deals and manage relationships',
          'Meet monthly sales targets',
          'Provide product demonstrations',
        ],
        qualifications: [
          'Proven B2B sales experience',
          'Excellent communication skills',
          'Real estate industry knowledge',
          'Strong negotiation abilities',
        ],
      },
      {
        title: 'Marketing Specialist',
        type: 'Full-time',
        location: 'Remote',
        description:
          'Drive awareness and adoption of KeyReach CRM through creative marketing strategies and compelling campaigns.',
        responsibilities: [
          'Develop marketing strategies',
          'Create engaging content',
          'Monitor campaign performance',
          'Manage social media presence',
          'Analyze marketing metrics',
        ],
        qualifications: [
          'Digital marketing experience',
          'Social media expertise',
          'Data analysis skills',
          'Content creation abilities',
        ],
      },
    ],
  },
  {
    name: 'Customer Success',
    icon: FaHeadset,
    roles: [
      {
        title: 'Customer Support Agent',
        type: 'Full-time',
        location: 'Remote',
        description:
          'Join our customer support team to assist users in maximizing their experience with KeyReach CRM.',
        responsibilities: [
          'Respond to customer inquiries',
          'Troubleshoot user issues',
          'Provide platform guidance',
          'Create support documentation',
          'Collect user feedback',
        ],
        qualifications: [
          'Customer service experience',
          'Problem-solving skills',
          'CRM tool familiarity',
          'Excellent communication',
        ],
      },
      {
        title: 'Training Specialist',
        type: 'Full-time',
        location: 'Remote',
        description:
          'Help new users get started with KeyReach CRM by creating engaging training materials and conducting sessions.',
        responsibilities: [
          'Create training materials',
          'Conduct live sessions',
          'Develop onboarding guides',
          'Track training effectiveness',
          'Gather feedback',
        ],
        qualifications: [
          'Training experience',
          'Presentation skills',
          'CRM knowledge',
          'Educational background',
        ],
      },
    ],
  },
  {
    name: 'Data & Analytics',
    icon: FaChartBar,
    roles: [
      {
        title: 'Data Analyst',
        type: 'Full-time',
        location: 'Remote',
        description:
          'Provide insights into sales performance, lead conversion, and advertising ROI to guide business decisions.',
        responsibilities: [
          'Analyze user data patterns',
          'Generate performance reports',
          'Develop real-time dashboards',
          'Identify trends',
          'Make recommendations',
        ],
        qualifications: [
          'Data analysis expertise',
          'Tool proficiency (Excel, Tableau)',
          'Statistical knowledge',
          'Business acumen',
        ],
      },
    ],
  },
]

const JobCard = ({ role, onOpen, setSelectedRole }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const headingColor = useColorModeValue('gray.900', 'white')

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
      <Box
        p={6}
        bg={cardBg}
        rounded="xl"
        shadow="lg"
        cursor="pointer"
        onClick={() => {
          setSelectedRole(role)
          onOpen()
        }}
        h="100%"
      >
        <VStack align="start" spacing={4} w="full" h="100%">
          <Heading size="md" fontWeight="semibold" color={headingColor} textAlign="left">
            {role.title}
          </Heading>
          <Flex gap={2} w="full" justifyContent="start">
            <Badge colorScheme="green">{role.type}</Badge>
            <Badge colorScheme="purple">{role.location}</Badge>
          </Flex>
          <Text noOfLines={3} color={textColor} textAlign="left">
            {role.description}
          </Text>
          <Spacer />
          <Button colorScheme="blue" size="sm" mt="auto">
            Learn More
          </Button>
        </VStack>
      </Box>
    </motion.div>
  )
}

const JobApplication = ({ role }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    gender: '',
    race: '',
    linkedin: '',
    github: '',
    portfolio: '',
    resume: null,
    coverLetter: null,
  })

  const formFields = {
    personalInfo: {
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'tel', label: 'Phone Number', required: true },
      address: { type: 'text', label: 'Address', required: true },
      city: { type: 'text', label: 'City', required: true },
      state: { type: 'text', label: 'State', required: true },
      zipCode: { type: 'text', label: 'ZIP Code', required: true },
    },
    demographics: {
      gender: {
        type: 'select',
        label: 'Gender',
        options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      },
      race: {
        type: 'select',
        label: 'Race/Ethnicity',
        options: [
          'Asian',
          'Black or African American',
          'Hispanic or Latino',
          'Native American',
          'White',
          'Two or More Races',
          'Prefer not to say',
        ],
      },
    },
    social: {
      linkedin: { type: 'url', label: 'LinkedIn Profile' },
      github: { type: 'url', label: 'GitHub Profile' },
      portfolio: { type: 'url', label: 'Portfolio Website' },
    },
    documents: {
      resume: { type: 'file', label: 'Resume', required: true },
      coverLetter: { type: 'file', label: 'Cover Letter' },
    },
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        )
      case 2:
        return true
      case 3:
        return true
      case 4:
        return formData.resume
      default:
        return false
    }
  }

  return (
    <VStack spacing={8} w="full">
      <Progress value={step * 25} w="full" colorScheme="blue" rounded="xl" />
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <VStack spacing={6} w="full">
            <Heading size="md">Personal Information</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
              {Object.entries(formFields.personalInfo).map(([key, field]) => (
                <FormControl key={key} isRequired={field.required}>
                  <FormLabel>{field.label}</FormLabel>
                  <Input
                    type={field.type}
                    placeholder={field.label}
                    value={formData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </FormControl>
              ))}
            </SimpleGrid>
          </VStack>
        </motion.div>
      )}
      <Flex w="full" justify="space-between" mt={8}>
        {step > 1 && (
          <Button onClick={() => setStep(step - 1)}>Previous</Button>
        )}
        <Button
          colorScheme="blue"
          ml="auto"
          isDisabled={!isStepValid()}
          onClick={() => (step < 4 ? setStep(step + 1) : console.log('Submit', formData))}
        >
          {step === 4 ? 'Submit Application' : 'Next'}
        </Button>
      </Flex>
    </VStack>
  )
}

const JobModal = ({ isOpen, onClose, role }) => {
  const [isApplying, setIsApplying] = useState(false)
  const modalContentBg = useColorModeValue('white', 'gray.700')

  // Move the hook outside the conditional
  const colorModeValue = useColorModeValue('gray.700', 'whiteAlpha.900');

  if (!role) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isApplying ? '4xl' : 'xl'}>
      <ModalOverlay />
      <ModalContent bg={modalContentBg} color={colorModeValue}>
        <ModalHeader textAlign="center">
          {isApplying ? (
            <VStack>
              <Heading size="lg">Apply for {role.title}</Heading>
              <Text color="gray.500">Complete the form below to apply</Text>
            </VStack>
          ) : (
            <>
              <Heading size="lg">{role.title}</Heading>
              <Flex gap={2} mt={2} justify="center">
                <Badge colorScheme="green">{role.type}</Badge>
                <Badge colorScheme="purple">{role.location}</Badge>
              </Flex>
            </>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isApplying ? (
            <JobApplication role={role} />
          ) : (
            <VStack align="start" spacing={6}>
              <Box w="full">
                <Heading size="sm" mb={3} textAlign="left">
                  Description
                </Heading>
                <Text textAlign="left">{role.description}</Text>
              </Box>
              <Divider />
              <Box w="full">
                <Heading size="sm" mb={3} textAlign="left">
                  Responsibilities
                </Heading>
                <VStack align="start" spacing={2} w="full">
                  {role.responsibilities.map((resp, index) => (
                    <Text key={index} textAlign="left">
                      • {resp}
                    </Text>
                  ))}
                </VStack>
              </Box>
              <Divider />
              <Box w="full">
                <Heading size="sm" mb={3} textAlign="left">
                  Qualifications
                </Heading>
                <VStack align="start" spacing={2} w="full">
                  {role.qualifications.map((qual, index) => (
                    <Text key={index} textAlign="left">
                      • {qual}
                    </Text>
                  ))}
                </VStack>
              </Box>
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={() => setIsApplying(true)}
              >
                Apply Now
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const CareersPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedRole, setSelectedRole] = useState(null)
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.800', 'white')

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="7xl">
        <Center>
          <VStack spacing={16} align="stretch" w="full">
            {/* Hero Section */}
            <Box textAlign="center">
              <Heading
                as={motion.h1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight
="extrabold"
                color={headingColor}
                mb={4}
              >
                Join Our Mission
              </Heading>
              <Text
                fontSize={{ base: 'md', lg: 'xl' }}
                color={textColor}
                maxW="3xl"
                mx="auto"
              >
                Help us revolutionize the real estate industry with innovative CRM solutions.
                Work from anywhere, grow your career, and make an impact.
              </Text>
            </Box>

            {/* Department Sections */}
            {departments.map((dept) => (
              <Box key={dept.name} w="full" textAlign="center">
                <Flex align="center" justify="center" mb={8}>
                  <Icon as={dept.icon} fontSize="3xl" color="blue.500" mr={4} />
                  <Heading size="lg" color={headingColor}>
                    {dept.name}
                  </Heading>
                </Flex>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={8}
                  w="full"
                  justifyItems="stretch" // Make grid items take full width
                >
                  {dept.roles.map((role) => (
                    <JobCard
                      key={role.title}
                      role={role}
                      onOpen={onOpen}
                      setSelectedRole={setSelectedRole}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        </Center>
      </Container>

      <JobModal isOpen={isOpen} onClose={onClose} role={selectedRole} />
    </Box>
  )
}

export default CareersPage
