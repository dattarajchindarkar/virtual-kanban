// app/api/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose.js";
import User from "../../../models/User.js";

/**
 * GET  /api/users            -> list users
 * POST /api/users            -> create user (body: { email, name })
 * GET  /api/users?id=<id>    -> get single user (optional)
 * PUT  /api/users            -> update user (body: { userId, fields })
 * DELETE /api/users          -> delete user (body: { userId })
 */

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await User.findById(id).lean();
      if (!user)
        return NextResponse.json({ error: "user not found" }, { status: 404 });
      return NextResponse.json(user);
    }

    const users = await User.find().sort({ name: 1 }).lean();
    return NextResponse.json(users);
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    const user = await User.create({
      email: String(body.email).trim().toLowerCase(),
      name: body.name || "",
      role: body.role || "user",
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /api/users error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, fields } = body;
    if (!userId || !fields)
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });

    const updated = await User.findByIdAndUpdate(userId, fields, { new: true });
    if (!updated)
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId } = body;
    if (!userId)
      return NextResponse.json({ error: "userId required" }, { status: 400 });

    await User.findByIdAndDelete(userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
