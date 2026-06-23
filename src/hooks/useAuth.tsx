"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    businessName?: string;
    phone?: string;
    city?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("shopcongo_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem("shopcongo_user");
    }
    setLoading(false);
  }, []);

  const isAuthPage = pathname.startsWith("/auth");
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (!loading && !user && !isAuthPage && !isLandingPage) {
      router.push("/auth/login");
    }
  }, [user, loading, isAuthPage, isLandingPage, router]);

  const login = async (email: string, _password: string) => {
    const stored = localStorage.getItem("shopcongo_user");
    let mockUser: User;

    if (stored) {
      const existing = JSON.parse(stored);
      if (existing.email === email) {
        mockUser = existing;
      } else {
        mockUser = {
          id: "user_" + Date.now(),
          email,
          name: email.split("@")[0],
        };
      }
    } else {
      mockUser = {
        id: "user_" + Date.now(),
        email,
        name: email.split("@")[0],
      };
    }

    localStorage.setItem("shopcongo_user", JSON.stringify(mockUser));
    setUser(mockUser);
    router.push("/dashboard");
  };

  const register = async (data: {
    email: string;
    name: string;
    businessName?: string;
    phone?: string;
    city?: string;
  }) => {
    const mockUser: User = {
      id: "user_" + Date.now(),
      email: data.email,
      name: data.name,
      businessName: data.businessName,
      phone: data.phone,
      city: data.city,
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
