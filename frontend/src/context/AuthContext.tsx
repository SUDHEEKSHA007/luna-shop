"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { apiFetch } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authError: string | null;
  setAuthError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("luna_auth_token");
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    apiFetch<{ user: User }>("/api/auth/me", {}, savedToken)
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem("luna_auth_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await apiFetch<{ token: string; user: User }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("luna_auth_token", res.token);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to log in");
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await apiFetch<{ token: string; user: User }>(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        }
      );
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("luna_auth_token", res.token);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to create account");
      throw err;
    }
  };

  const demoLogin = async () => {
    return login("demo@luna.com", "luna123");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("luna_auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        setAuthError,
      }}
    >
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

