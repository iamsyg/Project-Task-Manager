// frontend/app/hooks/auth/useSignUp.ts

import { setUser, setLoading, setError } from "../../store/slices/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

export const useSignUp = () => {
    const dispatch = useAppDispatch();

    const signUp = async (name: string, email: string, password: string) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        console.log("Signing up with:", { name, email });

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to sign up");
            }

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
            }

            if (!response.ok) {
                throw new Error(data.message || "Failed to sign up");
            }

            localStorage.setItem(
                "user",
                JSON.stringify({ name: data.user.name, email: data.user.email })
            );

            console.log("Sign up successful, user data:", { name: data.user.name, email: data.user.email });

            dispatch(setUser({ name: data.user.name, email: data.user.email }));

        }
        catch (err: any) {
            dispatch(setError(err.message || "Something went wrong"));
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    return { signUp };
}