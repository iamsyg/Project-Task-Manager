// frontend/store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import projectReducer from "./slices/project/projectSlice";
import projectListReducer from "./slices/project/projectListSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    projectList: projectListReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Types for TypeScript (VERY IMPORTANT)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;