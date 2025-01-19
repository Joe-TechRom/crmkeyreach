'use client'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { customTheme } from '@/styles/theme'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'neutral.800')
  const borderColor = useColorModeValue('neutral.200', 'neutral.700')

  const iconVariants = {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 1000
      }}
    >
      <IconButton
        icon={
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={colorMode}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </motion.div>
          </AnimatePresence>
        }
        onClick={toggleColorMode}
        variant="ghost"
        size="lg"
        rounded="full"
        aria-label="Toggle color mode"
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        color={customTheme.colors.primary.main}
        _hover={{
          bg: useColorModeValue('gray.100', 'neutral.700'),
          transform: 'translateY(-2px)',
        }}
        _active={{
          transform: 'translateY(0)',
        }}
        sx={{
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />
    </motion.div>
  )
}
