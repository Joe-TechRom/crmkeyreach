'use client'
import { motion, useScroll, useSpring } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Box } from '@chakra-ui/react'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { keyframes } from '@emotion/react'

const components = {
  Hero: dynamic(() => import('@/components/home/Hero')),
  Features: dynamic(() => import('@/components/home/Features')),
  Testimonials: dynamic(() => import('@/components/home/Testimonials')),
  Pricing: dynamic(() => import('@/components/home/Pricing')),
  Overview: dynamic(() => import('@/components/home/Overview')),
  Newsletter: dynamic(() => import('@/components/home/Newsletter')),
  Contact: dynamic(() => import('@/components/home/Contact'))
}

const gradientMove = keyframes`
  0% { transform: translate(0%, 0%) rotate(0deg); }
  25% { transform: translate(20%, 20%) rotate(90deg); }
  50% { transform: translate(0%, 40%) rotate(180deg); }
  75% { transform: translate(-20%, 20%) rotate(270deg); }
  100% { transform: translate(0%, 0%) rotate(360deg); }
`

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

const gradientColors = {
  primary: '#FF6B2C',
  secondary: '#FF9A5C',
  accent1: '#FFB088',
  accent2: '#FFC7A8'
}

export default function Home() {
  const [session, setSession] = useState(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <Box as="div" margin={0} padding={0} overflow="hidden">
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${gradientColors.primary}, ${gradientColors.secondary})`,
          transformOrigin: '0%',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(255, 107, 44, 0.3)'
        }}
      />

      <motion.main
        initial="hidden"
        animate="visible"
        className="relative w-full overflow-hidden"
        style={{ 
          margin: 0, 
          padding: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <Box
          position="fixed"
          inset="0"
          zIndex="-1"
          overflow="hidden"
          pointerEvents="none"
        >
          <Box
            position="absolute"
            top="0%"
            left="-10%"
            width="70%"
            height="70%"
            background={`radial-gradient(circle, ${gradientColors.primary}15 0%, transparent 70%)`}
            filter="blur(80px)"
            animation={`${gradientMove} 25s linear infinite`}
          />
          
          <Box
            position="absolute"
            top="40%"
            right="-10%"
            width="60%"
            height="60%"
            background={`radial-gradient(circle, ${gradientColors.secondary}15 0%, transparent 70%)`}
            filter="blur(80px)"
            animation={`${gradientMove} 30s linear infinite reverse`}
          />
          
          <Box
            position="absolute"
            bottom="-10%"
            left="20%"
            width="50%"
            height="50%"
            background={`radial-gradient(circle, ${gradientColors.accent1}10 0%, transparent 70%)`}
            filter="blur(90px)"
            animation={`${gradientMove} 35s linear infinite`}
          />
          
          <Box
            position="absolute"
            top="30%"
            left="50%"
            width="40%"
            height="40%"
            background={`radial-gradient(circle, ${gradientColors.accent2}10 0%, transparent 70%)`}
            filter="blur(70px)"
            animation={`${gradientMove} 40s linear infinite reverse`}
          />
        </Box>

        <Box 
          display="flex"
          flexDirection="column"
          gap={0}
          margin={0}
          padding={0}
          minHeight="100vh"
        >
          {Object.entries(components).map(([name, Component], index) => (
            <motion.section
              key={name}
              variants={sectionVariants}
              viewport={{ 
                once: true,
                margin: "-5%"
              }}
              style={{
                width: '100%',
                margin: 0,
                padding: 0,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
              className={`
                relative w-full
                ${name === 'Hero' ? 'min-h-screen' : ''}
                ${name !== 'Hero' && name !== 'Newsletter' ? 'py-20 md:py-32' : ''}
                ${name === 'Newsletter' ? 'py-16' : ''}
              `}
            >
              <Component session={session} />
            </motion.section>
          ))}
        </Box>
      </motion.main>
    </Box>
  )
}
