/**
 * Custom hook for managing kanban tasks state and operations
 * To connect to real APIs: Replace local state operations with API calls
 * and add error handling, loading states, and optimistic updates
 */

'use client';

import { useState, useCallback } from 'react';
import { COLUMN_IDS } from '@/app/lib/types';
import { generateId, reorder, move } from '@/app/lib/utils';
import { generateInitialData } from '@/app/lib/dummyData';

export function useTasks() {
  // Initialize with dummy data - TODO: Replace with API call
  const [tasks, setTasks] = useState(() => generateInitialData());
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Add a new task to the specified column
   * TODO: Replace with API call to create task on server
   */
  const addTask = useCallback(async (taskData, columnId) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const newTask = await api.createTask(taskData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask = {
        ...taskData,
        id: generateId(),
        createdAt: new Date(),
        tags: taskData.tags || []
      };

      setTasks(prev => ({
        ...prev,
        [columnId]: [...prev[columnId], newTask]
      }));
      
      return newTask;
    } catch (error) {
      // TODO: Add proper error handling and user notification
      console.error('Failed to add task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing task
   * TODO: Replace with API call to update task on server
   */
  const updateTask = useCallback(async (taskId, updates) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const updatedTask = await api.updateTask(taskId, updates);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(columnId => {
          newTasks[columnId] = newTasks[columnId].map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          );
        });
        return newTasks;
      });
    } catch (error) {
      // TODO: Add proper error handling and user notification
      console.error('Failed to update task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a task
   * TODO: Replace with API call to delete task on server
   */
  const deleteTask = useCallback(async (taskId) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // await api.deleteTask(taskId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(columnId => {
          newTasks[columnId] = newTasks[columnId].filter(task => task.id !== taskId);
        });
        return newTasks;
      });
    } catch (error) {
      // TODO: Add proper error handling and user notification
      console.error('Failed to delete task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle drag and drop operations
   * TODO: Add API call to persist new order/column on server
   */
  const handleDragEnd = useCallback(async (result) => {
    const { destination, source } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    try {
      // Optimistic update - update UI immediately
      if (destination.droppableId === source.droppableId) {
        // Reordering within the same column
        const items = reorder(tasks[source.droppableId], source.index, destination.index);
        
        setTasks(prev => ({
          ...prev,
          [source.droppableId]: items
        }));
        
        // TODO: Add API call to persist new order
        // await api.updateTaskOrder(result);
      } else {
        // Moving between columns
        const result_move = move(
          tasks[source.droppableId],
          tasks[destination.droppableId],
          source,
          destination
        );
        
        setTasks(prev => ({
          ...prev,
          ...result_move
        }));
        
        // TODO: Add API call to persist column change and order
        // await api.updateTaskColumn(taskId, destination.droppableId, destination.index);
      }
    } catch (error) {
      // TODO: Implement rollback mechanism and show error message
      console.error('Failed to update task position:', error);
    }
  }, [tasks]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    handleDragEnd
  };
}