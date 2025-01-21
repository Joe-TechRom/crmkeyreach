'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function SecureComponent({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_status')
          .eq('id', user.id)
          .single()

        if (profile?.subscription_status !== 'active') {
          router.push(`/checkout?session_id=${user.id}&tier=${profile?.subscription_tier}`)
        } else {
          setIsSubscriptionValid(true)
        }
      } else if (!loading) {
        router.push('/auth/signin')
      }
    }

    checkSubscription()
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return user && isSubscriptionValid ? children : null
}
