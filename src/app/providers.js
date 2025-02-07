'use client';

import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react';
import { extendTheme, GlobalStyle } from '@chakra-ui/react';
import { customTheme } from '@/styles/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

// Enhanced theme configuration
const theme = extendTheme({
  ...customTheme,
  styles: {
    global: {
      'html, body': {
        scrollBehavior: 'smooth',
        scrollPaddingTop: '80px',
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'var(--primary-color)',
        borderRadius: '4px',
      },
    },
  },
  config: {
    ...customTheme.config,
    cssVarPrefix: 'keyreach',
    disableTransitionOnChange: false,
  },
});

// Page transition variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export function Providers({ children }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function getInitialSession() {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
    }

    getInitialSession();

    const { data: { subscription: authListener } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [supabaseClient]);

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} resetCSS>
        <CSSReset />
        <GlobalStyle />
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={session}
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              style={{
                width: '100%',
                zIndex: 1,
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </SessionContextProvider>
      </ChakraProvider>
    </>
  );
}
