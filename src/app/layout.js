import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ScrollToTop from '@/components/utils/ScrollToTop'
import ThemeToggle from '@/components/utils/ThemeToggle'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { ColorModeScript, Box } from '@chakra-ui/react'
import { customTheme } from '@/styles/theme'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap'
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a202c' }
  ]
}

export const metadata = {
  metadataBase: new URL('https://keyreach-crm.com'),
  title: 'KeyReach CRM',
  description: 'Modern Real Estate CRM Solution',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://keyreach-crm.com',
    title: 'KeyReach CRM',
    description: 'Modern Real Estate CRM Solution',
    images: [{
      url: '/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'KeyReach CRM'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyReach CRM',
    description: 'Modern Real Estate CRM Solution',
    images: ['/images/twitter-image.jpg']
  }
}

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <head>
        <ColorModeScript type="cookie" initialColorMode={customTheme.config.initialColorMode} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Box 
            as="div"
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            width="100%"
            position="relative"
            overflow="hidden"
          >
            <Navbar />
            
            <Box
              position="fixed"
              top="0"
              left="0"
              right="0"
              bottom="0"
              zIndex="-1"
              bgGradient="radial(circle at top right, purple.50, transparent 70%)"
              _dark={{
                bgGradient: "radial(circle at top right, purple.900, transparent 70%)"
              }}
              opacity="0.5"
              sx={{ transition: 'background 0.3s ease' }}
            />
            
            <Box 
              as="main"
              flexGrow={1}
              width="100%"
              position="relative"
              zIndex="1"
              pt={{ base: '76px', md: '80px' }}
            >
              {children}
            </Box>
            <Footer />
            
            <Box 
              position="fixed"
              bottom="4"
              right="4"
              zIndex="tooltip"
              display="flex"
              flexDirection="column"
              gap="3"
            >
              <ScrollToTop />
              <ThemeToggle />
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  )
}
