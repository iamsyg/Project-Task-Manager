// frontend/hooks/project/task/useCreateTask.ts

"use client";

import { useAppDispatch } from "@/store/hooks";
import { setProjectLoading, setProjectError, addTaskToSelectedProject } from "@/store/slices/project/projectSlice";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface CreateTaskPayload {
  project_id: string;
  title: string;
  description?: string | null;
  assigned_to: string;
  status?: "pending" | "progress" | "completed";
  due_date?: string | null;
}

export const useCreateTask = () => {
  const dispatch = useAppDispatch();

  const createTask = async (payload: CreateTaskPayload) => {
    dispatch(setProjectLoading(true));
    dispatch(setProjectError(null));

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/task/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to create task"
        );
      }

      // Update UI instantly
      dispatch(addTaskToSelectedProject(data.task));

      return data.task;
    } catch (err: any) {
      dispatch(setProjectError(err.message || "Something went wrong"));
      throw err;
    } finally {
      dispatch(setProjectLoading(false));
    }
  };

  return { createTask };
};