import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/models/user.model";
import { verifyPassword } from "@/app/lib/auth";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const email = body?.email?.toLowerCase().trim();
    const password = body?.password;

    // 1️⃣ Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password required" },
        { status: 400 }
      );
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 }
      );
    }

    // 3️⃣ Verify password
    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 }
      );
    }

    // 4️⃣ CREATE JWT (NEW PART)
    const token = jwt.sign(
      { userId: user._id }, // payload
      process.env.JWT_SECRET, // secret
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // 5️⃣ Send token to frontend
    return NextResponse.json({
      message: "login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "login failed" }, { status: 500 });
  }
}
