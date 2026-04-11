import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import Case from "@/lib/models/case";
import User from "@/lib/models/User";

export async function GET(req) {
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

    // Fetch all cases created by this police officer, sorted by most recent first
    const cases = await Case.find({ createdBy: user._id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      cases,
    });
  } catch (error) {
    console.error("Fetch cases error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
