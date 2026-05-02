// frontend/hooks/project/useGetProjects.ts

import { useAppDispatch } from "@/store/hooks";
import {
  setProjects,
  setProjectLoading,
  setProjectError,
} from "@/store/slices/project/projectListSlice";

export const useGetProjects = () => {
  const dispatch = useAppDispatch();

  const getProjects = async () => {
    dispatch(setProjectLoading(true));
    dispatch(setProjectError(null));

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/all`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch projects");
      }

      dispatch(setProjects(data.projects));

      return data.projects;

    } catch (err: any) {
      dispatch(setProjectError(err.message));
      throw err;
    } finally {
      dispatch(setProjectLoading(false));
    }
  };

  return { getProjects };
};