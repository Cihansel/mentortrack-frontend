// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "ADMIN" | "STUDENT" | "PARENT";

interface AuthData {
  token: string;
  role: UserRole;
  userId?: number;
  email?: string;
}

interface AuthContextValue {
  token: string | null;
  role: UserRole | null;
  userId: number | null;
  email: string | null;
  loading: boolean;

  // 🔑 TEK GİRİŞ / ÇIKIŞ NOKTALARI
  setAuth: (data: AuthData) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "mentortrack_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     🔄 Sayfa yenilenince localStorage'dan yükle
  -------------------------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AuthData = JSON.parse(saved);
        setToken(parsed.token);
        setRole(parsed.role);
        setUserId(parsed.userId ?? null);
        setEmail(parsed.email ?? null);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  /* --------------------------------------------------
     🔐 LOGIN → TEK VE DOĞRU AUTH SET
  -------------------------------------------------- */
  const setAuth = (data: AuthData) => {
    setToken(data.token);
    setRole(data.role);
    setUserId(data.userId ?? null);
    setEmail(data.email ?? null);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  /* --------------------------------------------------
     🚪 LOGOUT → FRONTEND TEMİZLEME
     (Backend offline sinyalini SONRA ekleyeceğiz)
  -------------------------------------------------- */
  const logout = async () => {
    try {
      // 🔜 İleride buraya:
      // await api.post("/auth/logout") gibi bir endpoint bağlanabilir
    } catch {
      // sessiz geç
    } finally {
      setToken(null);
      setRole(null);
      setUserId(null);
      setEmail(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        email,
        loading,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
