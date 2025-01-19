import { createClient } from '@supabase/supabase-js'

// Single, shared Supabase instance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'keyreach-auth'
    }
  }
)

// Export the singleton instance
export { supabase }
