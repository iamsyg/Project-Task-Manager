// frontend/components/dashboard/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { SignUpModal, SignUpData } from "@/components/auth/SignUpModal";
import { useCreateProject } from "@/hooks/project/useCreateProject";

import { useAppSelector } from "@/store/hooks";

// Mock data - replace with actual API calls
const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Build a full-stack e-commerce platform with Next.js and Stripe",
    projectCode: "PROJ-ABC123",
    status: "Progress",
    membersCount: 5,
    tasksCount: 12,
    completedTasksCount: 7,
    dueDate: "2024-12-15",
    createdAt: "2024-01-10",
    role: "admin",
  },
  {
    id: "2",
    title: "Mobile App Design",
    description: "Design system and UI components for mobile banking app",
    projectCode: "PROJ-XYZ789",
    status: "Pending",
    membersCount: 3,
    tasksCount: 8,
    completedTasksCount: 2,
    dueDate: "2024-11-30",
    createdAt: "2024-02-01",
    role: "member",
  },
  {
    id: "3",
    title: "Marketing Campaign",
    description: "Q4 digital marketing campaign for product launch",
    projectCode: "PROJ-DEF456",
    status: "Completed",
    membersCount: 4,
    tasksCount: 15,
    completedTasksCount: 15,
    dueDate: "2024-10-01",
    createdAt: "2024-08-15",
    role: "admin",
  },
  {
    id: "4",
    title: "Marketing Campaign",
    description: "Q4 digital marketing campaign for product launch",
    projectCode: "PROJ-DEF456",
    status: "Completed",
    membersCount: 4,
    tasksCount: 15,
    completedTasksCount: 15,
    dueDate: "2024-10-01",
    createdAt: "2024-08-15",
    role: "admin",
  },
];

interface Project {
  id: string;
  title: string;
  description: string;
  projectCode: string;
  status: "Pending" | "Progress" | "Completed";
  membersCount: number;
  tasksCount: number;
  completedTasksCount: number;
  dueDate?: string;
  createdAt: string;
  role: "admin" | "member";
}

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Pending" | "Progress" | "Completed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("User from Redux:", user);
  }, []);

//   const handleSignUp = async (data: SignUpData) => {
//   console.log("Sign up data:", data);
//   // Here you would make your API call to register the user
//   // Example API call:
//   // const response = await fetch('/api/auth/signup', {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   body: JSON.stringify({
//   //     name: data.name,
//   //     email: data.email,
//   //     password: data.password,
//   //   }),
//   // });
  
//   // After successful signup, close modal and potentially set user
//   setIsSignUpOpen(false);
// };

const handleSignupClick = () => {
  setIsSignUpOpen(true);
};

  const handleLogin = () => {
    // Implement login logic
    console.log("Login clicked");
  };

//   const handleLogout = () => {
//     // Implement logout logic
//     setUser(null as any);
//   };

  const handleCreateProject = (projectData: any) => {
    const newProject: Project = {
      id: (projects.length + 1).toString(),
      title: projectData.title,
      description: projectData.description,
      projectCode: `PROJ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: "Pending",
      membersCount: 1,
      tasksCount: 0,
      completedTasksCount: 0,
      dueDate: projectData.dueDate,
      createdAt: new Date().toISOString(),
      role: "admin",
    };
    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        // user={user} 
        onLogin={handleLogin} 
        onSignup={handleSignupClick}  // Pass this instead of handleSignup
        // onLogout={handleLogout} 
        />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-500 mt-1">Manage your projects and track progress</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-xl p-1">
                {["all", "Pending", "Progress", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      filterStatus === status
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {status === "all" ? "All" : status}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <FolderKanban className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
              <p className="text-gray-500">Get started by creating your first project</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={(id) => console.log("View project", id)}
                  onManage={(id) => console.log("Manage project", id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={(id) => console.log("View project", id)}
                  onManage={(id) => console.log("Manage project", id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <CreateProjectModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateProject} />
      )}

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpOpen(false);
          // Open login modal logic here
        }}
      />
    </div>
  );
}

// Create Project Modal Component
function CreateProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { createProject } = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description, dueDate });

    try {
      const res = createProject(title, description, dueDate);
      console.log("Project created:", res);
    } catch (error) {
      console.error("Error creating project:", error);
    }

  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter project description (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// Missing import
import { FolderKanban } from "lucide-react";