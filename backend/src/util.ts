import { fileSync, type FileResult, type FileOptions } from 'tmp'
import fs from 'fs'
import path from 'path'

/**
 * Creates a temporary file with the specified content and options.
 * @param content - The content to write to the temporary file.
 * @param options - Options for creating the temporary file.
 * @returns A FileResult object containing the path to the temporary file.
 */
export function createAndWriteTempFile(
  content: string,
  options: FileOptions,
): FileResult {
  const tmpFile = fileSync({
    ...options,
    prefix: `slidev-worker-${options.prefix || ''}`,
  })
  console.log(`Temporary file created at: ${tmpFile.name}`)
  fs.writeFileSync(tmpFile.name, content)
  console.log(`Content written to temporary file: ${tmpFile.name}`)

  return tmpFile
}

/**
 * Deletes old temporary files in the /tmp directory that match a given prefix
 * and are older than a specified age.
 * @param prefix - The prefix of the temporary files to delete (default: 'slidev-worker').
 * @param age - The age in milliseconds after which files should be deleted (default: 5 minutes).
 */
export function deleteOldTempFiles(
  prefix: string = 'slidev-worker',
  age: number = 5 * 60 * 1000,
): void {
  fs.readdir('/tmp', (err, files) => {
    if (err) {
      console.error('Error reading /tmp directory:', err)
      return
    }

    files.forEach((file) => {
      if (file.startsWith(prefix)) {
        const filePath = path.join('/tmp', file)
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error getting stats for file ${filePath}:`, err)
            return
          }

          if (Date.now() - stats.mtimeMs > age) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${filePath}:`, err)
              } else {
                console.log(`Deleted old temporary file: ${filePath}`)
              }
            })
          }
        })
      }
    })
  })
}
