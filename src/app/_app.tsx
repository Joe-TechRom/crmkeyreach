import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserClient());
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
    };

    getInitialSession();

    supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, [supabaseClient]);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={session}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
