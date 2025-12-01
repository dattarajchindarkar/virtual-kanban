/**
 * TaskCard component represents an individual task that can be dragged
 * Includes task details, priority indicators, and action buttons
 * To connect to real APIs: Add optimistic updates and error handling for task operations
 */

'use client';

import { Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import { PRIORITIES, PRIORITY_COLORS } from '@/app/lib/types';
import { formatDate } from '@/app/lib/utils';

export default function TaskCard({ task, index, onUpdateTask, onDeleteTask, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = async () => {
    try {
      await onUpdateTask(task.id, editedTask);
      setIsEditing(false);
    } catch (error) {
      // Reset to original values on error
      setEditedTask(task);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDeleteTask(task.id);
      } catch (error) {
        // TODO: Show error message to user
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm transition-all duration-200 ${
            snapshot.isDragging 
              ? 'rotate-2 shadow-lg ring-2 ring-blue-300' 
              : 'hover:shadow-md'
          }`}
        >
          {/* Drag Handle */}
          <div 
            {...provided.dragHandleProps}
            className="flex items-center gap-2 mb-3 cursor-grab active:cursor-grabbing"
            aria-label={`Drag ${task.title}`}
          >
            <div className="text-gray-400 text-sm">⋮⋮</div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full font-medium text-gray-900 dark:text-white bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {task.title}
                </h4>
              )}
            </div>
          </div>

          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {/* Task Description */}
          {isEditing ? (
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full text-sm text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 mb-2"
              rows={3}
            />
          ) : (
            <p className={`text-sm text-gray-600 dark:text-gray-300 mb-2 ${
              isExpanded ? 'block' : 'line-clamp-2'
            }`}>
              {task.description}
            </p>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div className="border-t border-gray-100 dark:border-gray-600 pt-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between items-start mb-1">
                <span>Assignee:</span>
                <span className="font-medium">{task.assignee}</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span>Created:</span>
                <span>{formatDate(task.createdAt)}</span>
              </div>
              
              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs px-3 py-1.5 rounded hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}