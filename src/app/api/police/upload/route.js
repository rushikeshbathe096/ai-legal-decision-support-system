import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import {connectDB} from "@/lib/db/mongoose";
import Case from "@/lib/models/case";
import Document from "@/lib/models/Documents";
import User from "@/lib/models/User";
import fs from "fs";
import path from "path";
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "police") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const formData = await req.formData();
    const firNumber = formData.get("firNumber");
    const policeStation = formData.get("policeStation");
    const firDate = formData.get("firDate");
    const file = formData.get("file");
    if (!firNumber || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Save file locally
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "uploads", "firs");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    // Create Case
    const newCase = await Case.create({
      firNumber,
      policeStation,
      firDate,
      createdBy: user._id,
    });
    // Create Document
    const doc = await Document.create({
      caseId: newCase._id,
      fileName: file.name,
      filePath: `/uploads/firs/${fileName}`,
      uploadedBy: user._id,
    });
    // Link document to case
    newCase.documents.push(doc._id);
    await newCase.save();
    return NextResponse.json({
      success: true,
      caseId: newCase._id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}