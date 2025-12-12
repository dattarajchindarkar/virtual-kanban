// app/kanban/[projectId]/page.js  (Server component)
import React from "react";
import KanbanClient from "./KanbanClient";

export default function Page({ params }) {
  const { projectId } = params; // Next.js provides params in page server components
  return (
    <div>
      <h1 className="text-2xl font-bold p-4">Kanban Board</h1>
      <KanbanClient projectId={projectId} />
    </div>
  );
}
