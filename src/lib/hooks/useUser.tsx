// /src/lib/hooks/useUser.tsx
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface User {
  id: string
  email: string
  name?: string | null
  subscription_status?: string | null
  subscription_tier?: string | null
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  billing_cycle?: string | null
  additional_users?: number | null
  subscription_period_end?: string | null
  plan_type?: string | null
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          console.error('Auth error:', authError)
          throw authError
        }

        if (authUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single()

          if (profileError) {
            console.error('Profile error:', profileError)
            // Handle the error, maybe set user to null or show an error message
            setUser(null)
            setError('Error fetching profile')
            return
          }

          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: profileData?.name,
            subscription_status: profileData?.subscription_status,
            subscription_tier: profileData?.subscription_tier,
            stripe_customer_id: profileData?.stripe_customer_id,
            stripe_subscription_id: profileData?.stripe_subscription_id,
            billing_cycle: profileData?.billing_cycle,
            additional_users: profileData?.additional_users,
            subscription_period_end: profileData?.subscription_period_end,
            plan_type: profileData?.plan_type
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUser()
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, isLoading, error }
}
