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
  UserPlus,
  MoreVertical,
  Copy,
  Check,
  Flag,
  MessageCircle,
  Paperclip,
} from "lucide-react";

import { Project, Members, Tasks } from "@/store/slices/project/projectSlice";
import { useCreateTask } from "@/hooks/project/task/useCreateTask";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onTaskCreate?: (taskData: any) => void;
  onTaskUpdate?: (taskId: string, updates: any) => void;
  onMemberAdd?: (email: string) => void;
  onStatusChange?: (status: string) => void;
}

export function ProjectModal({ 
  isOpen, 
  onClose, 
  project, 
  onTaskUpdate, 
  onMemberAdd, 
  onStatusChange 
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "members">("tasks");
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
    navigator.clipboard.writeText(project.project_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Transform members data for display
  const displayMembers = project.members?.map((member: Members) => ({
    id: member.user?.id || member.id,
    name: member.user?.name || "Unknown User",
    email: member.user?.email || "",
    role: member.role,
    joinedAt: member.joined_at,
  })) || [];

  // Transform tasks data for display
  const displayTasks = project.tasks?.map((task: Tasks) => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status,
    assignedTo: {
      id: task.assigned_to?.id || "",
      name: task.assigned_to?.name || "Unassigned",
      email: task.assigned_to?.email || "",
    },
    dueDate: task.due_date,
    createdAt: task.created_at,
    comments: 0,
    attachments: 0,
  })) || [];

  const filteredTasks = displayTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesFilter = taskFilter === "all" || task.status === taskFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusCounts = () => {
    return {
      all: displayTasks.length,
      pending: displayTasks.filter(t => t.status === "pending").length,
      in_progress: displayTasks.filter(t => t.status === "in_progress").length,
      completed: displayTasks.filter(t => t.status === "completed").length,
    };
  };

  const statusCounts = getStatusCounts();
  const StatusIcon = statusIcons[project.status];
  const userRole = project.current_user_role || (project.is_admin ? "admin" : "member");

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
              <p className="text-gray-600">{project.description || "No description provided"}</p>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{displayMembers.length} members</span>
                </div>
                {project.due_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Flag className="w-4 h-4" />
                  <span>Created by {project.created_by?.name || "Unknown"}</span>
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
                  {project.project_code}
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
              Tasks ({displayTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "members"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Members ({displayMembers.length})
            </button>
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

                {userRole === "admin" && (
                  <button
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Task</span>
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">No tasks found</div>
                    <p className="text-sm text-gray-500">
                      {taskSearch || taskFilter !== "all" 
                        ? "Try adjusting your search or filter" 
                        : userRole === "admin" 
                          ? "Click 'Create Task' to add your first task" 
                          : "No tasks have been created yet"}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const TaskStatusIcon = statusIcons[task.status];
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";
                    
                    return (
                      <div key={task.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
                                  {/* <span className="flex items-center gap-1">
                                    <TaskStatusIcon className="w-3 h-3" />
                                    {task.status.replace("_", " ")}
                                  </span> */}
                                </span>
                                {isOverdue && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                    Overdue
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{task.description || "No description"}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Assigned to: {task.assignedTo.name}</span>
                                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                              </div>
                            </div>
                            
                            {userRole === "admin" && (
                              <button 
                                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div>

                          {/* Expandable details */}
                          {expandedTaskId === task.id && userRole === "admin" && (
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
                  })
                )}
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                {userRole === "admin" && (
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              {showAddMember && userRole === "admin" && (
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
                {displayMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">No members yet</div>
                    <p className="text-sm text-gray-500">
                      {userRole === "admin" 
                        ? "Click 'Add Member' to invite team members" 
                        : "Check back later for team members"}
                    </p>
                  </div>
                ) : (
                  displayMembers.map((member) => (
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
                      </div>
                    </div>
                  ))
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
          members={displayMembers}
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
}: {
  onClose: () => void;
  projectId: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
  }>;
  
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"pending" | "progress" | "completed">("pending");

  const { createTask } = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo) return;

    try {
      const res = await createTask({
        project_id: projectId,
        title,
        description,
        assigned_to: assignedTo,
        status,
        due_date: dueDate ? `${dueDate}T23:59:00Z` : null,
      })
    }
      catch (err) {
        console.error("Failed to create task:", err);
        alert("Failed to create task. Please try again.");
      }

    
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "progress" | "completed")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="progress">In Progress</option>
              <option value="completed">Completed</option>
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