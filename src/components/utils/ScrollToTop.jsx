'use client'

import { useEffect } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { motion, useScroll, useAnimation } from 'framer-motion'
import { ArrowUpIcon } from '@chakra-ui/icons'

export default function ScrollToTop() {
  const { scrollYProgress } = useScroll()
  const controls = useAnimation()

  useEffect(() => {
    scrollYProgress.on('change', (y) => {
      if (y > 0.2) {
        controls.start({ opacity: 1, y: 0 })
      } else {
        controls.start({ opacity: 0, y: 20 })
      }
    })
  }, [scrollYProgress, controls])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="tooltip">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <IconButton
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          colorScheme="blue"
          rounded="full"
          size="lg"
        />
      </motion.div>
    </Box>
  )
}
