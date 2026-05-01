// frontend/hooks/project/useCreateProject.ts

import { useAppDispatch } from "@/store/hooks";
import {
  addProject,
  setProjectLoading,
  setProjectError,
} from "@/store/slices/project/projectSlice";

export const useCreateProject = () => {
  const dispatch = useAppDispatch();

  const createProject = async (
    title: string,
    description?: string,
    due_date?: string,
    require_approval: boolean = false
  ) => {
    dispatch(setProjectLoading(true));
    dispatch(setProjectError(null));

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            due_date,
            require_approval,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create project");
      }

      dispatch(addProject(data.project));

      return data.project;

    } catch (err: any) {
      dispatch(setProjectError(err.message || "Something went wrong"));
      throw err;
    } finally {
      dispatch(setProjectLoading(false));
    }
  };

  return { createProject };
};