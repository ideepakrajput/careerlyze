"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Calendar,
  Star,
  Award,
  Target,
  Users,
  Activity,
  Download,
  Share2,
  Edit,
  Trash2,
  Filter,
  Search,
  MoreVertical,
  X,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { authAPI, tokenUtils } from "@/lib/api";

interface Resume {
  _id: string;
  originalName: string;
  jobTitle: string;
  analysisData: {
    atsScore: number;
    summary: string;
    strengths: string[];
    improvementAreas: string[];
    keywordMatch: {
      matched: string[];
      missing: string[];
    };
    recommendations: string[];
    detailedAnalysis: string;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string;
      github: string;
      website: string;
    };
  };
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "score" | "name">("date");
  const [showAllResumes, setShowAllResumes] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user's resumes
  useEffect(() => {
    fetchResumes();
  }, []);

  // Initialize profile data when modal opens
  useEffect(() => {
    if (showProfileModal && user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Reset password visibility states
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [showProfileModal, user]);

  const fetchResumes = async () => {
    try {
      const token = tokenUtils.getToken();
      const response = await fetch("/api/resume-analyze", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(data.data); // Show all resumes
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setIsLoadingResumes(false);
    }
  };

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    // Validate passwords if changing password
    if (profileData.newPassword || profileData.currentPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        setProfileError("New passwords do not match");
        setProfileLoading(false);
        return;
      }
      if (profileData.newPassword && profileData.newPassword.length < 6) {
        setProfileError("New password must be at least 6 characters");
        setProfileLoading(false);
        return;
      }
    }

    try {
      // Update profile information
      if (
        profileData.firstName !== user?.firstName ||
        profileData.lastName !== user?.lastName
      ) {
        await authAPI.updateProfile({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        });
      }

      // Update password if provided
      if (profileData.newPassword && profileData.currentPassword) {
        await authAPI.changePassword(
          profileData.currentPassword,
          profileData.newPassword
        );
      }

      setProfileSuccess("Profile updated successfully!");
      setProfileData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSuccess("");
      }, 2000);
    } catch (error: any) {
      setProfileError(
        error.response?.data?.error || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const token = tokenUtils.getToken();
      const response = await fetch(`/api/resume-analyze/${resumeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r._id !== resumeId));
        setMessage("Analysis deleted successfully");
      } else {
        setMessage("Failed to delete analysis");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  // Filter and sort resumes
  const filteredAndSortedResumes = resumes
    .filter((resume) => {
      const matchesSearch =
        resume.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterScore === "all" ||
        (filterScore === "high" && resume.analysisData.atsScore >= 80) ||
        (filterScore === "medium" &&
          resume.analysisData.atsScore >= 60 &&
          resume.analysisData.atsScore < 80) ||
        (filterScore === "low" && resume.analysisData.atsScore < 60);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.analysisData.atsScore - a.analysisData.atsScore;
        case "name":
          return a.originalName.localeCompare(b.originalName);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const displayedResumes = showAllResumes
    ? filteredAndSortedResumes
    : filteredAndSortedResumes.slice(0, 6);

  // Calculate statistics
  const totalResumes = resumes.length;
  const averageScore =
    totalResumes > 0
      ? Math.round(
          resumes.reduce((sum, r) => sum + r.analysisData.atsScore, 0) /
            totalResumes
        )
      : 0;
  const highScoreResumes = resumes.filter(
    (r) => r.analysisData.atsScore >= 80
  ).length;
  const recentResumes = resumes.filter((r) => {
    const daysSinceCreated =
      (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreated <= 7;
  }).length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <Header />

        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.firstName}! 👋
                  </h1>
                  <p className="text-lg text-gray-600">
                    Here's your resume analysis overview
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <button
                    onClick={() => router.push("/resume-analyze")}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    New Analysis
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Analyses
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalResumes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {averageScore}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      High Scores
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {highScoreResumes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      This Week
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentResumes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Profile Settings
                    </h3>
                    <p className="text-blue-100 text-sm mb-4">
                      Manage your account information
                    </p>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Update Profile
                    </button>
                  </div>
                  <User className="h-12 w-12 text-blue-200" />
                </div>
              </div>

              <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Analyze Resume
                    </h3>
                    <p className="text-green-100 text-sm mb-4">
                      Get AI-powered insights
                    </p>
                    <button
                      onClick={() => router.push("/resume-analyze")}
                      className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                    >
                      Start Analysis
                    </button>
                  </div>
                  <BarChart3 className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      View Analytics
                    </h3>
                    <p className="text-purple-100 text-sm mb-4">
                      Track your progress
                    </p>
                    <button
                      onClick={() => setShowAllResumes(true)}
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <TrendingUp className="h-12 w-12 text-purple-200" />
                </div>
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

            {/* Resume Analysis Management */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                    Resume Analyses
                  </h2>
                  <p className="text-gray-600">
                    Manage and track all your resume analyses
                  </p>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <button
                    onClick={() => setShowAllResumes(!showAllResumes)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  >
                    {showAllResumes ? "Show Less" : "Show All"}
                  </button>
                  <button
                    onClick={() => router.push("/resume-analyze")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Analysis
                  </button>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search analyses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filterScore}
                    onChange={(e) =>
                      setFilterScore(
                        e.target.value as "all" | "high" | "medium" | "low"
                      )
                    }
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High (80%+)</option>
                    <option value="medium">Medium (60-79%)</option>
                    <option value="low">Low (&lt;60%)</option>
                  </select>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "date" | "score" | "name")
                    }
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="score">Sort by Score</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>

              {isLoadingResumes ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading analyses...</p>
                </div>
              ) : displayedResumes.length > 0 ? (
                <div className="space-y-4">
                  {displayedResumes.map((resume) => (
                    <div
                      key={resume._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() =>
                        router.push(`/resume-analysis/${resume._id}`)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {resume.originalName}
                            </h3>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                resume.analysisData.atsScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : resume.analysisData.atsScore >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {resume.analysisData.atsScore}%
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Position
                              </p>
                              <p className="font-medium text-gray-900">
                                {resume.jobTitle}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Analyzed
                              </p>
                              <p className="font-medium text-gray-900">
                                {new Date(
                                  resume.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Contact
                              </p>
                              <p className="font-medium text-gray-900 truncate">
                                {resume.analysisData.contactInfo?.name ||
                                  "Not extracted"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span>
                                {resume.analysisData.strengths.length} strengths
                              </span>
                            </div>
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span>
                                {resume.analysisData.improvementAreas.length}{" "}
                                improvements
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Target className="h-4 w-4 text-blue-500 mr-1" />
                              <span>
                                {
                                  resume.analysisData.keywordMatch.matched
                                    .length
                                }{" "}
                                keywords matched
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {resume.analysisData.summary}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/resume-analysis/${resume._id}`);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteResume(resume._id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Analysis"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {!showAllResumes && filteredAndSortedResumes.length > 6 && (
                    <div className="text-center pt-6">
                      <button
                        onClick={() => setShowAllResumes(true)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Show {filteredAndSortedResumes.length - 6} More Analyses
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No analyses found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterScore !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Upload your first resume to get started with AI-powered analysis"}
                  </p>
                  <button
                    onClick={() => router.push("/resume-analyze")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Your First Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Profile Update Modal */}
            {showProfileModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Update Profile
                      </h3>
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <form
                    onSubmit={handleProfileUpdate}
                    className="p-6 space-y-6"
                  >
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Change Password (Optional)
                      </h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={profileData.currentPassword}
                            onChange={handleProfileChange}
                            className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center z-30 hover:bg-gray-50 rounded-r-lg"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={profileData.newPassword}
                            onChange={handleProfileChange}
                            className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center z-30 hover:bg-gray-50 rounded-r-lg"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={handleProfileChange}
                            className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center z-30 hover:bg-gray-50 rounded-r-lg"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Error/Success Messages */}
                    {profileError && (
                      <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {profileError}
                      </div>
                    )}

                    {profileSuccess && (
                      <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {profileSuccess}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowProfileModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {profileLoading ? "Updating..." : "Update Profile"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
