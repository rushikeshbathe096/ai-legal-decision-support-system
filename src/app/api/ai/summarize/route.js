import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { generateFirSummaryForCase } from "@/lib/ai/pipeline";
import { connectDB } from "@/lib/db/mongoose";
import Case from "@/lib/models/case";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { caseId } = await req.json();

        if (!caseId) {
            return NextResponse.json({ error: "Case ID is required" }, { status: 400 });
        }

        await connectDB();

        // 1. Initial check: Does the case exist and belong to the user (optional check)
        const caseRecord = await Case.findById(caseId);
        if (!caseRecord) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        // 2. Trigger the AI pipeline
        const summary = await generateFirSummaryForCase(caseId);

        return NextResponse.json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error("AI Summarization Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to generate AI summary"
        }, { status: 500 });
    }
}
