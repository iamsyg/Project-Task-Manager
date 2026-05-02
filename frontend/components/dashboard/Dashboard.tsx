// frontend/components/dashboard/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Plus, Search, LayoutGrid, List, FolderKanban } from "lucide-react";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { LogInModal } from "@/components/auth/LogInModal";
import { useAppSelector } from "@/store/hooks";
import { useGetProjects } from "@/hooks/project/useGetProjects";
import { useCreateProject } from "@/hooks/project/useCreateProject";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { projects, loading } = useAppSelector((state) => state.projectList);

  const { getProjects } = useGetProjects();

  useEffect(() => {
    if (isAuthenticated) {
      getProjects();
    }
  }, [isAuthenticated]);

  const handleCreateProjectClick = () => {
    if (!isAuthenticated) {
      setIsSignUpOpen(true);
      return;
    }

    setIsCreateModalOpen(true);
  };

  const filteredProjects = projects.filter((project) => {
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

            <button
              onClick={handleCreateProjectClick}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>

          {!isAuthenticated && (
            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Please login or sign up to create and view your projects.
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-xl p-1">
                    {["all", "pending", "in_progress", "completed"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status as any)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                            filterStatus === status
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {status.replace("_", " ")}
                        </button>
                      )
                    )}
                  </div>

                  <button onClick={() => setViewMode("grid")}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>

                  <button onClick={() => setViewMode("list")}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading projects...</p>
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
                    className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
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
                  {filteredProjects.map((project) => (
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
                      onView={(id) => console.log("View project", id)}
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
          // Optional: Add forgot password functionality
          console.log("Forgot password clicked");
        }}
      />
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter project title"
              required
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter project description"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
}