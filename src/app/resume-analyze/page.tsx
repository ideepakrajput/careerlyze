"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { tokenUtils } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Upload,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Briefcase,
  FileUp,
  FileEdit,
} from "lucide-react";

interface AnalysisData {
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
}

interface Resume {
  _id: string;
  fileName: string;
  originalName: string;
  jobTitle: string;
  jobDescription: string;
  analysisData: AnalysisData;
  createdAt: string;
}

export default function ResumeAnalyze() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }
      setFormData({ ...formData, file });
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.jobTitle || !formData.jobDescription) {
      setError("Please fill in all fields and select a file");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = tokenUtils.getToken();
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.file);
      formDataToSend.append("jobTitle", formData.jobTitle);
      formDataToSend.append("jobDescription", formData.jobDescription);

      const response = await fetch("/api/resume-analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Resume analyzed successfully!");
        setFormData({ jobTitle: "", jobDescription: "", file: null });

        // Navigate to detailed analysis page
        if (data.resumeId) {
          setTimeout(() => {
            router.push(`/resume-analysis/${data.resumeId}`);
          }, 1500);
        }
      } else {
        setError(data.error || "Failed to analyze resume");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Resume Analysis
              </h1>
              <p className="text-lg text-gray-600">
                Upload your resume and get AI-powered analysis against job
                requirements
              </p>
            </div>

            {/* Upload Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="h-6 w-6 mr-2 text-blue-600" />
                Analyze New Resume
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                        placeholder="e.g., Software Engineer"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume File (PDF)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                        <FileUp className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none z-20">
                      <FileEdit className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobDescription: e.target.value,
                        })
                      }
                      rows={10}
                      className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-blue-400 bg-white resize-none"
                      placeholder="Paste the complete job description here..."
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Resume...
                    </div>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
