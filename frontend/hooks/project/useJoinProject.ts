// frontend/hooks/project/useJoinProject.ts

import { useAppDispatch } from "@/store/hooks";
import {
  addProject,
  setProjectLoading,
  setProjectError,
} from "@/store/slices/project/projectListSlice";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const useJoinProject = () => {
  const dispatch = useAppDispatch();

  const joinProject = async (projectCode: string) => {
    dispatch(setProjectLoading(true));
    dispatch(setProjectError(null));

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_code: projectCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to join project");
      }

      if (data.status === "success") {
        dispatch(addProject(data.project));
      }

      return data;
    } catch (err: any) {
      dispatch(setProjectError(err.message || "Something went wrong"));

      return {
        status: "error",
        error: err.message || "Something went wrong",
      };
    } finally {
      dispatch(setProjectLoading(false));
    }
  };

  return { joinProject };
};