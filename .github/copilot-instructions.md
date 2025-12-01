# Virtual Kanban - Copilot Instructions

## Project Overview

This is a Next.js 16 virtual kanban application using the App Router architecture. The project is currently in early development with minimal implementation beyond the initial scaffold.

## Architecture & Structure

- **Framework**: Next.js 16 with App Router (`app/` directory)
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **Fonts**: Geist Sans & Geist Mono loaded via `next/font/google`
- **Build**: React Compiler enabled for optimized builds
- **Path Aliases**: `@/*` maps to project root via `jsconfig.json`

## Key Configuration Files

- `next.config.mjs`: React Compiler enabled (`reactCompiler: true`)
- `eslint.config.mjs`: Uses Next.js core web vitals config with custom ignores
- `postcss.config.mjs`: Tailwind CSS v4 PostCSS integration
- `app/globals.css`: Custom theme variables with dark mode support

## Development Patterns

### Styling Approach

- Tailwind CSS v4 with `@import "tailwindcss"` in `globals.css`
- Custom CSS variables for theming:
  ```css
  --background: #ffffff; /* Light mode */
  --foreground: #171717;
  --background: #0a0a0a; /* Dark mode */
  --foreground: #ededed;
  ```
- Font variables integrated into Tailwind theme (`--font-geist-sans`, `--font-geist-mono`)

### Component Structure

- App Router with `layout.js` and `page.js` pattern
- Font loading configured in root layout with CSS variables
- Metadata exports for SEO configuration

### Development Workflow

```bash
npm run dev    # Development server (Next.js 16)
npm run build  # Production build
npm run start  # Production server
npm run lint   # ESLint with Next.js rules
```

## Project-Specific Conventions

- Use `.js` extensions (not `.jsx`) for React components
- ESM modules throughout (`.mjs` config files)
- Tailwind CSS v4 inline theme configuration
- React 19 with React Compiler optimizations
- Client components marked with `'use client'` for interactivity
- @hello-pangea/dnd for drag-and-drop functionality (client-side only)
- Path aliases `@/*` for clean imports

## Development Patterns

- **State Management**: Custom hooks pattern (`useTasks.js`) for business logic
- **Component Design**: Presentational/container component separation
- **Accessibility**: ARIA labels, keyboard navigation, proper button semantics
- **Responsive Design**: Horizontal scrolling columns on mobile devices
- **Error Handling**: Optimistic updates with rollback patterns ready for API integration

## Current State & Implementation

The project now includes a complete **frontend-only Virtual Kanban application** with:

- **Drag & Drop**: @hello-pangea/dnd for task management between columns (todo, inprogress, done)
- **Local State Management**: React hooks with dummy data seeded for demonstration
- **Component Architecture**: Modular components in `app/components/` directory
- **API-Ready Structure**: All components designed for easy API integration with TODO comments

### Component Structure

- `KanbanBoard.js` - Main board with drag-and-drop context
- `KanbanColumn.js` - Column containers with droppable areas
- `TaskCard.js` - Individual draggable task cards with edit/delete functionality
- `NewTaskForm.js` - Task creation form with column assignment
- `useTasks.js` - Custom hook managing task state and operations

### API Integration Points

All components include TODO comments indicating where to connect real APIs:

- Task CRUD operations in `useTasks.js`
- User authentication for assignee selection
- Real-time updates and conflict resolution
- Error handling and loading states

When implementing the kanban functionality:

- Follow Next.js App Router patterns for routing and data fetching
- Leverage the configured Tailwind CSS v4 for responsive design
- Consider server components for performance
- Use the established font and theming system for consistency

## Development Environment

- Node.js project with npm package management
- Windows development environment (PowerShell)
- Git version control configured
