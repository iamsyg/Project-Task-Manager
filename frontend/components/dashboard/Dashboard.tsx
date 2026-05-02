// frontend/components/dashboard/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Plus, Search, LayoutGrid, List, FolderKanban, X } from "lucide-react";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { LogInModal } from "@/components/auth/LogInModal";
import { useAppSelector } from "@/store/hooks";
import { useGetProjects } from "@/hooks/project/useGetProjects";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { ProjectModal } from "./ProjectModal";

// Define the Project type matching your API response
interface ProjectType {
  id: string;
  title: string;
  description: string | null;
  project_code: string;
  status: "pending" | "in_progress" | "completed";
  members_count: number;
  tasks_count: number;
  due_date: string | null;
  created_at: string;
  role: "admin" | "member";
}

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { projects, loading } = useAppSelector((state) => state.projectList);

  const { getProjects } = useGetProjects();

  useEffect(() => {
    if (isAuthenticated) {
      getProjects();
    }
  }, [isAuthenticated]);

  const handleCreateProjectClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewProject = (project: ProjectType) => {
    // Convert project data to match ProjectModal interface
    setSelectedProject({
      id: project.id,
      title: project.title,
      description: project.description || "",
      projectCode: project.project_code,
      status: project.status,
      dueDate: project.due_date || undefined,
      createdBy: {
        id: "current-user", // This would come from your auth state
        name: "Current User", // This would come from your auth state
        email: "user@example.com", // This would come from your auth state
      },
      userRole: project.role,
      members: [], // Fetch from API when needed
      tasks: [], // Fetch from API when needed
      joinRequests: [], // Fetch from API when needed
      createdAt: project.created_at,
      updatedAt: project.created_at,
    });
  };

  const filteredProjects = projects.filter((project: ProjectType) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || project.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogin={() => setIsLoginOpen(true)}
        onSignup={() => setIsSignUpOpen(true)}
      />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-500 mt-1">
                Manage your projects and track progress
              </p>
            </div>

            {/* Only show Create Project button when authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleCreateProjectClick}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <FolderKanban className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TaskManager</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Sign in to create projects, assign tasks, and collaborate with your team
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignUpOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-xl p-1">
                    {["all", "pending", "in_progress", "completed"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status as any)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                            filterStatus === status
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {status === "all" 
                            ? "All" 
                            : status === "in_progress" 
                            ? "In Progress" 
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                    )}
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

              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <FolderKanban className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No projects found
                  </h3>
                  <p className="text-gray-500">
                    Get started by creating your first project
                  </p>
                  <button
                    onClick={handleCreateProjectClick}
                    className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-3"
                  }
                >
                  {filteredProjects.map((project: ProjectType) => (
                    <ProjectCard
                      key={project.id}
                      project={{
                        id: project.id,
                        title: project.title,
                        description: project.description || "",
                        projectCode: project.project_code,
                        status:
                          project.status === "in_progress"
                            ? "Progress"
                            : project.status === "completed"
                            ? "Completed"
                            : "Pending",
                        membersCount: project.members_count,
                        tasksCount: project.tasks_count,
                        completedTasksCount: 0,
                        dueDate: project.due_date || undefined,
                        createdAt: project.created_at,
                        role: project.role,
                      }}
                      onView={() => handleViewProject(project)}
                      onManage={(id) => console.log("Manage project", id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {isCreateModalOpen && (
        <CreateProjectModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <LogInModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
        onForgotPassword={() => {
          console.log("Forgot password clicked");
        }}
      />

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          onTaskCreate={(taskData) => {
            console.log("Create task:", taskData);
            // Implement API call to create task
          }}
          onJoinRequestAction={(requestId, action) => {
            console.log("Join request action:", requestId, action);
            // Implement API call to handle join request
          }}
        />
      )}
    </div>
  );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { createProject } = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createProject(
        title,
        description || undefined,
        dueDate ? `${dueDate}T23:59:00Z` : undefined,
        true
      );

      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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