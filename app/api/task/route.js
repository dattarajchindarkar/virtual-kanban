import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Task from "@/app/models/task.model";
import Project from "@/app/models/project.model";
import { withAuth } from "@/app/lib/authMiddleware";

/**
 * GET /api/tasks?projectId=xxx
 * Fetch tasks for a project (JWT protected)
 */
export const GET = withAuth(async function GET(req) {
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

    // 🔐 ensure project belongs to logged-in user
    const project = await Project.findOne({
      _id: projectId,
      owner: req.userId,
    });

    if (!project) {
      return NextResponse.json(
        { error: "Unauthorized access to project" },
        { status: 403 }
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
});

/**
 * POST /api/tasks
 * Create task (JWT protected)
 */
export const POST = withAuth(async function POST(req) {
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

    // 🔐 check project ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: req.userId,
    });

    if (!project) {
      return NextResponse.json(
        { error: "Unauthorized access to project" },
        { status: 403 }
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
});

/**
 * PUT /api/tasks
 * Reorder or update task (JWT protected)
 */
export const PUT = withAuth(async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    // ---------- REORDER ----------
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

      // 🔐 verify project ownership
      const project = await Project.findOne({
        _id: task.project,
        owner: req.userId,
      });

      if (!project) {
        return NextResponse.json(
          { error: "Unauthorized access to task" },
          { status: 403 }
        );
      }

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

        task.status = dstCol;
        task.position = dstIndex;
        await task.save();

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

    const task = await Task.findById(body.taskId);
    if (!task) {
      return NextResponse.json({ error: "task not found" }, { status: 404 });
    }

    const project = await Project.findOne({
      _id: task.project,
      owner: req.userId,
    });

    if (!project) {
      return NextResponse.json(
        { error: "Unauthorized access to task" },
        { status: 403 }
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
});

/**
 * DELETE /api/tasks
 * Delete task (JWT protected)
 */
export const DELETE = withAuth(async function DELETE(req) {
  try {
    await connectDB();
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "task not found" }, { status: 404 });
    }

    const project = await Project.findOne({
      _id: task.project,
      owner: req.userId,
    });

    if (!project) {
      return NextResponse.json(
        { error: "Unauthorized access to task" },
        { status: 403 }
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
});
