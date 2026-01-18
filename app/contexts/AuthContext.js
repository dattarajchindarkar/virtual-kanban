"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/app/lib/api";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Load user on app start (if token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("kanban_user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("kanban_user");
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  // 🔐 REAL LOGIN (JWT)
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 1️⃣ Call backend login API
      const res = await api.post("/auth/login", { email, password });

      // 2️⃣ Get JWT
      const token = res.data.token;

      // 3️⃣ STORE JWT (MOST IMPORTANT)
      localStorage.setItem("token", token);

      // 4️⃣ Store minimal user for UI
      const userData = { email };
      localStorage.setItem("kanban_user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("kanban_user");
    setUser(null);
    window.location.href = "/login";
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
