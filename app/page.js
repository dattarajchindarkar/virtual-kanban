/**
 * Main page component that renders the Virtual Kanban board with authentication
 * This is the entry point for the kanban application
 * To connect to real APIs: Replace the dummy data in KanbanBoard with API calls
 */
import KanbanBoard from './components/KanbanBoard';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header with User Profile */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Virtual Kanban Board
            </h1>
            <UserProfile />
          </div>
          
          {/* Kanban Board */}
          <KanbanBoard />
        </div>
      </main>
    </ProtectedRoute>
  );
}
