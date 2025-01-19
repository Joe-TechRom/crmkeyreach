'use client'

import { useEffect } from 'react'
import { useColorMode } from '@chakra-ui/react'

export function ColorModeManager() {
  const { setColorMode } = useColorMode()
  
  useEffect(() => {
    const savedMode = localStorage.getItem('chakra-ui-color-mode')
    if (savedMode) {
      setColorMode(savedMode)
    }
  }, [setColorMode])

  return null
}
