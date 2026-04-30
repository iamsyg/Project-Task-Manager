// frontend/components/dashboard/Header.tsx
"use client";

import { useState } from "react";
import {
  FolderKanban,
  Users,
  CheckCircle,
  Clock,
  MoreVertical,
  Calendar,
  AlertCircle,
} from "lucide-react";

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

interface ProjectCardProps {
  project: Project;
  onView: (projectId: string) => void;
  onManage?: (projectId: string) => void;
}

export function ProjectCard({ project, onView, onManage }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const progress = (project.completedTasksCount / project.tasksCount) * 100 || 0;

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Progress: "bg-blue-100 text-blue-700 border-blue-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
  };

  const statusIcons = {
    Pending: Clock,
    Progress: AlertCircle,
    Completed: CheckCircle,
  };
  const StatusIcon = statusIcons[project.status];

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Gradient top bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          project.status === "Completed"
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : project.status === "Progress"
            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
            : "bg-gradient-to-r from-yellow-500 to-orange-500"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <FolderKanban className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Menu button (admin only) */}
          {project.role === "admin" && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onManage?.(project.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Manage Project
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{project.status}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              <span className="font-medium">{project.membersCount}</span> members
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              <span className="font-medium">
                {project.completedTasksCount}/{project.tasksCount}
              </span>{" "}
              tasks
            </span>
          </div>
          {project.dueDate && (
            <div className="flex items-center space-x-2 text-sm col-span-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Due:{" "}
                {new Date(project.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                project.status === "Completed"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-5">
          <button
            onClick={() => onView(project.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            View Details
          </button>
          {project.role === "admin" && (
            <button
              onClick={() => onManage?.(project.id)}
              className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-sm"
            >
              Manage
            </button>
          )}
        </div>

        {/* Project Code (admin only) */}
        {project.role === "admin" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Project Code:</span>
              <code className="px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-700">
                {project.projectCode}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}