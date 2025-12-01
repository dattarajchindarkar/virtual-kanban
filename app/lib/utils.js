/**
 * Utility functions for the Virtual Kanban application
 * To connect to real APIs: Replace generateId with server-generated UUIDs
 * and add API utility functions for CRUD operations
 */

/**
 * Generate a simple unique ID for local state
 * TODO: Replace with server-generated UUID when connecting to real APIs
 */
let idCounter = 1000;
export function generateId() {
  return `task-${++idCounter}`;
}

/**
 * Format date for display
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Reorder items within the same list
 */
export function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Move item between different lists
 */
export function move(source, destination, droppableSource, droppableDestination) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
}