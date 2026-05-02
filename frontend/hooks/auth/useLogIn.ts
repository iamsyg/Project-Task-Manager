// frontend/hooks/auth/useLogIn.ts

import { useAppDispatch } from "@/store/hooks";
import {
  setUser,
  setLoading,
  setError,
} from "@/store/slices/auth/authSlice";

export const useLogIn = () => {
  const dispatch = useAppDispatch();

  const handleLogIn = async (email: string, password: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to login");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        })
      );

      return {
        success: true,
        user: data.user,
      };
    } catch (err: any) {
      dispatch(setError(err.message || "Something went wrong"));

      return {
        success: false,
        error: err.message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleLogIn };
};