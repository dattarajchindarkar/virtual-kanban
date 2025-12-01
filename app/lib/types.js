/**
 * Type definitions for the Virtual Kanban application
 * To connect to real APIs: Replace these local types with API response types
 * and add validation schemas (e.g., Zod) for runtime type checking
 */

export const COLUMN_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress', 
  DONE: 'done'
};

export const COLUMN_LABELS = {
  [COLUMN_IDS.TODO]: 'To Do',
  [COLUMN_IDS.IN_PROGRESS]: 'In Progress',
  [COLUMN_IDS.DONE]: 'Done'
};

// Task priority levels
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high'
};

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PRIORITIES.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [PRIORITIES.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};