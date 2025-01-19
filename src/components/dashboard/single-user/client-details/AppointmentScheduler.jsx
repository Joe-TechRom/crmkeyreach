'use client'

import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { supabase } from '@/lib/supabaseClient'
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiTag, FiShare2, FiPhone, FiFileText } from 'react-icons/fi'
import { SiGooglecalendar, SiApple } from 'react-icons/si'
import {
  Box, Button, VStack, HStack, Text, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, useDisclosure, Input, FormControl,
  FormLabel, Select, useToast, Container, Heading, Icon,
  Flex, Menu, MenuButton, MenuList, MenuItem, ButtonGroup,
  Textarea
} from '@chakra-ui/react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function AppointmentScheduler({ clientId }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [view, setView] = useState('week')
  const [formData, setFormData] = useState({
    title: '',
    type: 'viewing',
    location: '',
    phone: '',
    notes: ''
  })
  const toast = useToast()

  // Color mode values for consistent theming
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const shadowColor = useColorModeValue('gray.100', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  const calendarTextColor = useColorModeValue('gray.900', 'white')
  const calendarBgColor = useColorModeValue('white', 'gray.800')
  const modalBg = useColorModeValue('white', 'gray.800')
  const inputBg = useColorModeValue('white', 'gray.700')
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  )

  useEffect(() => {
    fetchAppointments()
  }, [clientId])

  const fetchAppointments = async () => {
    if (!clientId) return
    
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('start_time', { ascending: true })

    if (data) {
      setEvents(data.map(apt => ({
        ...apt,
        start: new Date(apt.start_time),
        end: new Date(apt.end_time)
      })))
    }
  }

  const handleSelect = ({ start, end }) => {
    setSelectedDate({ start, end })
    onOpen()
  }

  const handleEventSelect = (event) => {
    setSelectedEvent(event)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddEvent = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create appointments',
        status: 'info',
        duration: 3000
      })
      return
    }

    const newAppointment = {
      client_id: clientId,
      title: formData.title,
      type: formData.type,
      location: formData.location,
      phone: formData.phone,
      notes: formData.notes,
      start_time: selectedDate.start.toISOString(),
      end_time: selectedDate.end.toISOString(),
      user_id: session.user.id
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([newAppointment])
      .select()

    if (data) {
      toast({
        title: 'Success!',
        description: 'Appointment created successfully',
        status: 'success',
        duration: 3000
      })
      fetchAppointments()
      onClose()
      setFormData({
        title: '',
        type: 'viewing',
        location: '',
        phone: '',
        notes: ''
      })
    }
  }

  const handleGoogleSync = () => {
    if (!selectedEvent) return
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedEvent.title)}&dates=${moment(selectedEvent.start).format('YYYYMMDDTHHmmss')}/${moment(selectedEvent.end).format('YYYYMMDDTHHmmss')}&location=${encodeURIComponent(selectedEvent.location)}&details=${encodeURIComponent(`Appointment type: ${selectedEvent.type}`)}`
    window.open(googleUrl, '_blank')
  }

  const handleAppleSync = () => {
    if (!selectedEvent) return
    const icsContent = generateICSFile(selectedEvent)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${selectedEvent.title}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateICSFile = (event) => {
    return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${moment(event.start).format('YYYYMMDDTHHmmss')}\nDTEND:${moment(event.end).format('YYYYMMDDTHHmmss')}\nSUMMARY:${event.title}\nLOCATION:${event.location}\nDESCRIPTION:Appointment type: ${event.type}\nEND:VEVENT\nEND:VCALENDAR`
  }

  const EventComponent = ({ event }) => (
    <Box p={1}>
      <HStack spacing={2}>
        <Text fontSize="sm" isTruncated>{event.title}</Text>
      </HStack>
    </Box>
  )

  const CustomToolbar = ({ onView, onNavigate, label }) => {
    const goToToday = () => {
      onNavigate('TODAY')
    }

    return (
      <HStack justify="space-between" mb={4} p={2}>
        <HStack>
          <Button onClick={() => onNavigate('PREV')}>Back</Button>
          <Button onClick={goToToday}>Today</Button>
          <Button onClick={() => onNavigate('NEXT')}>Next</Button>
        </HStack>
        <Text fontWeight="bold">
          {label}
        </Text>
        <ButtonGroup>
          <Button onClick={() => onView('month')}>Month</Button>
          <Button onClick={() => onView('week')}>Week</Button>
          <Button onClick={() => onView('day')}>Day</Button>
        </ButtonGroup>
      </HStack>
    )
  }
 
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <HStack w="full" justify="space-between">
          <Heading size="lg">Appointment Calendar</Heading>
          <Menu>
            <MenuButton 
              as={Button} 
              leftIcon={<FiShare2 />} 
              colorScheme="blue"
              isDisabled={!selectedEvent}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              {selectedEvent ? 'Sync Selected Event' : 'Select Event to Sync'}
            </MenuButton>
            <MenuList>
              <MenuItem 
                icon={<SiGooglecalendar color="#4285F4" />} 
                onClick={() => selectedEvent && handleGoogleSync(selectedEvent)}
                isDisabled={!selectedEvent}
                _hover={{ bg: 'blue.50' }}
              >
                Google Calendar
              </MenuItem>
              <MenuItem 
                icon={<SiApple color="#000000" />} 
                onClick={() => selectedEvent && handleAppleSync(selectedEvent)}
                isDisabled={!selectedEvent}
                _hover={{ bg: 'gray.50' }}
              >
                Apple Calendar
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

       // Remove the calendarStyles object entirely

