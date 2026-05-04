// frontend/store/slices/project/projectSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProjectStatus = "pending" | "in_progress" | "completed";

export interface CreatedBy {
  id: string;
  name: string;
  email: string;
}

export interface Members {
  id: string;
  role: "admin" | "member";
  joined_at: string;
  user: CreatedBy | null;
}

export interface Tasks {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assigned_to: CreatedBy | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: ProjectStatus;
  project_code: string;
  created_by: CreatedBy | null;
  require_approval?: boolean;
  created_at: string;
  updated_at: string;
  is_admin?: boolean; // This field is optional and will be set when fetching project details
  members_count?: number; // Optional, set when fetching project details
  tasks_count?: number; // Optional, set when fetching project details
  current_user_role?: "admin" | "member"; // Optional, set when fetching project details
  members?: Members[]; // Optional, set when fetching project details
  tasks?: Tasks[];
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },

    addProject(state, action: PayloadAction<Project>) {
      state.projects.unshift(action.payload);
    },

    setSelectedProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload;
    },

    updateProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id
      );

      if (index !== -1) {
        state.projects[index] = action.payload;
      }

      if (state.selectedProject?.id === action.payload.id) {
        state.selectedProject = action.payload;
      }
    },

    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );

      if (state.selectedProject?.id === action.payload) {
        state.selectedProject = null;
      }
    },

    setProjectLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setProjectError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    resetProjects(state) {
      state.projects = [];
      state.selectedProject = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProjects,
  addProject,
  setSelectedProject,
  updateProject,
  removeProject,
  setProjectLoading,
  setProjectError,
  resetProjects,
} = projectSlice.actions;

export default projectSlice.reducer;