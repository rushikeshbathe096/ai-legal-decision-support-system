import fs from 'fs';
import path from 'path';

import { runFirRagPipeline } from './rag';
import Case from '../models/case';
import Document from '../models/Documents';
import { connectDB } from '../db/mongoose';

/**
 * Extract text using Python backend
 */
async function extractTextFromPDF(relativePath) {
    const fullPath = path.join(process.cwd(), 'public', relativePath);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found at ${fullPath}`);
    }

    const response = await fetch("http://localhost:8000/extract-text", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            file_path: fullPath,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to extract text from Python backend");
    }

    const data = await response.json();

    if (!data.text) {
        throw new Error("No text returned from Python");
    }

    return data.text;
}

/**
 * Main pipeline
 */
export async function generateFirSummaryForCase(caseId) {
    await connectDB();

    // 1. Fetch case
    const caseData = await Case.findById(caseId).populate('documents');
    if (!caseData) throw new Error("Case not found");

    const firDoc = caseData.documents.find(doc => doc.type === 'FIR');
    if (!firDoc) throw new Error("No FIR document found");

    // 2. Extract text via Python
    console.log(`Extracting text from: ${firDoc.filePath}`);
    const firText = await extractTextFromPDF(firDoc.filePath);

    if (!firText || firText.trim().length === 0) {
        throw new Error("EXTRACTED_TEXT_EMPTY");
    }

    // 3. Run RAG pipeline
    console.log("Running AI pipeline...");
    const summaryResult = await runFirRagPipeline(firText);

    // 4. Save summary
    caseData.summary = {
        incidentSummary: summaryResult.incidentSummary,
        keyAllegations: summaryResult.keyAllegations,
        ipcSections: summaryResult.ipcSections,
        citations: summaryResult.citations
    };

    await caseData.save();

    console.log("Summary saved successfully");

    return caseData.summary;
}