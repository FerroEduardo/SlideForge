import { spawnSync } from 'child_process'
import { fileSync } from 'tmp'
import { writeFileSync, readFileSync } from 'fs'

export async function build(content: string): Promise<ReadableStream> {
  // create temp file
  const tmpFile = fileSync({ postfix: '.md' })

  // write content to temp file
  writeFileSync(tmpFile.name, content)
  console.log(`Temporary file created at: ${tmpFile.name}`)

  // spawn slidev export command
  const result = spawnSync(
    'slidev',
    [
      'export',
      tmpFile.name,
      '--output',
      `${tmpFile.name.replace('.md', '.pdf')}`,
    ],
    { cwd: '/tmp' },
  )
  if (result.error) {
    // print error output if any
    if (result.stderr && result.stderr.length > 0) {
      console.error(`Slidev export error: ${result.stderr.toString()}`)
    }
    throw result.error
  }
  if (result.status !== 0) {
    // print error output if any
    if (result.stderr && result.stderr.length > 0) {
      console.error(`Slidev export error: ${result.stderr.toString()}`)
    }
    throw new Error(`Slidev export failed with status ${result.status}`)
  }

  // delete temp file
  tmpFile.removeCallback()

  // read the exported file
  const outputFile = tmpFile.name.replace('.md', '.pdf')
  return readFileSync(outputFile) as unknown as ReadableStream
}
