// app/api/tasks/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose.js";
import Task from "../../../models/Task.js";

/**
 * Endpoints:
 * GET  /api/tasks?projectId=<id>        -> list tasks for project (sorted by position)
 * POST /api/tasks                       -> create task (body: { title, projectId, status?, description?, position? })
 * PUT  /api/tasks                       -> update task or reorder (see payload below)
 * DELETE /api/tasks                     -> delete task (body: { taskId })
 *
 * Reorder payload (from frontend onDragEnd):
 * { reorder: true, taskId, source: { droppableId, index }, destination: { droppableId, index } }
 *
 * Generic update payload:
 * { taskId, fields }  // fields is an object with fields to update
 */

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json(
        { error: "projectId required" },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ project: projectId })
      .sort({ position: 1 })
      .lean();
    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
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

    if (!body?.title || !body?.projectId) {
      return NextResponse.json(
        { error: "title and projectId required" },
        { status: 400 }
      );
    }

    const count = await Task.countDocuments({
      project: body.projectId,
      status: body.status || "todo",
    });

    const task = await Task.create({
      title: String(body.title).trim(),
      description: body.description || "",
      project: body.projectId,
      status: body.status || "todo",
      position: typeof body.position === "number" ? body.position : count,
      assignee: body.assignee || undefined,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
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

    // Reorder operation
    if (body?.reorder) {
      const { taskId, source, destination } = body;
      if (!taskId || !source || !destination) {
        return NextResponse.json(
          { error: "invalid reorder payload" },
          { status: 400 }
        );
      }

      const task = await Task.findById(taskId);
      if (!task)
        return NextResponse.json({ error: "task not found" }, { status: 404 });

      const srcCol = source.droppableId;
      const dstCol = destination.droppableId;
      const srcIndex = source.index;
      const dstIndex = destination.index;

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
      } else {
        // remove from source and reindex
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

        // set moved task status/position and save
        task.status = dstCol;
        task.position = dstIndex;
        await task.save();

        // normalize destination positions
        const finalDst = await Task.find({
          project: task.project,
          status: dstCol,
        }).sort({ position: 1 });
        for (let i = 0; i < finalDst.length; i++) {
          if (finalDst[i].position !== i) {
            finalDst[i].position = i;
            await finalDst[i].save();
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    // Generic update
    const { taskId, fields } = body;
    if (!taskId || !fields) {
      return NextResponse.json(
        { error: "invalid update payload" },
        { status: 400 }
      );
    }

    const updated = await Task.findByIdAndUpdate(taskId, fields, { new: true });
    if (!updated)
      return NextResponse.json({ error: "task not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/tasks error:", err);
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
    const { taskId } = body;
    if (!taskId)
      return NextResponse.json({ error: "taskId required" }, { status: 400 });

    await Task.findByIdAndDelete(taskId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
