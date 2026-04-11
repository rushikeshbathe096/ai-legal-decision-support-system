import { chunkText } from "./chunking"
import { retrieveRelevantChunks } from "./retriever"
import { buildPoliceFirSummaryPrompt } from "./prompts/policeFirSummary"
import { generateFirSummary } from "./generator"
import { FIRSummary } from "./types"

export async function runFirRagPipeline(
  firText: string
): Promise<FIRSummary> {

  if (!firText) {
    throw new Error("FIR text is required")
  }

  const chunks = chunkText(firText)

  // 🔥 AWAIT added here
  let relevantChunks = await retrieveRelevantChunks(
    chunks,
    "Summarize this FIR"
  )

  if (relevantChunks.length === 0) {
    relevantChunks = chunks.slice(0, 3)
  }

  const context = relevantChunks.join("\n\n")

  const citations = relevantChunks.map(
    (_, index) => `chunk_${index + 1}`
  )

  const prompt = buildPoliceFirSummaryPrompt(context, citations)

  return generateFirSummary(prompt)
}
