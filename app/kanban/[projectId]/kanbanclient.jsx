// app/kanban/[projectId]/KanbanClient.jsx
"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import api from "@/app/lib/api";
import { fetcher } from "@/app/lib/fetcher";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/**
 * Props:
 *  - projectId (string)
 *
 * Behavior:
 *  - fetch tasks via SWR key "/tasks?projectId=<id>"
 *  - create tasks with POST /api/tasks
 *  - reorder with PUT /api/tasks { reorder, taskId, source, destination }
 */

const STATUSES = [
  { id: "todo", title: "To do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function KanbanClient({ projectId }) {
  const {
    data: tasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR(projectId ? `/tasks?projectId=${projectId}` : null, fetcher);

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  // Group tasks by status for rendering
  const columns = useMemo(() => {
    const map = { todo: [], inprogress: [], done: [] };
    for (const t of tasks) {
      if (!map[t.status]) map[t.status] = [];
      map[t.status].push(t);
    }
    // Ensure they are sorted by position
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return map;
  }, [tasks]);

  async function createTask() {
    if (!title.trim()) return;
    setCreating(true);
    try {
      await api.post("/tasks", {
        title: title.trim(),
        projectId,
        status: "todo",
      });
      setTitle("");
      await mutate(); // refresh tasks
    } catch (err) {
      console.error("Create task failed", err);
      alert(err?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return; // dropped outside
    // If nothing changed, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // optimistic local reorder (optional) — we will revalidate anyway
    // Prepare payload for server reorder flow
    const payload = {
      reorder: true,
      taskId: draggableId, // set draggableId to task._id below when rendering
      source: { droppableId: source.droppableId, index: source.index },
      destination: {
        droppableId: destination.droppableId,
        index: destination.index,
      },
    };

    try {
      await api.put("/tasks", payload);
      await mutate(); // re-fetch authoritative order
    } catch (err) {
      console.error("Reorder failed", err);
      alert(err?.message || "Failed to reorder task");
      await mutate(); // refresh to server state
    }
  }

  if (!projectId) return <div>Select a project</div>;
  if (isLoading) return <div className="p-4">Loading tasks…</div>;
  if (error) return <div className="p-4">Failed to load tasks</div>;

  return (
    <div className="p-4">
      {/* Create task */}
      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 rounded w-80"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") createTask();
          }}
        />
        <button
          onClick={createTask}
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {creating ? "Creating…" : "Add Task"}
        </button>
      </div>

      {/* Kanban grid */}
      <div className="grid grid-cols-3 gap-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {STATUSES.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-3 bg-gray-50 rounded min-h-[200px] ${
                    snapshot.isDraggingOver ? "ring-2 ring-blue-300" : ""
                  }`}
                >
                  <h3 className="font-semibold mb-2">{col.title}</h3>

                  {columns[col.id]?.map((task, index) => (
                    <Draggable
                      draggableId={String(task._id)}
                      index={index}
                      key={task._id}
                    >
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={`mb-2 p-3 bg-white rounded shadow ${
                            snap.isDragging ? "opacity-90" : ""
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {task.title}
                          </div>
                          {task.description ? (
                            <div className="text-xs text-gray-500">
                              {task.description}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
