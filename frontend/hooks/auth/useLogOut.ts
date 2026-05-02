// frontend/hooks/auth/useLogOut.ts

import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth/authSlice";
import { useRouter } from "next/navigation";

const useLogOut = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.warn("Logout API failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      dispatch(logout());
      router.push("/"); // redirect to home/login
    }
  };

  return { handleLogout };
};

export default useLogOut;