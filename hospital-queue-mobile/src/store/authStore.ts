import { create } from 'zustand';

interface AuthState {
  phone: string;
  token: string | null;
  isAuthenticated: boolean;
  setPhone: (phone: string) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (val: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  phone: '',
  token: null,
  isAuthenticated: false,
  setPhone: (phone) => set({ phone }),
  setToken: (token) => set({ token }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  reset: () => set({ phone: '', token: null, isAuthenticated: false }),
}));
