import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'

/**
 * Builds a PDF from a Slidev source file.
 * @param sourceFilePath - The path to the Slidev source file (Markdown).
 * @returns A ReadableStream containing the PDF output.
 */
export async function build(sourceFilePath: string): Promise<ReadableStream> {
  const result = spawnSync(
    'slidev',
    [
      'export',
      '--with-toc',
      sourceFilePath,
      '--output',
      `${sourceFilePath.replace('.md', '.pdf')}`,
    ],
    { cwd: '/tmp' }, // Write output to /tmp directory
  )
  if (result.error) {
    if (result.stderr && result.stderr.length > 0) {
      console.error(`Slidev export error: ${result.stderr.toString()}`)
    }
    throw result.error
  }
  if (result.status !== 0) {
    if (result.stderr && result.stderr.length > 0) {
      console.error(`Slidev export error: ${result.stderr.toString()}`)
    }
    throw new Error(`Slidev export failed with status ${result.status}`)
  }

  const outputFile = sourceFilePath.replace('.md', '.pdf')
  const fileStream = readFileSync(outputFile) as unknown as ReadableStream
  return fileStream
}
