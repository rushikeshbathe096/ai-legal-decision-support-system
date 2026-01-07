import { FIRSummary } from "./types"

export async function generateFirSummary(
  prompt: string
): Promise<FIRSummary> {
  if (!prompt) {
    throw new Error("Prompt is required for FIR summary generation")
  }

  // MOCK IMPLEMENTATION (Groq will replace this later)
  return {
    incidentSummary: "Not mentioned in the document",
    keyAllegations: [],
    ipcSections: [],
    citations: []
  }
}
