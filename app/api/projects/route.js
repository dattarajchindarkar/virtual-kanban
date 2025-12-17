import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Project from "@/app/models/project.model";

/**
 * GET /api/projects
 * Fetch all projects
 */
export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().lean();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Safe extraction + trimming
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    const description =
      typeof body?.description === "string" ? body.description.trim() : "";

    // Validation
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "name must be 100 characters or fewer" },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { error: "description must be 1000 characters or fewer" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name,
      description,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
