import { createClient } from '@supabase/supabase-js'

// Create a singleton instance
let supabaseInstance = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          storageKey: 'keyreach-auth-key',
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
  }
  return supabaseInstance
}

const supabase = getSupabaseClient()

export const signInWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Additional useful auth methods
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const refreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.refreshSession()
  return { session, error }
}

export default supabase
