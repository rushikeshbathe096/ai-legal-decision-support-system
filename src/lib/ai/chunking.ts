const DEFAULT_CHUNK_SIZE = 800
const DEFAULT_CHUNK_OVERLAP = 100

export function chunkText(
  text: string,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  overlap: number = DEFAULT_CHUNK_OVERLAP
): string[] {
  if (!text) return []

  const cleanedText = text
    .replace(/\s+/g, " ")
    .trim()

  const chunks: string[] = []

  let start = 0

  while (start < cleanedText.length) {
    const end = Math.min(start + chunkSize, cleanedText.length)
    const chunk = cleanedText.slice(start, end)

    chunks.push(chunk)

    start += chunkSize - overlap
  }

  return chunks
}
