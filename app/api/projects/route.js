import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/app/models/project.model";
import { withAuth } from "@/app/lib/authMiddleware";

/**
 * Utility: connect to MongoDB safely
 */
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

/**
 * GET /api/projects (JWT protected)
 */
export const GET = withAuth(async function GET(req) {
  try {
    await connectDB();

    // userId comes from JWT
    const userId = req.userId;

    const projects = await Project.find({ owner: userId }).lean();

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
});

/**
 * POST /api/projects (JWT protected)
 */
export const POST = withAuth(async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const userId = req.userId;

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const project = await Project.create({
      name,
      description,
      owner: userId, // 🔐 important
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
});
