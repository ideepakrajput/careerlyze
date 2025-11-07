"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { tokenUtils } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/styles/markdown.css";
import {
  ArrowLeft,
  FileText,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Star,
  TrendingUp,
  Target,
  Lightbulb,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Eye,
  EyeOff,
  Briefcase,
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
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  updatedResume?: string;
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

export default function ResumeAnalysisDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string>("");
  const [showUpdatedResume, setShowUpdatedResume] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      if (isAuthenticated) {
        const { id } = await params;
        console.log("Resume analysis page - received ID:", id);
        if (id && typeof id === "string") {
          fetchResumeAnalysis(id);
        }
      }
    };

    loadResume();
  }, [isAuthenticated]);

  const fetchResumeAnalysis = async (resumeId: string) => {
    try {
      const token = tokenUtils.getToken();
      const response = await fetch(`/api/resume-analyze/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResume(data.data);
        // Create PDF URL for viewing
        if (data.data.fileName) {
          const token = tokenUtils.getToken();
          setPdfUrl(
            `/api/resume-analyze/pdf/${data.data.fileName}?token=${token}`
          );
        }
      } else {
        setError("Failed to fetch analysis details");
      }
    } catch (error) {
      console.error("Error fetching resume analysis:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return "border-green-200";
    if (score >= 60) return "border-yellow-200";
    return "border-red-200";
  };

  // Check if user has access to updated resume feature
  const ALLOWED_EMAILS = ["contact.deepakrajput@gmail.com"];
  const hasAccessToUpdatedResume = user && ALLOWED_EMAILS.includes(user.email);

  // Download updated resume PDF
  const downloadUpdatedResumePdf = async () => {
    if (!resume?._id) return;

    setDownloadingPdf(true);
    try {
      const token = tokenUtils.getToken();
      const response = await fetch(`/api/resume-analyze/${resume._id}/download-pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `updated-resume-${resume.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${resume._id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Utility function to normalize social media URLs
  const normalizeUrl = (url: string, platform: string) => {
    if (!url) return "";

    // Remove whitespace
    url = url.trim();

    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Remove common prefixes that users might include
    const cleanUrl = url
      .replace(/^(www\.)?/, '')
      .replace(/^@/, '')
      .replace(/^\//, '');

    // Build the full URL based on platform
    switch (platform) {
      case 'linkedin':
        // Handle linkedin.com/in/ prefix if already included
        if (cleanUrl.startsWith('linkedin.com/in/')) {
          return `https://${cleanUrl}`;
        }
        return `https://linkedin.com/in/${cleanUrl}`;

      case 'github':
        // Handle github.com prefix if already included
        if (cleanUrl.startsWith('github.com/')) {
          return `https://${cleanUrl}`;
        }
        return `https://github.com/${cleanUrl}`;

      case 'website':
        // For websites, add https:// if no protocol
        return `https://${cleanUrl}`;

      default:
        return url;
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analysis details...</p>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !resume) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {error || "Analysis not found"}
              </p>
              <button
                onClick={() => router.push("/resume-analyze")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Resume Analysis
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Resume Analysis Report
                    </h1>
                    <p className="text-gray-600 mb-2">
                      <strong>Resume:</strong> {resume.originalName}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Position:</strong> {resume.jobTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      Analyzed on{" "}
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-4 lg:mt-0">
                    <div
                      className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold border-4 ${getScoreBgColor(
                        resume.analysisData.atsScore
                      )} ${getScoreColor(
                        resume.analysisData.atsScore
                      )} ${getScoreBorderColor(resume.analysisData.atsScore)}`}
                    >
                      {resume.analysisData.atsScore}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      ATS Score
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                Job Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Position Applied For
                  </h3>
                  <p className="text-gray-700 text-lg">{resume.jobTitle}</p>
                </div>
                {resume.jobDescription && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Job Description
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">
                          {resume.jobDescription}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            {resume.analysisData.contactInfo && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resume.analysisData.contactInfo.name && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {resume.analysisData.contactInfo.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {resume.analysisData.contactInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a
                          href={`mailto:${resume.analysisData.contactInfo.email}`}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {resume.analysisData.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {resume.analysisData.contactInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a
                          href={`tel:${resume.analysisData.contactInfo.phone}`}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {resume.analysisData.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {resume.analysisData.contactInfo.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                          {resume.analysisData.contactInfo.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {resume.analysisData.contactInfo.linkedin && (
                    <div className="flex items-center">
                      <Linkedin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">LinkedIn</p>
                        <a
                          href={normalizeUrl(resume.analysisData.contactInfo.linkedin, 'linkedin')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}

                  {resume.analysisData.contactInfo.github && (
                    <div className="flex items-center">
                      <Github className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">GitHub</p>
                        <a
                          href={normalizeUrl(resume.analysisData.contactInfo.github, 'github')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}

                  {resume.analysisData.contactInfo.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a
                          href={normalizeUrl(resume.analysisData.contactInfo.website, 'website')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            {pdfUrl && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                    Resume PDF
                  </h2>
                  <button
                    onClick={() => {
                      setShowPdf(!showPdf);
                      if (!showPdf) {
                        setPdfLoading(true);
                        setPdfError("");
                      }
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showPdf ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide PDF
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View PDF
                      </>
                    )}
                  </button>
                </div>

                {showPdf && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-[800px]">
                      <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0"
                        title="Resume PDF"
                        onLoad={() => setPdfLoading(false)}
                        onError={() => {
                          setPdfError("Failed to load PDF in iframe");
                          setPdfLoading(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Executive Summary
              </h2>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {resume.analysisData.summary}
                </ReactMarkdown>
              </div>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Strengths */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-green-700 mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Key Strengths
                </h3>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {resume.analysisData.strengths
                      .map((strength, index) => `- ${strength}`)
                      .join("\n")}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-red-700 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  Areas for Improvement
                </h3>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {resume.analysisData.improvementAreas
                      .map((area, index) => `- ${area}`)
                      .join("\n")}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-2 text-blue-600" />
                Keyword Analysis
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Matched Keywords */}
                <div>
                  <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Matched Keywords (
                    {resume.analysisData.keywordMatch.matched.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.analysisData.keywordMatch.matched.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div>
                  <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Missing Keywords (
                    {resume.analysisData.keywordMatch.missing.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.analysisData.keywordMatch.missing.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded-full border border-red-200"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
                Recommendations
              </h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {resume.analysisData.recommendations
                    .map((rec, index) => `- ${rec}`)
                    .join("\n")}
                </ReactMarkdown>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                Detailed Analysis
              </h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {resume.analysisData.detailedAnalysis}
                </ReactMarkdown>
              </div>
            </div>

            {/* Updated Resume Section - Only for authorized users */}
            {hasAccessToUpdatedResume && resume.analysisData.updatedResume && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                    Updated Resume (Optimized)
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowUpdatedResume(!showUpdatedResume)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {showUpdatedResume ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Markdown
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          View Markdown
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadUpdatedResumePdf}
                      disabled={downloadingPdf}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingPdf ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {showUpdatedResume && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="markdown-content prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {resume.analysisData.updatedResume}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {!showUpdatedResume && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> This is an AI-optimized version of your resume based on the analysis. 
                      Click "View Markdown" to see the updated content or "Download PDF" to get a formatted PDF version.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/resume-analyze")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                Analyze Another Resume
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div >

        <Footer />
      </div >
    </ProtectedRoute >
  );
}
