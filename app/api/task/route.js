// app/api/tasks/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Task from "@/app/models/task.model";

/**
 * GET /api/tasks?projectId=xxx
 * Fetch all tasks for a project
 */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ project: projectId })
      .sort({ position: 1 })
      .lean();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, projectId, status = "todo" } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "title and projectId are required" },
        { status: 400 }
      );
    }

    const count = await Task.countDocuments({
      project: projectId,
      status,
    });

    const task = await Task.create({
      title,
      project: projectId,
      status,
      position: count,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /tasks error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tasks
 * Reorder or update a task
 */
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    // ---------- REORDER LOGIC ----------
    if (body?.reorder) {
      const { taskId, source, destination } = body;

      if (!taskId || !source || !destination) {
        return NextResponse.json(
          { error: "invalid reorder payload" },
          { status: 400 }
        );
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return NextResponse.json({ error: "task not found" }, { status: 404 });
      }

      const srcCol = source.droppableId;
      const dstCol = destination.droppableId;
      const srcIndex = source.index;
      const dstIndex = destination.index;

      // ---------- SAME COLUMN ----------
      if (srcCol === dstCol) {
        const items = await Task.find({
          project: task.project,
          status: srcCol,
        }).sort({ position: 1 });

        const [moved] = items.splice(srcIndex, 1);
        items.splice(dstIndex, 0, moved);

        for (let i = 0; i < items.length; i++) {
          if (items[i].position !== i) {
            items[i].position = i;
            await items[i].save();
          }
        }
      }
      // ---------- DIFFERENT COLUMN ----------
      else {
        // Remove from source column
        const srcItems = await Task.find({
          project: task.project,
          status: srcCol,
        }).sort({ position: 1 });

        srcItems.splice(srcIndex, 1);

        for (let i = 0; i < srcItems.length; i++) {
          if (srcItems[i].position !== i) {
            srcItems[i].position = i;
            await srcItems[i].save();
          }
        }

        // Move task to destination column
        task.status = dstCol;
        task.position = dstIndex;
        await task.save();

        // Normalize destination column
        const dstItems = await Task.find({
          project: task.project,
          status: dstCol,
        }).sort({ position: 1 });

        for (let i = 0; i < dstItems.length; i++) {
          if (dstItems[i].position !== i) {
            dstItems[i].position = i;
            await dstItems[i].save();
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    // ---------- NORMAL UPDATE ----------
    if (!body?.taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const updated = await Task.findByIdAndUpdate(body.taskId, body, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /tasks error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks
 * Delete a task
 */
export async function DELETE(req) {
  try {
    await connectDB();
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    await Task.findByIdAndDelete(taskId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /tasks error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
