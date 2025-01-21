import { RedirectType } from 'next/navigation'

export function getErrorRedirect(
  redirectTo: string,
  error: string,
  message: string
) {
  const params = new URLSearchParams()
  params.set('error', error)
  params.set('message', message)
  return `${redirectTo}?${params.toString()}`
}

export function getStatusRedirect(
  redirectTo: string,
  status: string,
  message: string
) {
  const params = new URLSearchParams()
  params.set('status', status)
  params.set('message', message)
  return `${redirectTo}?${params.toString()}`
}
