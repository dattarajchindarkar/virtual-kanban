import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/app/models/project.model";

/**
 * Utility: connect to MongoDB safely
 */
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGODB_URI);
}

/**
 * GET /api/projects
 */
export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().lean();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";

    const description =
      typeof body?.description === "string" ? body.description.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const project = await Project.create({
      name,
      description,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
