// frontend/app/providers.tsx

"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useAuth } from "@/hooks/auth/useAuth";

function AuthLoader({ children }: { children: React.ReactNode }) {
  useAuth(); // 🔥 restores user on refresh
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
   return (
    <Provider store={store}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}