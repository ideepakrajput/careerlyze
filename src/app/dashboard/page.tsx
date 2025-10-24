"use client";

import { useState, useEffect } from "react";
import { User, FileText, BarChart3, Settings, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/lib/api";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.updateProfile({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
      });
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <Header />

        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard, {user?.firstName}!
              </h1>
              <p className="text-xl text-gray-600">
                Manage your resume analysis and career insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Profile
                    </h3>
                    <p className="text-gray-600">Manage your account</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {user?.firstName}{" "}
                    {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user?.isEmailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.isEmailVerified
                        ? "Verified"
                        : "Pending Verification"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>

              {/* Resume Analysis Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Resume Analysis
                    </h3>
                    <p className="text-gray-600">Analyze your resume</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Upload your resume and get AI-powered analysis with ATS
                  compatibility scores.
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Start Analysis
                </button>
              </div>

              {/* Analytics Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Analytics
                    </h3>
                    <p className="text-gray-600">View your insights</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Track your resume performance and improvement over time.
                </p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  View Analytics
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-8 max-w-md mx-auto">
                <div
                  className={`p-4 rounded-lg text-sm ${
                    message.includes("successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-6 h-6 text-gray-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-600">
                      Manage your preferences
                    </p>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-6 h-6 text-gray-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Logout</h3>
                    <p className="text-sm text-gray-600">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
