const STOP_WORDS = new Set([
  "the","is","and","or","to","of","a","in","for","on","with",
  "that","this","was","were","by","as","at","an","be"
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
}

export function retrieveRelevantChunks(
  chunks: string[],
  query: string,
  topK = 3
): string[] {

  const queryTokens = tokenize(query)

  const scored = chunks.map(chunk => {
    const chunkTokens = tokenize(chunk)

    let score = 0
    for (const qt of queryTokens) {
      for (const ct of chunkTokens) {
        if (ct.includes(qt) || qt.includes(ct)) {
          score += 1
        }
      }
    }

    return { chunk, score }
  })

  const sorted = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return sorted.slice(0, topK).map(i => i.chunk)
}
