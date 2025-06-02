import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface AuthState {
  user: DecodedToken | null;
  setToken: (token: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

function isTokenExpiredHelper(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return true;
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let initialUser: DecodedToken | null = null;

  if (token && !isTokenExpiredHelper(token)) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      initialUser = decoded;
    } catch {
      localStorage.removeItem("token");
    }
  }

  return {
    user: initialUser,

    setToken: (token: string) => {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        localStorage.setItem("token", token);
        set({ user: decoded });
      } catch {
        set({ user: null });
        localStorage.removeItem("token");
      }
    },

    logout: () => {
      set({ user: null });
      localStorage.removeItem("token");
    },

    isTokenExpired: () => {
      const token = localStorage.getItem("token");
      return !token || isTokenExpiredHelper(token);
    },
  };
});
