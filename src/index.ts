import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import * as slidev from './slidev.js'
import { createAndWriteTempFile, deleteOldTempFiles } from './util.js'
import crypto from 'crypto'
import { generateSlide } from './model.js'

const app = new Hono()

app.use(cors())
app.use(logger())
app.use(compress())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/generate', async (c) => {
  const response = await generateSlide(await c.req.text())
  if (!response) {
    return c.json(
      {
        error: 'Failed to generate slide',
      },
      400,
    )
  }

  const tempFile = createAndWriteTempFile(
    slidev.buildFromContentSchema(response),
    {
      postfix: '.md',
    },
  )

  try {
    const pdfFile = await slidev.build(tempFile.name)
    c.header('Content-Type', 'application/pdf')
    c.header(
      'Content-Disposition',
      `attachment; filename="${crypto.randomUUID()}.pdf"`,
    )
    return c.body(pdfFile)
  } catch (error) {
    console.error('Error during Slidev export:', error)
    return c.json(
      {
        error: 'Failed to export the presentation',
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    )
  } finally {
    console.log(`Removing temporary file: ${tempFile.name}`)
    tempFile.removeCallback()
  }
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

// Clean up old temporary files every 5 minutes
const scheduler = setInterval(
  () => {
    try {
      console.log('Cleaning up old temporary files...')
      deleteOldTempFiles()
    } catch (error) {
      console.error('Error cleaning up old temporary files:', error)
    }
  },
  5 * 60 * 1000,
)

process.on('SIGINT', () => {
  clearInterval(scheduler)
  server.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  clearInterval(scheduler)
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
