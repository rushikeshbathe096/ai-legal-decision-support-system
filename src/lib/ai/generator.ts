import Groq from "groq-sdk"
import { FIRSummary } from "./types"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function generateFirSummary(
  prompt: string
): Promise<FIRSummary> {

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing")
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // FREE MODEL
    messages: [
      {
        role: "system",
        content:
          "You are a legal AI assistant. Return ONLY valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    throw new Error("Empty response from Groq")
  }

  return JSON.parse(content) as FIRSummary
}
