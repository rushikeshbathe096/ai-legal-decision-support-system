//Rag orchestrator for handling police FIR summary generation
import { chunkText } from "./chunking"
import { retrieveRelevantChunks } from "./retriever"
import { buildPoliceFirSummaryPrompt } from "./prompts/policeFirSummary"
import { generateFirSummary } from "./generator"
import { FIRSummary } from "./types"

export async function runFirRagPipeline(
  firText: string,
  query: string
): Promise<FIRSummary> {
  if (!firText) {
    throw new Error("FIR text is required")
  }

  const chunks = chunkText(firText)

  const relevantChunks = retrieveRelevantChunks(
    chunks,
    query || "Summarize the FIR"
  )

  const context = relevantChunks.join("\n\n")

  const citations = relevantChunks.map(
    (_, index) => `chunk_${index + 1}`
  )

  const prompt = buildPoliceFirSummaryPrompt(context, citations)

  const result = await generateFirSummary(prompt)

  return result
}
