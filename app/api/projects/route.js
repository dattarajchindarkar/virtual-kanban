import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Project from "@/app/models/project.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Basic type-safe extraction + trimming
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";

    // Validation rules
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

    // Optionally: more checks (allowed characters, profanity filter, etc.)
    // Create project
    const project = await Project.create({
      name,
      description: description || "",
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

    // Distinguish DB validation errors if you want more specific messages:
    // if (error.name === 'ValidationError') { ... }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
