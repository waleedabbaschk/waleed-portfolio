import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev only: serves api/chat.ts on "npm run dev" (Vite does not run /api by itself).
// On Vercel the real Vercel Function is used, this plugin never runs in production.
function apiDev(): Plugin {
  return {
    name: 'api-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v

      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const method = req.method ?? 'GET'
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === 'string') headers.set(k, v)
          }
          const request = new Request(`http://${req.headers.host ?? 'localhost'}/api/chat`, {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
          })

          const mod = await server.ssrLoadModule('/api/chat.ts')
          const handler = mod[method] as ((r: Request) => Promise<Response> | Response) | undefined
          const response = handler
            ? await handler(request)
            : new Response('Method Not Allowed', { status: 405 })

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          console.error('api-dev error:', err instanceof Error ? err.message : err)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API error.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDev()],
})