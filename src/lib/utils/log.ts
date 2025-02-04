import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logError = async (msg: string, component: string, error: any) => {
  const logEntry = {
    host: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL,
    component,
    msg,
    level: 'error',
    error: error ? String(error) : null,
    time: new Date().toISOString(),
  };

  console.error('Error logged:', logEntry);

  try {
    const { error: insertError } = await supabase
      .from('logs')
      .insert([logEntry]);

    if (insertError) {
      console.error('Failed to insert log to Supabase:', insertError);
    }
  } catch (e) {
    console.error('Error logging to Supabase:', e);
  }
};
