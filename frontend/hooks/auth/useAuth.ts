// frontend/hooks/auth/useAuth.ts

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading, logout } from "@/store/slices/auth/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      dispatch(setLoading(true));

      try {
        // 1. Try restoring from localStorage first (instant, no flicker)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));
        }

        // 2. Always verify with backend using the httpOnly cookie
        //    This is the source of truth — localStorage is just a cache
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include", // sends the httpOnly cookie
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Sync localStorage with fresh data from backend
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(setUser(data.user));
        } else if (response.status === 401) {
          // Cookie is missing/expired — try refreshing the access token
          const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (refreshResponse.ok) {
            // New access token cookie is now set, retry /me
            const retryResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            if (retryResponse.ok) {
              const data = await retryResponse.json();
              localStorage.setItem("user", JSON.stringify(data.user));
              dispatch(setUser(data.user));
            } else {
              throw new Error("Session expired");
            }
          } else {
            throw new Error("Session expired");
          }
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        localStorage.removeItem("user");
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);
};