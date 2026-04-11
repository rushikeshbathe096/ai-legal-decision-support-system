import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";



console.log("USER CREATE API HIT");

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.googleId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    if (!["police", "judge", "govt"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      googleId: session.user.googleId,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const user = await User.create({
      googleId: session.user.googleId,
      email: session.user.email,
      role,
    });

    return NextResponse.json({
      message: "User created",
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
