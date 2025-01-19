import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const trackUsage = async (subscriptionId, resourceType, quantity) => {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('usage_logs')
    .insert({
      subscription_id: subscriptionId,
      resource_type: resourceType,
      quantity: quantity
    })
    .select()
    .single()

  return { data, error }
}

export const getUsageSummary = async (subscriptionId) => {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('usage_logs')
    .select('resource_type, quantity')
    .eq('subscription_id', subscriptionId)
    .order('logged_at', { ascending: false })
    .limit(1)

  return { data, error }
}

export const subscribeToUsageUpdates = (subscriptionId, callback) => {
  const supabase = createClientComponentClient()
  
  const channel = supabase
    .channel(`usage_${subscriptionId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'usage_logs',
      filter: `subscription_id=eq.${subscriptionId}`
    }, callback)
    .subscribe()

  return () => supabase.removeChannel(channel)
}
