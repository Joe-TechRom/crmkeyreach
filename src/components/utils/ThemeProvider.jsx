'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { customTheme } from '@/styles/theme'

const theme = extendTheme(customTheme)

export function ThemeProvider({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
