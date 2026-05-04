// frontend/hooks/project/useGetProjectDetails.ts

import { useAppDispatch } from "@/store/hooks";
import {
  setSelectedProject,
  setProjectLoading,
  setProjectError,
} from "@/store/slices/project/projectSlice";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const useGetProjectDetails = () => {
  const dispatch = useAppDispatch();

  const getProjectDetails = async (projectId: string) => {
    dispatch(setProjectLoading(true));
    dispatch(setProjectError(null));

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/fetch/${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to fetch project details"
        );
      }

      // ✅ Store full project details
      dispatch(setSelectedProject(data.project));

      return data.project;
    } catch (err: any) {
      dispatch(setProjectError(err.message || "Something went wrong"));

      return {
        success: false,
        error: err.message,
      };
    } finally {
      dispatch(setProjectLoading(false));
    }
  };

  return { getProjectDetails };
};