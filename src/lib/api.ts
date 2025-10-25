import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (
    email: string
  ): Promise<{ message: string; email?: string }> => {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (
    email: string,
    otp: string
  ): Promise<{ message: string; email: string }> => {
    const response = await api.post("/api/auth/verify-otp", { email, otp });
    return response.data;
  },

  // Reset password
  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    firstName: string;
    lastName: string;
  }): Promise<{ message: string; user: User }> => {
    const response = await api.put("/api/auth/profile", profileData);
    return response.data;
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await api.put("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Utility functions for token management
export const tokenUtils = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  removeToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },
};

export default api;
