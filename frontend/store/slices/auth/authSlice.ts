// frontend/store/slices/auth/signUpSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: {
        name: string;
        email: string;
    } | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ name: string; email: string }>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;