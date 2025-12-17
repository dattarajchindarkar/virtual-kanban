import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/models/user.model";
import { hashPassword } from "@/app/lib/auth";

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

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    await User.create({ email, password: hashed });

    return NextResponse.json(
      { message: "registration successful" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "registration failed" }, { status: 500 });
  }
}
