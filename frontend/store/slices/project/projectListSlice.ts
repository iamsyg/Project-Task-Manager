// frontend/store/slices/project/projectListSlice.ts


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectListItem {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  project_code: string;

  members_count: number;
  tasks_count: number;

  role: "admin" | "member";
  is_admin: boolean;

  created_at: string;
}

interface ProjectState {
  projects: ProjectListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

const projectListSlice = createSlice({
  name: "projectList",
  initialState,
  reducers: {
    // 🔹 Fetch all projects
    setProjects(state, action: PayloadAction<ProjectListItem[]>) {
      state.projects = action.payload;
    },

    // 🔹 Add single project (after create)
    addProject(state, action: PayloadAction<ProjectListItem>) {
      state.projects.unshift(action.payload);
    },

    // 🔹 Loading
    setProjectLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // 🔹 Error
    setProjectError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // 🔹 Reset (logout case)
    resetProjects(state) {
      state.projects = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProjects,
  addProject,
  setProjectLoading,
  setProjectError,
  resetProjects,
} = projectListSlice.actions;

export default projectListSlice.reducer;