"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import api from "@/app/lib/api";

export default function ProjectsPage() {
  const {
    data: projects,
    error,
    isLoading,
    mutate,
  } = useSWR("/projects", fetcher);
  const [name, setName] = useState("");

  async function createProject() {
    if (!name.trim()) return;

    await api.post("/projects", { name });
    setName("");
    mutate(); // refresh list
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Projects</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
        />
        <button
          onClick={createProject}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {projects?.map((p) => (
        <div key={p._id} className="p-3 bg-white shadow rounded mb-2">
          {p.name}
        </div>
      ))}
    </div>
  );
}
