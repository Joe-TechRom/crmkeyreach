import { useState, useEffect, useCallback } from 'react'
import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@/types/db'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user })
}))

export const useUser = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user, setUser, isAuthenticated } = useAuthStore()

  const fetchUser = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      
      if (supabaseUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single()
        
        const userWithData = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          ...userData
        }
        
        setUser(userWithData)
      } else {
        setUser(null)
      }
    } catch (err) {
      setError(err as Error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [setUser])

  useEffect(() => {
    fetchUser()
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [fetchUser])

  return { user, loading, error, isAuthenticated }
}
