"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { User } from "@/lib/api";
import { tokenUtils } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = tokenUtils.getToken();
    const userData = tokenUtils.getUser();

    if (token && userData) {
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    tokenUtils.setToken(token);
    tokenUtils.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    tokenUtils.removeToken();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    tokenUtils.setUser(userData);
    setUser(userData);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };
};

export { AuthContext };
