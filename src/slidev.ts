import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { GenerateSlideSchema } from './model.js'
import type { z } from 'zod'

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

export function buildFromContentSchema(
  content: z.infer<typeof GenerateSlideSchema>,
) {
  const settings = ['mdc: true']
  if (content.settings.background) {
    settings.push(`background: "${content.settings.background}"`)
  }
  if (content.settings.cssClass && content.settings.cssClass.length > 0) {
    settings.push(`class: ${content.settings.cssClass.join(' ')}`)
  }
  if (content.settings.fonts) {
    settings.push(
      `fonts:\n  sans: "${content.settings.fonts.sans}"\n  serif: "${content.settings.fonts.serif}"\n  mono: "${content.settings.fonts.mono}"`,
    )
  }
  if (content.settings.lineNumbers) {
    settings.push(
      `line-numbers: ${content.settings.lineNumbers ? 'true' : 'false'}`,
    )
  }
  if (content.settings.theme) {
    settings.push(`theme: "${content.settings.theme}"`)
  }

  const pages = content.pages.map((page) => {
    const settings = []
    if (page.layout) {
      settings.push(`layout: "${page.layout}"`)
    }
    if (page.imageUrl) {
      settings.push(`image: "${page.imageUrl}"`)
    }
    if (page.cssClass && page.cssClass.length > 0) {
      settings.push(`class: ${page.cssClass.join(' ')}`)
    }

    return `---\n${settings.join('\n')}\n---\n\n${page.content}\n`
  })
  // first page should not have settings section
  pages[0] = `---\n${content.pages[0].content}\n`

  const slide = `---\n${settings.join('\n')}\n${pages.join('')}`

  console.log(slide)

  return slide
}
