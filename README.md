Below is a **complete, professional README.md** you can use directly.
It is written in **clear technical language**, suitable for **project submission, GitHub, and interviews**.

You can copy–paste this as `README.md` and adjust names if needed.

---

# Kanban Board – Full Stack Application

## 📌 Project Overview

This project is a **Kanban Board application** built using **Next.js**, **MongoDB**, and **REST APIs**.
It allows users to manage tasks within a project using a **drag-and-drop Kanban interface** with real-time synchronization between frontend and backend.

The focus of this project is **clean frontend–backend integration**, **structured backend APIs**, and **scalable architecture**.

---

## 🚀 Features

### 🗂 Kanban Board

- Three task columns:

  - **To Do**
  - **In Progress**
  - **Done**

- Tasks are grouped and displayed based on their status.

### 🔄 Drag-and-Drop Reordering

- Tasks can be:

  - Reordered within the same column
  - Moved across different columns

- Task positions are persisted in the database.

### ➕ Task Management

- Create new tasks for a project
- Automatically assigns correct position
- Supports deletion (API-ready)

### 🔗 Frontend–Backend Integration

- Frontend communicates with backend using REST APIs
- Axios + SWR used for efficient data fetching and revalidation
- Backend responses directly drive UI state

---

## 🧱 Tech Stack

### Frontend

- **Next.js (App Router)**
- **React**
- **SWR** (data fetching & caching)
- **Axios**
- **@hello-pangea/dnd** (drag-and-drop)

### Backend

- **Next.js API Routes**
- **MongoDB**
- **Mongoose**
- **bcryptjs** (password hashing)

---

## 🗃 MongoDB Schema

### Task Model (Simplified)

```js
{
  title: String,
  project: ObjectId,
  status: "todo" | "inprogress" | "done",
  position: Number,
  createdAt: Date,
  updatedAt: Date
}
```

- `status` determines the Kanban column
- `position` controls ordering inside a column
- Tasks are always sorted by `position`

---

## 🔌 Backend API Endpoints

### 🔹 GET Tasks

```
GET /api/tasks?projectId=<projectId>
```

**Description:**
Fetches all tasks for a given project, sorted by position.

**Response:**

```json
[
  {
    "_id": "...",
    "title": "Task title",
    "status": "todo",
    "position": 0
  }
]
```

---

### 🔹 Create Task

```
POST /api/tasks
```

**Request Body:**

```json
{
  "title": "New Task",
  "projectId": "123",
  "status": "todo"
}
```

**Behavior:**

- Automatically assigns correct position
- Returns created task

---

### 🔹 Reorder / Move Task

```
PUT /api/tasks
```

**Request Body:**

```json
{
  "reorder": true,
  "taskId": "taskId",
  "source": { "droppableId": "todo", "index": 0 },
  "destination": { "droppableId": "done", "index": 1 }
}
```

**Behavior:**

- Handles same-column and cross-column moves
- Normalizes positions after reorder

---

### 🔹 Delete Task

```
DELETE /api/tasks
```

**Request Body:**

```json
{
  "taskId": "taskId"
}
```

---

## 🔁 Frontend–Backend Data Flow

1. Frontend extracts `projectId` from URL
2. Frontend fetches tasks using:

   ```
   GET /api/tasks?projectId=...
   ```

3. User actions (add / drag tasks) trigger:

   - `POST /api/tasks`
   - `PUT /api/tasks`

4. Backend updates MongoDB
5. SWR revalidates data and updates UI automatically

This ensures **consistent state** between UI and database.

---

## 🛠 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd <project-folder>
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 📈 Project Highlights

- Clean separation of concerns (`api`, `lib`, `models`)
- Real-world drag-and-drop persistence logic
- Optimistic UI updates with revalidation
- Scalable API design
- Ready for authentication (JWT) integration

---

## 🔮 Future Enhancements

- User authentication (JWT)
- Project-level access control
- Task assignment to users
- Activity logs
- Deployment to Vercel + MongoDB Atlas

---

## 📌 Conclusion

This project demonstrates:

- Full-stack development skills
- Strong frontend–backend integration
- Practical use of databases and APIs
- Clean and maintainable architecture
