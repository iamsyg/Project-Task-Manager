// // frontend/hooks/auth/useAuth.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setLoading, logout } from "@/store/slices/auth/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUser = () => {
      dispatch(setLoading(true));
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");
        
        if (storedUser && token) {
          dispatch(setUser(JSON.parse(storedUser)));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadUser();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    dispatch(logout());
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout: handleLogout,
  };
};