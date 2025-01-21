'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const redirectToDashboard = async (user) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status === 'active') {
      const dashboardRoutes = {
        single_user: '/dashboard/single-user',
        team: '/dashboard/team',
        corporate: '/dashboard/corporate'
      }
      router.push(dashboardRoutes[profile.subscription_tier] || '/dashboard/single-user')
    } else {
      router.push(`/checkout?session_id=${user.id}&tier=${profile?.subscription_tier}`)
    }
  }

  useEffect(() => {
    let mounted = true

   const initializeAuth = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (mounted && user) {
      setUser(user)
      // Only redirect if we're not already on auth pages
      if (!window.location.pathname.includes('/auth/')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_status')
          .eq('id', user.id)
          .single()
        
        if (profile?.subscription_status === 'active') {
          redirectToDashboard(user)
        }
      }
    }
  } finally {
    if (mounted) {
      setLoading(false)
    }
  }
}

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user)
          if (user && event === 'SIGNED_IN') {
            redirectToDashboard(user)
          }
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    loading,
    supabase,
    redirectToDashboard
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
