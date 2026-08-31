"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getSession,
  loginWithPin,
  logout as clearSession,
  type DemoUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: DemoUser | null;
  loading: boolean;
  login: (
    identifier: string,
    pin: string
  ) => { success: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  const login = useCallback((identifier: string, pin: string) => {
    const result = loginWithPin(identifier, pin);
    if (result.success) {
      setUser(result.session.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
