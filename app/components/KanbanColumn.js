/**
 * KanbanColumn component represents a single column (To Do, In Progress, Done)
 * Handles the droppable area and renders task cards within the column
 * To connect to real APIs: No changes needed, this component is presentation-only
 */

'use client';

import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

export default function KanbanColumn({ 
  columnId, 
  title, 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  isLoading 
}) {
  const getColumnColor = (columnId) => {
    switch (columnId) {
      case 'todo':
        return 'border-t-blue-500';
      case 'inprogress':
        return 'border-t-yellow-500';
      case 'done':
        return 'border-t-green-500';
      default:
        return 'border-t-gray-500';
    }
  };

  return (
    <div className={`min-w-[300px] bg-white dark:bg-gray-800 rounded-lg border-t-4 ${getColumnColor(columnId)} shadow-sm`}>
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Task List */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : 'bg-transparent'
            }`}
          >
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                <div className="mb-2">📋</div>
                <p>No tasks yet</p>
                <p className="text-xs mt-1">Drag tasks here or add a new one</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}