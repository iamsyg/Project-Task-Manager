# 📌 Project Task Manager

A full-stack web application that enables teams to **create projects, assign tasks, collaborate, and track progress** with **role-based access control (Admin/Member)**.

> Built to simulate real-world team workflows similar to tools like Google Classroom, Trello, and Asana.

---

## 🚀 Live Demo

- 🌐 Live URL: https://project-task-manager-production-56d6.up.railway.app/
- 📦 GitHub Repo: https://github.com/iamsyg/Project-Task-Manager

---

## 📖 Overview

This application allows users to:

- Create and manage projects
- Invite team members via project code
- Assign tasks and track progress
- Collaborate using comments
- Manage roles (Admin vs Member)

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- JWT-based authentication
- Secure session handling

### 📁 Project Management
- Create, update, delete projects
- Unique **project code** for joining
- Join request approval system
- Domain-restricted joining (optional)

### 👥 Role-Based Access
- **Admin**
  - Full control over project & tasks
- **Member**
  - Limited to assigned tasks

### 📌 Task Management
- Create & assign tasks
- Task status tracking:
  - `Pending`
  - `In Progress`
  - `Completed`
- Member-wise task progress

### 📊 Dashboard
- Project cards
- Task tracking
- Search & filter

---

## 🏗️ System Architecture

Frontend (Next.js / React)
│
▼
Backend (FastAPI + JWT)
│
▼
Database (PostgreSQL / Supabase)



---

## 🧱 Tech Stack

### Frontend
- Next.js / React
- Redux Toolkit
- Tailwind CSS

### Backend
- FastAPI
- JWT Authentication (PyJWT)
- Prisma ORM / Supabase

### Database
- PostgreSQL

### Deployment
- Railway (Backend)
- Vercel / Railway (Frontend)

---

## 📂 Database Schema (Simplified)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    refresh_token TEXT
);

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    due_date TIMESTAMP,
    status TEXT,
    project_code TEXT UNIQUE,
    admin_id UUID,
    require_approval BOOLEAN
);

CREATE TABLE project_members (
    id UUID PRIMARY KEY,
    project_id UUID,
    user_id UUID,
    role TEXT
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    project_id UUID,
    assigned_to UUID,
    status TEXT,
    due_date TIMESTAMP
);



## 🔑 Roles & Permissions

### 👑 Admin
- Create/Delete project  
- Manage members  
- Accept/reject join requests  
- Create/Delete tasks  
- Assign tasks  
- Update project/task details  
- Manage documents  
- Close project/task  

### 👤 Member
- View projects  
- Update own task status  
- Comment on tasks  

---

## 🔄 Workflow

1. **Signup / Login**

2. **Create Project**
   - Generates a unique project code  

3. **Join Project**
   - Members join using code  
   - Admin approves requests  

4. **Task Management**
   - Admin creates and assigns tasks  
   - Members update progress  

5. **Completion**
   - Admin monitors and closes tasks/projects  

---

## 📡 API Documentation

### 🔐 Auth APIs

#### Signup
```http
POST /auth/signup

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}

POST /project/create

{
  "title": "Project A",
  "description": "Optional",
  "due_date": "2026-06-01",
  "require_approval": true
}


## ⚙️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/iamsyg/Project-Task-Manager
cd Project-Task-Manager```

### Backend setup
```cd backend
pip install -r requirements.txt
uvicorn server:app --reload```

### frontend setup
```cd frontend
npm install
npm run dev```

🌐 Deployment
Backend: Railway
Frontend: Railway


🧠 Design Decisions
JWT Authentication → Stateless & secure
Role-Based Access Control (RBAC) → Real-world permission model
Project Code System → Inspired by Google Classroom
Modular Architecture → Clean separation (routes, controllers, models)


📈 Future Improvements
Real-time notifications (WebSockets)
File/document uploads
Activity logs
Email invitations
Kanban board UI
Analytics dashboard