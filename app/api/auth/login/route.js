import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/models/user.model";
import { verifyPassword } from "@/app/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const email = body?.email?.toLowerCase().trim();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "login successful",
      userId: user._id,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "login failed" }, { status: 500 });
  }
}
