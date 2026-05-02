// frontend/components/dashboard/ProjectModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  UserPlus,
  UserCheck,
  MoreVertical,
  Send,
  Copy,
  Check,
  Flag,
  MessageCircle,
  Paperclip,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo: {
    id: string;
    name: string;
    email: string;
  };
  dueDate: string;
  createdAt: string;
  comments?: number;
  attachments?: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  joinedAt: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface Project {
  id: string;
  title: string;
  description: string;
  projectCode: string;
  status: "pending" | "in_progress" | "completed";
  dueDate?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  members: Member[];
  tasks: Task[];
  joinRequests: JoinRequest[];
  createdAt: string;
  updatedAt: string;
  userRole: "admin" | "member";
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onTaskCreate?: (taskData: any) => void;
  onTaskUpdate?: (taskId: string, updates: any) => void;
  onMemberAdd?: (email: string) => void;
  onJoinRequestAction?: (requestId: string, action: "approve" | "reject") => void;
  onStatusChange?: (status: string) => void;
}

// Mock data for demonstration
const mockProject: Project = {
  id: "1",
  title: "E-commerce Platform",
  description: "Build a full-stack e-commerce platform with Next.js and Stripe",
  projectCode: "PROJ-ABC123",
  status: "in_progress",
  dueDate: "2024-12-15",
  createdBy: {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
  },
  userRole: "admin",
  members: [
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      joinedAt: "2024-01-10",
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "member",
      joinedAt: "2024-01-15",
    },
    {
      id: "user3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "member",
      joinedAt: "2024-01-20",
    },
  ],
  joinRequests: [
    {
      id: "req1",
      userId: "user4",
      userName: "Alice Brown",
      userEmail: "alice@example.com",
      requestedAt: "2024-01-25T10:00:00Z",
      status: "pending",
    },
    {
      id: "req2",
      userId: "user5",
      userName: "Charlie Wilson",
      userEmail: "charlie@example.com",
      requestedAt: "2024-01-26T14:30:00Z",
      status: "pending",
    },
  ],
  tasks: [
    {
      id: "task1",
      title: "Setup Next.js project",
      description: "Initialize Next.js with TypeScript and Tailwind CSS",
      status: "completed",
      assignedTo: {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
      },
      dueDate: "2024-11-20",
      createdAt: "2024-11-01",
      comments: 3,
      attachments: 2,
    },
    {
      id: "task2",
      title: "Design database schema",
      description: "Create PostgreSQL schema for users, products, and orders",
      status: "in_progress",
      assignedTo: {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
      },
      dueDate: "2024-11-25",
      createdAt: "2024-11-05",
      comments: 5,
      attachments: 1,
    },
    {
      id: "task3",
      title: "Implement authentication",
      description: "Add JWT-based auth with NextAuth.js",
      status: "pending",
      assignedTo: {
        id: "user3",
        name: "Bob Johnson",
        email: "bob@example.com",
      },
      dueDate: "2024-11-30",
      createdAt: "2024-11-10",
      comments: 2,
      attachments: 0,
    },
  ],
  createdAt: "2024-01-10",
  updatedAt: "2024-01-10",
};

export function ProjectModal({ isOpen, onClose, project = mockProject, onTaskCreate, onTaskUpdate, onMemberAdd, onJoinRequestAction, onStatusChange }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "members" | "requests">("tasks");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  if (!isOpen) return null;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  };

  const statusIcons = {
    pending: Clock,
    in_progress: AlertCircle,
    completed: CheckCircle,
  };

  const copyProjectCode = () => {
    navigator.clipboard.writeText(project.projectCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTasks = project.tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesFilter = taskFilter === "all" || task.status === taskFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusCounts = () => {
    return {
      all: project.tasks.length,
      pending: project.tasks.filter(t => t.status === "pending").length,
      in_progress: project.tasks.filter(t => t.status === "in_progress").length,
      completed: project.tasks.filter(t => t.status === "completed").length,
    };
  };

  const statusCounts = getStatusCounts();
  const StatusIcon = statusIcons[project.status];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{project.status.replace("_", " ").toUpperCase()}</span>
                </span>
              </div>
              <p className="text-gray-600">{project.description}</p>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} members</span>
                </div>
                {project.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Flag className="w-4 h-4" />
                  <span>Created by {project.createdBy.name}</span>
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Project Code Section */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Project Code</p>
                <p className="text-xs text-gray-500">Share this code with team members to join</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1.5 bg-white rounded-lg font-mono text-sm border border-gray-200">
                  {project.projectCode}
                </code>
                <button
                  onClick={copyProjectCode}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "tasks"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tasks ({project.tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "members"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Members ({project.members.length})
            </button>
            {project.userRole === "admin" && (
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "requests"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Join Requests ({project.joinRequests.filter(r => r.status === "pending").length})
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div>
              {/* Create Task Button */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
                    />
                  </div>
                  
                  <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
                    {["all", "pending", "in_progress", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setTaskFilter(status as any)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          taskFilter === status
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {status === "all" ? "All" : status.replace("_", " ")} ({statusCounts[status as keyof typeof statusCounts]})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const TaskStatusIcon = statusIcons[task.status];
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
                  
                  return (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
                                <span className="flex items-center gap-1">
                                  <TaskStatusIcon className="w-3 h-3" />
                                  {task.status.replace("_", " ")}
                                </span>
                              </span>
                              {isOverdue && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Assigned to: {task.assignedTo.name}</span>
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              {task.comments && <span>💬 {task.comments}</span>}
                              {task.attachments && <span>📎 {task.attachments}</span>}
                            </div>
                          </div>
                          
                          {project.userRole === "admin" && (
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>

                        {/* Expandable details */}
                        {expandedTaskId === task.id && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex gap-4">
                              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                                <MessageCircle className="w-4 h-4" />
                                Add Comment
                              </button>
                              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                                <Paperclip className="w-4 h-4" />
                                Add Attachment
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                {project.userRole === "admin" && (
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              {showAddMember && project.userRole === "admin" && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter member's email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        onMemberAdd?.(memberEmail);
                        setMemberEmail("");
                        setShowAddMember(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Send Invite
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === "admin" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {member.role}
                      </span>
                      {project.userRole === "admin" && member.role !== "admin" && (
                        <button className="p-1 hover:bg-gray-200 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join Requests Tab (Admin only) */}
          {activeTab === "requests" && project.userRole === "admin" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Join Requests</h3>
              <div className="space-y-3">
                {project.joinRequests.filter(r => r.status === "pending").map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-900">{request.userName}</p>
                      <p className="text-sm text-gray-600">{request.userEmail}</p>
                      <p className="text-xs text-gray-500">
                        Requested: {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onJoinRequestAction?.(request.id, "approve")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => onJoinRequestAction?.(request.id, "reject")}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {project.joinRequests.filter(r => r.status === "pending").length === 0 && (
                  <p className="text-center text-gray-500 py-8">No pending join requests</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateTaskOpen(false)}
          projectId={project.id}
          members={project.members}
          onCreate={(taskData) => {
            onTaskCreate?.(taskData);
            setIsCreateTaskOpen(false);
          }}
        />
      )}
    </>
  );
}

// Create Task Modal Component
function CreateTaskModal({
  onClose,
  projectId,
  members,
  onCreate,
}: {
  onClose: () => void;
  projectId: string;
  members: Member[];
  onCreate: (data: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo) return;
    
    onCreate({
      title,
      description,
      assignedTo,
      dueDate: dueDate ? `${dueDate}T23:59:00Z` : undefined,
      status: "pending",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[60] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task title"
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
              placeholder="Task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
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

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </>
  );
}