// Update the Flex and Calendar components like this:
<Flex
  direction="column"
  w="full"
  bg={bgColor}
  borderRadius="2xl"
  boxShadow="2xl"
  overflow="hidden"
  p={6}
>
<Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ 
    height: 600,
    backgroundColor: calendarBgColor,
    color: textColor,
    '.rbc-toolbar button': {
      color: textColor,
      backgroundColor: useColorModeValue('gray.100', 'gray.700')
    },
    '.rbc-toolbar': {
      marginBottom: '1.5rem',
      color: textColor
    },
    '.rbc-header': {
      padding: '0.75rem',
      backgroundColor: useColorModeValue('gray.50', 'gray.700'),
      color: textColor,
      fontWeight: 'bold',
      borderBottom: `1px solid ${borderColor}`
    },
    '.rbc-event': {
      background: gradientBg,
      color: 'white',
      borderRadius: 'md',
      border: 'none',
      padding: '0.25rem'
    },
    '.rbc-today': {
      backgroundColor: useColorModeValue('blue.50', 'gray.700')
    },
    '.rbc-off-range': {
      color: useColorModeValue('gray.400', 'gray.500')
    },
    '.rbc-date-cell': {
      color: textColor
    },
    '.rbc-time-slot': {
      color: textColor
    },
    '.rbc-day-bg': {
      backgroundColor: calendarBgColor
    },
    '.rbc-time-content': {
      backgroundColor: calendarBgColor,
      borderTop: `1px solid ${borderColor}`
    },
    '.rbc-time-header': {
      backgroundColor: calendarBgColor
    },
    '.rbc-month-view': {
      backgroundColor: calendarBgColor,
    },
    '.rbc-time-view': {
      backgroundColor: calendarBgColor,
    },
    '.rbc-month-row': {
      backgroundColor: calendarBgColor,
    },
    '.rbc-row-content': {
      backgroundColor: calendarBgColor,
    },
    '.rbc-row-bg': {
      backgroundColor: calendarBgColor,
    }
  }}
  selectable
  onSelectSlot={handleSelect}
  onSelectEvent={handleEventSelect}
  views={['month', 'week', 'day']}
  view={view}
  onView={setView}
  defaultView="week"
  components={{
    toolbar: CustomToolbar,
    event: EventComponent
  }}
/>
</Flex>

        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent bg={modalBg} borderRadius="2xl" boxShadow="2xl" mx={4}>
            <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb={4}>
              <HStack spacing={3}>
                <Icon as={FiCalendar} color="blue.500" boxSize={5} />
                <Heading size="md">Schedule Appointment</Heading>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FiClock} color="blue.500" />
                      <Text>Title</Text>
                    </HStack>
                  </FormLabel>
                  <Input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Property Viewing"
                    bg={inputBg}
                    borderRadius="lg"
                    _hover={{ borderColor: 'blue.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FiTag} color="blue.500" />
                      <Text>Type</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    bg={inputBg}
                    borderRadius="lg"
                    _hover={{ borderColor: 'blue.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                  >
                    <option value="viewing">Property Viewing</option>
                    <option value="meeting">Meeting</option>
                    <option value="signing">Contract Signing</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FiMapPin} color="blue.500" />
                      <Text>Location</Text>
                    </HStack>
                  </FormLabel>
                  <Input 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    bg={inputBg}
                    borderRadius="lg"
                    _hover={{ borderColor: 'blue.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                  />
                </FormControl>

                 <FormControl>
    <FormLabel>
      <HStack spacing={2}>
        <Icon as={FiPhone} color="blue.500" />
        <Text>Phone Number</Text>
      </HStack>
    </FormLabel>
    <Input 
      name="phone"
      value={formData.phone}
      onChange={handleInputChange}
      placeholder="Enter phone number"
      bg={inputBg}
      borderRadius="lg"
      _hover={{ borderColor: 'blue.500' }}
      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
    />
  </FormControl>


                <FormControl>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FiFileText} color="blue.500" />
                      <Text>Notes</Text>
                    </HStack>
                  </FormLabel>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes"
                    bg={inputBg}
                    borderRadius="lg"
                    rows={4}
                    _hover={{ borderColor: 'blue.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                  />
                </FormControl>

                <HStack spacing={4} width="100%" pt={4}>
                  <Button 
                    colorScheme="blue"
                    onClick={handleAddEvent}
                    isDisabled={!formData.title || !formData.location}
                    size="lg"
                    width="full"
                    borderRadius="lg"
                    leftIcon={<FiCheck />}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                  >
                    Schedule
                  </Button>
                  <Button 
                    onClick={onClose}
                    size="lg"
                    variant="ghost"
                    borderRadius="lg"
                    width="full"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
}
