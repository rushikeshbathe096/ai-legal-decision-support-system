export async function retrieveRelevantChunks(
  chunks: string[],
  query: string
): Promise<string[]> {

  await fetch("http://localhost:8001/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chunks })
  })

  const res = await fetch("http://localhost:8001/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      top_k: 3
    })
  })

  const data = await res.json()
  return data.results
}
