'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_tier')
            .eq('id', session.user.id)
            .single()

          if (profile?.subscription_status === 'active') {
            router.push('/dashboard')
          } else {
            router.push(`/checkout?session_id=${session.user.id}`)
          }
        }
      } catch (error) {
        console.error('Error:', error)
        router.push('/auth/signin')
      }
    }

    handleCallback()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-50 text-red-500 rounded">
          Error: {error_description}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Finalizing your login...</div>
    </div>
  )
}
