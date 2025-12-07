import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose.js";
import Project from "../../../models/Project.js";

// GET /api/projects  -> return all projects
export async function GET() {
  await connectDB();
  const projects = await Project.find().lean();
  return NextResponse.json(projects);
}

// POST /api/projects  -> create a new project
export async function POST(req) {
  await connectDB();
  const body = await req.json();

  if (!body?.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const project = await Project.create({
    name: body.name,
    description: body.description || "",
  });

  return NextResponse.json(project, { status: 201 });
}
