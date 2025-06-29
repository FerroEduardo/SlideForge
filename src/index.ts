import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import * as slidev from './service/slidev.js'

const app = new Hono()

app.use(cors())
app.use(logger())
app.use(compress())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/export', async (c) => {
  const pdfFile = await slidev.build(await c.req.text())

  c.header('Content-Type', 'application/pdf')
  c.header('Content-Disposition', `attachment; filename="aaa.pdf"`)
  return c.body(pdfFile)
})

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)

process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
