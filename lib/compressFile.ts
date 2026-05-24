import { PDFDocument } from 'pdf-lib'

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB

/**
 * Re-save a PDF using pdf-lib with object streams to drop unused objects and
 * tighten the structural overhead. Image streams are kept as-is (no transcoding),
 * so visual quality is preserved. Falls back to the original file on any failure
 * or when the re-saved file ends up larger.
 */
async function compressPdf(file: File): Promise<File> {
  try {
    const buf = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buf, { updateMetadata: false })
    const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false })
    if (out.byteLength >= buf.byteLength) return file
    const blob = new Blob([out as BlobPart], { type: file.type || 'application/pdf' })
    return new File([blob], file.name, { type: file.type || 'application/pdf', lastModified: Date.now() })
  } catch {
    return file
  }
}

/** Compress a single file when its type supports it. Pass-through for others. */
export async function compressFile(file: File): Promise<File> {
  const ext = file.name.toLowerCase().split('.').pop() ?? ''
  if (ext === 'pdf') return compressPdf(file)
  return file
}

/** Compress a list of files in parallel. */
export function compressFiles(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressFile))
}
