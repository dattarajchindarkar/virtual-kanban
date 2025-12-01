/**
 * Main KanbanBoard component with drag-and-drop functionality
 * This is the core component that manages the board state and columns
 * To connect to real APIs: Update useTasks hook to use real API calls
 */

'use client';

import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useTasks } from '@/app/hooks/useTasks';
import { COLUMN_IDS, COLUMN_LABELS } from '@/app/lib/types';
import KanbanColumn from './KanbanColumn';
import NewTaskForm from './NewTaskForm';

export default function KanbanBoard() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, handleDragEnd } = useTasks();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to defer the state update to avoid synchronous setState warning
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div className="w-full bg-gray-200 animate-pulse px-4 py-3 rounded-lg h-12"></div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {['To Do', 'In Progress', 'Done'].map((title, index) => (
            <div key={index} className="min-w-[300px] bg-white rounded-lg border-t-4 border-t-gray-300 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-8 animate-pulse"></div>
                </div>
              </div>
              <div className="p-4 min-h-[200px] space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Add New Task Section */}
      <div className="mb-6">
        <NewTaskForm onAddTask={addTask} isLoading={isLoading} />
      </div>
      
      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Object.values(COLUMN_IDS).map((columnId) => (
            <KanbanColumn
              key={columnId}
              columnId={columnId}
              title={COLUMN_LABELS[columnId]}
              tasks={tasks[columnId] || []}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              isLoading={isLoading}
            />
          ))}
        </div>
      </DragDropContext>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 dark:text-gray-300">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}