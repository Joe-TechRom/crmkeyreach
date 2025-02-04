// /src/lib/utils/log.js
export const logError = (component, message, error, details) => {
  console.error(
    JSON.stringify({
      host: process.env.VERCEL_URL || 'localhost',
      component,
      msg: message,
      level: 'error',
      error: error?.message || error,
      details: details,
      time: new Date().toISOString()
    })
  )
}
