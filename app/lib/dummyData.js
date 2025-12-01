/**
 * Dummy data generator for the Virtual Kanban application
 * To connect to real APIs: Replace this with API calls to fetch tasks
 * and maintain this structure for initial loading states
 */

import { COLUMN_IDS, PRIORITIES } from './types.js';
/**
 * Generate initial dummy tasks for demonstration
 * TODO: Replace with API call to fetch user's tasks
 */
export function generateDummyTasks() {
  const dummyTasks = [
    {
      id: 'task-1',
      title: 'Design new landing page',
      description: 'Create wireframes and mockups for the new marketing landing page',
      priority: PRIORITIES.HIGH,
      createdAt: new Date('2024-11-25'),
      assignee: 'John Doe',
      tags: ['design', 'marketing']
    },
    {
      id: 'task-2',
      title: 'Implement user authentication',
      description: 'Set up JWT-based authentication with login and registration',
      priority: PRIORITIES.HIGH,
      createdAt: new Date('2024-11-24'),
      assignee: 'Jane Smith',
      tags: ['backend', 'security']
    },
    {
      id: 'task-3',
      title: 'Write API documentation',
      description: 'Document all REST endpoints using OpenAPI/Swagger',
      priority: PRIORITIES.MEDIUM,
      createdAt: new Date('2024-11-23'),
      assignee: 'Bob Johnson',
      tags: ['documentation', 'api']
    },
    {
      id: 'task-4',
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      priority: PRIORITIES.MEDIUM,
      createdAt: new Date('2024-11-22'),
      assignee: 'Alice Wilson',
      tags: ['devops', 'automation']
    },
    {
      id: 'task-5',
      title: 'Optimize database queries',
      description: 'Review and optimize slow-performing database queries',
      priority: PRIORITIES.LOW,
      createdAt: new Date('2024-11-21'),
      assignee: 'Charlie Brown',
      tags: ['database', 'performance']
    },
    {
      id: 'task-6',
      title: 'Update dependencies',
      description: 'Update all npm packages to latest stable versions',
      priority: PRIORITIES.LOW,
      createdAt: new Date('2024-11-20'),
      assignee: 'David Lee',
      tags: ['maintenance', 'security']
    }
  ];

  return dummyTasks;
}

/**
 * Generate initial column state with tasks distributed across columns
 * TODO: Replace with API call to fetch current board state
 */
export function generateInitialData() {
  const tasks = generateDummyTasks();
  
  return {
    [COLUMN_IDS.TODO]: tasks.slice(0, 3),
    [COLUMN_IDS.IN_PROGRESS]: tasks.slice(3, 5),
    [COLUMN_IDS.DONE]: tasks.slice(5)
  };
}