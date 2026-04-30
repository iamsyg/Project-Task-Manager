// frontend/store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Types for TypeScript (VERY IMPORTANT)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;