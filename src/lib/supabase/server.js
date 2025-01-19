const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { createServerClient } = require('@supabase/ssr')
const { cookies } = require('next/headers')

const app = next({ dev: false })
const handle = app.getRequestHandler()

function createClient(req, res) {
  const cookieStore = {
    get(name) {
      return req.cookies[name]
    },
    set(name, value, options) {
      res.setHeader('Set-Cookie', `${name}=${value}; ${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('; ')}`)
    },
    remove(name, options) {
      res.setHeader('Set-Cookie', `${name}=; Max-Age=0`)
    }
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: cookieStore
    }
  )
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const supabase = createClient(req, res)
      req.supabase = supabase
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }).listen(3001, () => {
    console.log('> Ready on http://localhost:3001')
  })
})
