// frontend/store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./slices/auth/signInSlice";

export const store = configureStore({
  reducer: {
    signIn: signInReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Types for TypeScript (VERY IMPORTANT)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;