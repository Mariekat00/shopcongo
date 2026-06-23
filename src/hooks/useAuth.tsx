"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    businessName: string;
    phone: string;
    city: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("shopcongo_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    const mockUser: User = {
      id: "user_" + Date.now(),
      email,
      name: email.split("@")[0],
    };
    localStorage.setItem("shopcongo_user", JSON.stringify(mockUser));
    setUser(mockUser);
    router.push("/dashboard");
  };

  const register = async (data: { email: string; name: string }) => {
    const mockUser: User = {
      id: "user_" + Date.now(),
      email: data.email,
      name: data.name,
    };
    localStorage.setItem("shopcongo_user", JSON.stringify(mockUser));
    setUser(mockUser);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("shopcongo_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
