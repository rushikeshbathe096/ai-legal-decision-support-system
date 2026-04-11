import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import Case from "@/lib/models/case";
import Document from "@/lib/models/Documents";
import User from "@/lib/models/User";

export async function GET(req, { params }) {
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

        const { caseId } = await params;

        // Fetch the single case and populate the documents array
        const singleCase = await Case.findOne({
            _id: caseId,
            createdBy: user._id
        }).populate("documents").lean();

        if (!singleCase) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            case: singleCase,
        });
    } catch (error) {
        console.error("Fetch case details error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
