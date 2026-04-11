import { NextRequest, NextResponse } from "next/server"
import { runFirRagPipeline } from "../../../../lib/ai/rag"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firText } = body

    if (!firText || typeof firText !== "string") {
      return NextResponse.json(
        { error: "firText is required and must be a string" },
        { status: 400 }
      )
    }

    const result = await runFirRagPipeline(firText)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate FIR summary" },
      { status: 500 }
    )
  }
}
