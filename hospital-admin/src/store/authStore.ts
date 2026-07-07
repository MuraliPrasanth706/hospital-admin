import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  role: string | null;
  clinicId: string | null;

  setAuth: (token: string, role: string, clinicId?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      clinicId: null,

      setAuth: (token, role, clinicId) => {
        // Mirror in localStorage so the apiClient interceptor can read it
        // synchronously without importing the store.
        if (typeof window !== "undefined") {
          localStorage.setItem("queuecare_token", token);
        }
        set({ token, role, clinicId: clinicId ?? null });
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("queuecare_token");
        }
        set({ token: null, role: null, clinicId: null });
      },
    }),
    {
      name: "queuecare_auth",
    },
  ),
);
