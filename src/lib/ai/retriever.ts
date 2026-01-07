export function retrieveRelevantChunks(
  chunks: string[],
  query: string,
  topK: number = 5
): string[] {
  if (!query || chunks.length === 0) return []

  const lowerQuery = query.toLowerCase()

  const scored = chunks.map(chunk => {
    let score = 0
    const lowerChunk = chunk.toLowerCase()

    lowerQuery.split(" ").forEach(word => {
      if (lowerChunk.includes(word)) {
        score += 1
      }
    })

    return { chunk, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk)
}
